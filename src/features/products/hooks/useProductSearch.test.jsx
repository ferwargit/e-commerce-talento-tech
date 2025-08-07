import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProductSearch } from './useProductSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { PATHS } from '@/constants/paths';

// --- Mocks ---
const mockNavigate = vi.fn();
const mockSetSearchParams = vi.fn();
let currentSearchParams = new URLSearchParams(); // Estado mutable para searchParams
let currentPathname = PATHS.HOME; // Estado mutable para pathname

vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: currentPathname }),
    useSearchParams: () => [currentSearchParams, mockSetSearchParams],
  };
});

// Mock del hook useDebounce
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: vi.fn((value) => value), // Por defecto, no hace debounce para simplificar el test
}));

describe('useProductSearch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockSetSearchParams.mockClear();
    currentSearchParams = new URLSearchParams(); // Resetear para cada test
    currentPathname = PATHS.HOME; // Resetear para cada test
    useDebounce.mockImplementation((value) => value); // Asegura que el debounce no interfiera
  });

  it('debería inicializar el término de búsqueda desde la URL', () => {
    currentSearchParams = new URLSearchParams('q=test');
    const { result } = renderHook(() => useProductSearch());
    expect(result.current.searchTerm).toBe('test');
  });

  it('debería actualizar el término de búsqueda al cambiar el input', () => {
    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.handleSearchChange({ target: { value: 'new search' } });
    });

    expect(result.current.searchTerm).toBe('new search');
  });

  it('debería navegar a la página de productos con el término de búsqueda', async () => {
    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.handleSearchChange({ target: { value: 'laptop' } });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`${PATHS.PRODUCTS}?q=laptop`);
    });
  });

  it('debería limpiar el parámetro q de la URL si el input está vacío y estamos en la página de productos', async () => {
    currentSearchParams = new URLSearchParams('q=existing');
    currentPathname = PATHS.PRODUCTS;

    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.handleSearchChange({ target: { value: '' } });
    });

    await waitFor(() => {
      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), { replace: true });
      const calls = mockSetSearchParams.mock.calls;
      const lastCallParams = calls[calls.length - 1][0];
      expect(lastCallParams.toString()).toBe(''); // Asegura que el 'q' se eliminó
    });
  });

  it('no debería navegar si el término de búsqueda no ha cambiado', async () => {
    currentSearchParams = new URLSearchParams('q=test');
    const { result } = renderHook(() => useProductSearch());

    // Simular que el usuario escribe el mismo término
    act(() => {
      result.current.handleSearchChange({ target: { value: 'test' } });
    });

    // No debería haber navegación porque el término es el mismo que en la URL
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('debería sincronizar el input con la URL si la URL cambia externamente', () => {
    const { result, rerender } = renderHook(() => useProductSearch());

    // Simular un cambio externo en la URL
    act(() => {
      currentSearchParams = new URLSearchParams('q=external');
      currentPathname = PATHS.PRODUCTS;
    });
    rerender(); // Forzar un re-render del hook para que vea el cambio

    expect(result.current.searchTerm).toBe('external');
  });
});