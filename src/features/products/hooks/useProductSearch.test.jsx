import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProductSearch } from './useProductSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { PATHS } from '@/constants/paths';

// --- Mocks ---
const mockNavigate = vi.fn();
const mockSetSearchParams = vi.fn();
let currentSearchParams = new URLSearchParams();
let currentPathname = PATHS.HOME;

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
  useDebounce: vi.fn((value) => value), // Por defecto, no hace debounce para simplificar tests
}));

describe('useProductSearch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockSetSearchParams.mockClear();
    currentSearchParams = new URLSearchParams();
    currentPathname = PATHS.HOME;
    useDebounce.mockImplementation((value) => value);
  });

  describe('Inicialización y Estado Básico', () => {
    it('debería inicializar con input vacío cuando no hay parámetros en URL', () => {
      const { result } = renderHook(() => useProductSearch());
      expect(result.current.searchTerm).toBe('');
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
  });

  describe('Navegación y Búsqueda', () => {
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
        expect(lastCallParams.toString()).toBe('');
      });
    });

    it('no debería navegar si el término de búsqueda no ha cambiado', async () => {
      currentSearchParams = new URLSearchParams('q=test');
      const { result } = renderHook(() => useProductSearch());

      act(() => {
        result.current.handleSearchChange({ target: { value: 'test' } });
      });

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      }, { timeout: 100 });
    });
  });

  describe('Sincronización con URL', () => {
    it('debería sincronizar el input con la URL si la URL cambia externamente', () => {
      const { result, rerender } = renderHook(() => useProductSearch());

      // Simular un cambio externo en la URL
      act(() => {
        currentSearchParams = new URLSearchParams('q=external');
        currentPathname = PATHS.PRODUCTS;
      });
      rerender();

      expect(result.current.searchTerm).toBe('external');
    });

    it('no debería crear loops infinitos al sincronizar con URL', async () => {
      const { result, rerender } = renderHook(() => useProductSearch());
      
      // Simular cambio en URL
      act(() => {
        currentSearchParams = new URLSearchParams('q=test');
      });
      rerender();

      expect(result.current.searchTerm).toBe('test');
      
      // Verificar que no hay navegaciones innecesarias
      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      }, { timeout: 200 });
    });

    it('debería ignorar sincronización cuando el usuario está escribiendo activamente', () => {
      const { result, rerender } = renderHook(() => useProductSearch());

      // Usuario escribe algo - esto activa isUserTyping
      act(() => {
        result.current.handleSearchChange({ target: { value: 'user input' } });
      });

      expect(result.current.searchTerm).toBe('user input');

      // Cambio externo en URL mientras usuario sigue escribiendo
      act(() => {
        currentSearchParams = new URLSearchParams('q=external');
      });

      // Usuario sigue escribiendo (mantiene isUserTyping activo)
      act(() => {
        result.current.handleSearchChange({ target: { value: 'user input modified' } });
      });

      rerender(); // Forzar re-render para procesar cambio de URL

      // El input debería mantener el último valor del usuario, no sincronizar con URL
      expect(result.current.searchTerm).toBe('user input modified');
    });

    it('debería manejar múltiples sincronizaciones de URL correctamente', () => {
      const { result, rerender } = renderHook(() => useProductSearch());

      // Primera sincronización
      act(() => {
        currentSearchParams = new URLSearchParams('q=first');
      });
      rerender();
      expect(result.current.searchTerm).toBe('first');

      // Segunda sincronización
      act(() => {
        currentSearchParams = new URLSearchParams('q=second');
      });
      rerender();
      expect(result.current.searchTerm).toBe('second');

      // Limpiar parámetros
      act(() => {
        currentSearchParams = new URLSearchParams();
        currentPathname = PATHS.PRODUCTS;
      });
      rerender();
      expect(result.current.searchTerm).toBe('');
    });
  });

  describe('Comportamiento con Debounce', () => {
    it('debería manejar cambios rápidos de input sin navegaciones múltiples', async () => {
      // Para este test necesitamos simular el debounce real
      let debouncedValue = '';
      useDebounce.mockImplementation((value) => {
        // Simular que el debounce solo devuelve el último valor después de un delay
        setTimeout(() => {
          debouncedValue = value;
        }, 50);
        return debouncedValue;
      });

      const { result } = renderHook(() => useProductSearch());

      // Simular escritura rápida
      act(() => {
        result.current.handleSearchChange({ target: { value: 'a' } });
      });
      
      act(() => {
        result.current.handleSearchChange({ target: { value: 'ab' } });
      });
      
      act(() => {
        result.current.handleSearchChange({ target: { value: 'abc' } });
      });

      // El estado debería reflejar el último valor
      expect(result.current.searchTerm).toBe('abc');

      // Debido a que el debounce no devuelve valores inmediatamente en este test,
      // no debería haber navegaciones
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('debería navegar correctamente cuando el debounce se resuelve', async () => {
      const { result } = renderHook(() => useProductSearch());

      // Simular una búsqueda normal (sin debounce para simplificar)
      act(() => {
        result.current.handleSearchChange({ target: { value: 'laptop' } });
      });

      // Debería navegar una sola vez
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(`${PATHS.PRODUCTS}?q=laptop`);
      });
    });
  });

  describe('Navegación a Páginas de Detalle', () => {
    it('debería pausar búsqueda al navegar a detalle de producto', async () => {
      const { result } = renderHook(() => useProductSearch());

      // Establecer valor inicial
      act(() => {
        result.current.handleSearchChange({ target: { value: 'laptop' } });
      });

      // Esperar a que se ejecute la primera navegación
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(`${PATHS.PRODUCTS}?q=laptop`);
      });

      mockNavigate.mockClear();

      // Simular navegación a detalle de producto
      act(() => {
        currentPathname = `${PATHS.PRODUCTS}/laptop-123`;
      });

      // Nueva búsqueda no debería funcionar inmediatamente
      act(() => {
        result.current.handleSearchChange({ target: { value: 'mouse' } });
      });

      // No debería navegar inmediatamente debido a la pausa
      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      }, { timeout: 50 });
    });
  });

  describe('Manejo de Parámetros URL', () => {
    it('debería limpiar parámetros correctamente manteniendo otros parámetros', async () => {
      currentSearchParams = new URLSearchParams('q=existing&category=electronics&sort=price');
      currentPathname = PATHS.PRODUCTS;

      const { result } = renderHook(() => useProductSearch());

      act(() => {
        result.current.handleSearchChange({ target: { value: '' } });
      });

      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
        const lastCall = mockSetSearchParams.mock.calls[mockSetSearchParams.mock.calls.length - 1];
        const params = lastCall[0];
        
        // Verificar que 'q' se eliminó pero otros parámetros se mantienen
        expect(params.has('q')).toBe(false);
        expect(params.get('category')).toBe('electronics');
        expect(params.get('sort')).toBe('price');
      });
    });

    it('debería codificar correctamente caracteres especiales en la búsqueda', async () => {
      const { result } = renderHook(() => useProductSearch());

      act(() => {
        result.current.handleSearchChange({ target: { value: 'búsqueda con ñ & símbolos' } });
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          `${PATHS.PRODUCTS}?q=${encodeURIComponent('búsqueda con ñ & símbolos')}`
        );
      });
    });
  });

  describe('Edge Cases', () => {
    it('debería manejar strings con solo espacios como búsqueda vacía', async () => {
      currentPathname = PATHS.PRODUCTS;
      currentSearchParams = new URLSearchParams('q=existing');
      
      const { result } = renderHook(() => useProductSearch());

      act(() => {
        result.current.handleSearchChange({ target: { value: '   ' } });
      });

      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
        const lastCall = mockSetSearchParams.mock.calls[mockSetSearchParams.mock.calls.length - 1];
        const params = lastCall[0];
        expect(params.has('q')).toBe(false);
      });
    });

    it('debería funcionar correctamente con términos que contienen caracteres especiales de URL', () => {
      currentSearchParams = new URLSearchParams('q=%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA'); // áéíóú encoded
      const { result } = renderHook(() => useProductSearch());
      
      // El hook debería decodificar correctamente
      expect(result.current.searchTerm).toBe('áéíóú');
    });
  });
});