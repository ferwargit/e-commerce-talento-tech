import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RoleBasedGuard from './RoleBasedGuard';
import { useAuthStore } from '@/features/auth/store/authStore';
import LoginBoost from '@/features/auth/components/LoginBoost';
import AdminProductos from '@/features/admin/components/AdminProductos';

// Mock del store de Zustand
vi.mock('@/features/auth/store/authStore');

// Mock de los componentes que se renderizan en las rutas
vi.mock('@/features/auth/components/LoginBoost', () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock('@/features/admin/components/AdminProductos', () => ({
  default: () => <div>Admin Page</div>,
}));

const TestApp = ({ initialEntries = ['/'] }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<LoginBoost />} />
        <Route
          path="/admin"
          element={
            <RoleBasedGuard allowedRoles={['admin']} fallback={<Navigate to="/login" replace />} >
              <AdminProductos />
            </RoleBasedGuard>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('RoleBasedGuard', () => {
  const getRole = (state) => {
    if (state.admin) return 'admin';
    if (state.user) return 'client';
    return 'guest';
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería redirigir a la página de login si el usuario no está autenticado', () => {
    const state = { user: null, admin: null };
    useAuthStore.mockImplementation(selector => selector({ ...state, getRole: () => getRole(state) }));

    render(<TestApp initialEntries={['/admin']} />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
  });

  it('debería renderizar la página de admin si el usuario es un administrador', () => {
    const state = { user: null, admin: { email: 'admin@test.com' } };
    useAuthStore.mockImplementation(selector => selector({ ...state, getRole: () => getRole(state) }));

    render(<TestApp initialEntries={['/admin']} />);

    expect(screen.getByText('Admin Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('debería redirigir a la página de login si el usuario es un cliente pero no un administrador', () => {
    const state = { user: { email: 'user@test.com' }, admin: null };
    useAuthStore.mockImplementation(selector => selector({ ...state, getRole: () => getRole(state) }));

    render(<TestApp initialEntries={['/admin']} />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
  });
});
