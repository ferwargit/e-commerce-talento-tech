
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProductForm } from './useProductForm';
import * as productService from '@/features/products/services/productService';
import { toast } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- Mocks ---
vi.mock('@/features/products/services/productService');
vi.mock('react-toastify');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper para proveer el QueryClient que necesita el hook
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Desactiva los reintentos para los tests
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProductForm Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Pruebas para el Modo Creación ---
  describe('Creation Mode', () => {
    it('debería llamar a createProduct al enviar el formulario', async () => {
      productService.createProduct.mockResolvedValue({ id: 'new-product' });
      const wrapper = createWrapper();
      const { result } = renderHook(() => useProductForm(), { wrapper });

      const testData = { name: 'Test Product', price: 100 };
      await act(async () => {
        await result.current.onSubmit(testData);
      });

      await waitFor(() => {
        expect(productService.createProduct).toHaveBeenCalledWith(testData);
      });
    });

    it('debería mostrar toast de éxito y navegar al dashboard al crear con éxito', async () => {
      productService.createProduct.mockResolvedValue({ id: 'new-product' });
      const wrapper = createWrapper();
      const { result } = renderHook(() => useProductForm(), { wrapper });

      await act(async () => {
        await result.current.onSubmit({});
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('¡Producto agregado con éxito!');
        expect(mockNavigate).toHaveBeenCalledWith('/admin');
      });
    });
  });

  // --- Pruebas para el Modo Edición ---
  describe('Edit Mode', () => {
    const MOCK_ID = '123';
    const mockProduct = { id: MOCK_ID, name: 'Existing Product', price: 150 };

    beforeEach(() => {
      productService.getProductById.mockResolvedValue(mockProduct);
    });

    it('debería obtener los datos del producto al inicializar en modo edición', async () => {
      const wrapper = createWrapper();
      renderHook(() => useProductForm({ id: MOCK_ID }), { wrapper });

      await waitFor(() => {
        expect(productService.getProductById).toHaveBeenCalledWith(MOCK_ID);
      });
    });

    it('debería llamar a updateProduct al enviar el formulario', async () => {
      productService.updateProduct.mockResolvedValue(mockProduct);
      const wrapper = createWrapper();
      const { result } = renderHook(() => useProductForm({ id: MOCK_ID }), { wrapper });

      const updatedData = { name: 'Updated Name', price: 200 };
      await act(async () => {
        await result.current.onSubmit(updatedData);
      });

      await waitFor(() => {
        expect(productService.updateProduct).toHaveBeenCalledWith(MOCK_ID, updatedData);
      });
    });

    it('debería mostrar toast de éxito y navegar a la página del producto al actualizar con éxito', async () => {
      productService.updateProduct.mockResolvedValue(mockProduct);
      const wrapper = createWrapper();
      const { result } = renderHook(() => useProductForm({ id: MOCK_ID }), { wrapper });

      await act(async () => {
        await result.current.onSubmit({});
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('¡Producto actualizado con éxito!');
        expect(mockNavigate).toHaveBeenCalledWith(`/productos/${MOCK_ID}`);
      });
    });
  });
});
