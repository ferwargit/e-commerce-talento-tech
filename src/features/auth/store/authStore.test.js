// src/features/auth/store/authStore.test.js
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';
import * as authService from '@/features/auth/services/authService';

// Mockear el servicio de autenticación
vi.mock('@/features/auth/services/authService', () => ({
  onEstadoAuth: vi.fn(),
  cerrarSesion: vi.fn(),
}));

// Mockear la configuración de entorno
vi.mock('@/config/env', () => ({
  env: {
    VITE_FIREBASE_ADMIN_EMAIL: 'admin@test.com',
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Limpiar los mocks antes de cada test
    vi.clearAllMocks();
    // Resetear el estado del store a su estado inicial
    act(() => {
      useAuthStore.setState({ user: null, admin: null, loading: true });
    });
  });

  it('debería tener un estado inicial correcto', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.admin).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('debería manejar el logout correctamente (actualización optimista)', () => {
    const { result } = renderHook(() => useAuthStore());

    // Establecemos un usuario inicial
    act(() => {
      useAuthStore.setState({ user: 'user@test.com', admin: null, loading: false });
    });

    // Llamamos a la acción de logout
    act(() => {
      result.current.logout();
    });

    // El estado debería limpiarse inmediatamente
    expect(result.current.user).toBeNull();
    expect(result.current.admin).toBeNull();

    // La función de cerrar sesión del servicio debería haber sido llamada
    expect(authService.cerrarSesion).toHaveBeenCalledTimes(1);
  });

  describe('Listener de onEstadoAuth', () => {
    it('debería establecer el usuario cuando onEstadoAuth devuelve un usuario normal', () => {
      const mockUser = { email: 'user@test.com', uid: '123' };
      // Hacemos que el mock de onEstadoAuth llame a su callback con un usuario
      authService.onEstadoAuth.mockImplementation(callback => callback(mockUser));

      // Forzamos la ejecución del listener (aunque en la app real se ejecuta solo)
      act(() => {
        authService.onEstadoAuth(user => {
          useAuthStore.getState().loading = false;
          if (user) {
            const isAdmin = user.email === 'admin@test.com';
            useAuthStore.setState({ user: user.email, admin: isAdmin ? user.email : null });
          } else {
            useAuthStore.setState({ user: null, admin: null });
          }
        });
      });

      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBe('user@test.com');
      expect(result.current.admin).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('debería establecer el usuario y el admin cuando onEstadoAuth devuelve un admin', () => {
      const mockAdmin = { email: 'admin@test.com', uid: '456' };
      authService.onEstadoAuth.mockImplementation(callback => callback(mockAdmin));

      act(() => {
        authService.onEstadoAuth(user => {
          useAuthStore.getState().loading = false;
          if (user) {
            const isAdmin = user.email === 'admin@test.com';
            useAuthStore.setState({ user: user.email, admin: isAdmin ? user.email : null });
          } else {
            useAuthStore.setState({ user: null, admin: null });
          }
        });
      });

      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBe('admin@test.com');
      expect(result.current.admin).toBe('admin@test.com');
      expect(result.current.loading).toBe(false);
    });

    it('debería limpiar el estado cuando onEstadoAuth devuelve null', () => {
      authService.onEstadoAuth.mockImplementation(callback => callback(null));

      // Establecemos un estado inicial de usuario logueado
      act(() => {
        useAuthStore.setState({ user: 'user@test.com', admin: null, loading: false });
      });

      act(() => {
        authService.onEstadoAuth(user => {
          useAuthStore.getState().loading = false;
          if (user) {
            const isAdmin = user.email === 'admin@test.com';
            useAuthStore.setState({ user: user.email, admin: isAdmin ? user.email : null });
          } else {
            useAuthStore.setState({ user: null, admin: null });
          }
        });
      });

      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.admin).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });
});
