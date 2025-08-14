// src/features/auth/store/authStore.test.js
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as authService from '@/features/auth/services/authService';

// Esta variable capturará el callback real que `authStore.js` pasa a `onEstadoAuth`
let authStateCallback = () => {};

// Mockear el servicio de autenticación
vi.mock('@/features/auth/services/authService', () => ({
  // El mock ahora captura la función que el store le pasa
  onEstadoAuth: vi.fn(callback => {
    authStateCallback = callback;
  }),
  cerrarSesion: vi.fn(),
}));

// Mockear la configuración de entorno
vi.mock('@/config/env', () => ({
  env: {
    VITE_FIREBASE_ADMIN_EMAIL: 'admin@test.com',
  },
}));

// Importar el store DESPUÉS de configurar los mocks.
// Vitest hoists (eleva) vi.mock, por lo que esto funciona correctamente.
const { useAuthStore } = await import('./authStore');

describe('useAuthStore', () => {
  // Guardar el estado inicial del store
  const initialState = {
    user: null,
    admin: null,
    loading: true,
  };

  beforeEach(() => {
    // Limpiar los mocks antes de cada test
    vi.clearAllMocks();
    
    // Resetear el estado del store a sus valores iniciales, sin borrar las acciones.
    act(() => {
      useAuthStore.setState(initialState);
    });
  });

  it('debería tener un estado inicial correcto', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.admin).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(typeof result.current.getRole).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  describe('Función getRole', () => {
    it('debería retornar "guest" cuando no hay usuario ni admin', () => {
      const { result } = renderHook(() => useAuthStore());
      
      expect(result.current.getRole()).toBe('guest');
    });

    it('debería retornar "client" cuando hay usuario pero no admin', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        useAuthStore.setState({ 
          user: 'user@test.com', 
          admin: null, 
          loading: false 
        });
      });

      expect(result.current.getRole()).toBe('client');
    });

    it('debería retornar "admin" cuando hay admin (independientemente del usuario)', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        useAuthStore.setState({ 
          user: 'admin@test.com', 
          admin: 'admin@test.com', 
          loading: false 
        });
      });

      expect(result.current.getRole()).toBe('admin');
    });
  });

  describe('Función logout', () => {
    it('debería limpiar el estado inmediatamente (actualización optimista)', () => {
      const { result } = renderHook(() => useAuthStore());

      // Establecer un estado inicial con usuario logueado
      act(() => {
        useAuthStore.setState({ 
          user: 'user@test.com', 
          admin: null, 
          loading: false 
        });
      });

      // Verificar que el usuario está establecido
      expect(result.current.user).toBe('user@test.com');
      expect(result.current.getRole()).toBe('client');

      // Ejecutar logout
      act(() => {
        result.current.logout();
      });

      // Verificar que el estado se limpia inmediatamente
      expect(result.current.user).toBeNull();
      expect(result.current.admin).toBeNull();
      expect(result.current.getRole()).toBe('guest');

      // Verificar que se llama al servicio
      expect(authService.cerrarSesion).toHaveBeenCalledTimes(1);
    });

    it('debería limpiar el estado de admin correctamente', () => {
      const { result } = renderHook(() => useAuthStore());

      // Establecer estado de admin
      act(() => {
        useAuthStore.setState({ 
          user: 'admin@test.com', 
          admin: 'admin@test.com', 
          loading: false 
        });
      });

      expect(result.current.getRole()).toBe('admin');

      // Ejecutar logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.admin).toBeNull();
      expect(result.current.getRole()).toBe('guest');
    });
  });

  describe('Listener de onEstadoAuth - Integración con el store real', () => {
    it('debería establecer el estado de usuario cuando Firebase emite un usuario normal', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = { email: 'user@test.com', uid: '123' };

      // Simular que Firebase notifica un cambio de estado
      act(() => {
        authStateCallback(mockUser);
      });

      expect(result.current.user).toBe('user@test.com');
      expect(result.current.admin).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.getRole()).toBe('client');
    });
    
    it('debería establecer el estado de admin cuando Firebase emite un usuario admin', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockAdmin = { email: 'admin@test.com', uid: '456' };

      // Simular que Firebase notifica un cambio de estado
      act(() => {
        authStateCallback(mockAdmin);
      });

      expect(result.current.user).toBe('admin@test.com');
      expect(result.current.admin).toBe('admin@test.com');
      expect(result.current.loading).toBe(false);
      expect(result.current.getRole()).toBe('admin');
    });
    
    it('debería limpiar el estado cuando Firebase emite null (logout)', () => {
      const { result } = renderHook(() => useAuthStore());

      // Primero, simular un login
      act(() => {
        authStateCallback({ email: 'user@test.com' });
      });
      expect(result.current.user).toBe('user@test.com');

      // Ahora, simular un logout desde Firebase
      act(() => {
        authStateCallback(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.admin).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.getRole()).toBe('guest');
    });
  });
});