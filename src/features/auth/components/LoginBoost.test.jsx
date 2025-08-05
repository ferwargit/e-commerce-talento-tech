// src/features/auth/components/LoginBoost.test.jsx
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginBoost from './LoginBoost';
import * as authService from '@/features/auth/services/authService';
import { useAuthStore } from '@/features/auth/store/authStore';

// --- Mocks ---
vi.mock('@/features/auth/services/authService');
vi.mock('@/features/auth/store/authStore');
vi.mock('react-toastify', async () => {
  const original = await vi.importActual('react-toastify');
  return {
    ...original,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
      <ToastContainer />
    </MemoryRouter>
  );
};

describe('LoginBoost Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockImplementation(selector => {
      const state = { user: null, admin: null, logout: vi.fn() };
      return selector(state);
    });
  });

  it('debería renderizar el formulario en modo "Iniciar Sesión" por defecto', () => {
    const { container } = renderWithRouter(<LoginBoost />);
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    const form = container.querySelector('form');
    expect(within(form).getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('debería cambiar al modo "Registrarse" al hacer clic en el botón correspondiente', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginBoost />);
    const registerModeButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(registerModeButton);

    expect(screen.getByRole('heading', { name: /crear una cuenta/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
  });

  it('debería mostrar errores de validación del cliente si los campos están vacíos', async () => {
    const user = userEvent.setup();
    const { container } = renderWithRouter(<LoginBoost />);
    const form = container.querySelector('form');
    const submitButton = within(form).getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    expect(await screen.findByText(/Debe ser un email válido./i)).toBeInTheDocument();
    expect(await screen.findByText(/La contraseña debe tener al menos 6 caracteres./i)).toBeInTheDocument();
  });

  it('debería llamar a loginEmailPass al enviar el formulario de login con datos válidos', async () => {
    const user = userEvent.setup();
    authService.loginEmailPass.mockResolvedValue({ user: { email: 'test@test.com' } });
    
    const { container } = renderWithRouter(<LoginBoost />);

    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    
    const form = container.querySelector('form');
    const submitButton = within(form).getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.loginEmailPass).toHaveBeenCalledWith('test@test.com', 'password123');
      expect(authService.loginEmailPass).toHaveBeenCalledTimes(1);
    });
  });

  it('debería llamar a crearUsuario al enviar el formulario de registro con datos válidos', async () => {
    const user = userEvent.setup();
    authService.crearUsuario.mockResolvedValue({ user: { email: 'new@test.com' } });

    renderWithRouter(<LoginBoost />);
    
    await user.click(screen.getByRole('button', { name: /registrarse/i }));

    await user.type(screen.getByLabelText(/correo electrónico/i), 'new@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(authService.crearUsuario).toHaveBeenCalledWith('new@test.com', 'password123');
      expect(authService.crearUsuario).toHaveBeenCalledTimes(1);
    });
  });

  it('debería mostrar un mensaje de error del servidor si el login falla', async () => {
    const user = userEvent.setup();
    const error = { code: 'auth/wrong-password', message: 'Contraseña incorrecta.' };
    authService.loginEmailPass.mockRejectedValue(error);

    const { container } = renderWithRouter(<LoginBoost />);

    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    
    const form = container.querySelector('form');
    const submitButton = within(form).getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    const errorMessage = await screen.findByText(/el correo electrónico o la contraseña son incorrectos/i);
    expect(errorMessage).toBeInTheDocument();
  });
});