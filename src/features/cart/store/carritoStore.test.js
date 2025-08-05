// src/features/cart/store/carritoStore.test.js
import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCarritoStore } from './carritoStore';

// Mockear react-toastify para que no se ejecute en los tests
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
  },
}));

// Productos de ejemplo para usar en los tests
const producto1 = { id: '1', name: 'Teclado', price: 100, cantidad: 1 };
const producto2 = { id: '2', name: 'Mouse', price: 50, cantidad: 2 };

describe('useCarritoStore', () => {
  // Resetear el estado del store antes de cada test
  beforeEach(() => {
    act(() => {
      useCarritoStore.getState().vaciarCarrito();
    });
  });

  it('debería tener un estado inicial con el carrito vacío', () => {
    const { result } = renderHook(() => useCarritoStore());
    expect(result.current.productosCarrito).toEqual([]);
  });

  it('debería agregar un producto nuevo al carrito', () => {
    const { result } = renderHook(() => useCarritoStore());

    act(() => {
      result.current.agregarAlCarrito(producto1);
    });

    expect(result.current.productosCarrito).toHaveLength(1);
    expect(result.current.productosCarrito[0]).toEqual(producto1);
  });

  it('debería incrementar la cantidad si se agrega un producto que ya existe', () => {
    const { result } = renderHook(() => useCarritoStore());

    // Agregamos el producto1 una vez
    act(() => {
      result.current.agregarAlCarrito(producto1);
    });
    expect(result.current.productosCarrito[0].cantidad).toBe(1);

    // Lo agregamos de nuevo (con cantidad 1)
    act(() => {
      result.current.agregarAlCarrito({ ...producto1, cantidad: 2 });
    });

    // La cantidad total debería ser 1 + 2 = 3
    expect(result.current.productosCarrito).toHaveLength(1);
    expect(result.current.productosCarrito[0].cantidad).toBe(3);
  });

  it('debería agregar múltiples productos diferentes al carrito', () => {
    const { result } = renderHook(() => useCarritoStore());

    act(() => {
      result.current.agregarAlCarrito(producto1);
    });
    act(() => {
      result.current.agregarAlCarrito(producto2);
    });

    expect(result.current.productosCarrito).toHaveLength(2);
    expect(result.current.productosCarrito).toContainEqual(producto1);
    expect(result.current.productosCarrito).toContainEqual(producto2);
  });

  it('debería eliminar un producto del carrito por su ID', () => {
    const { result } = renderHook(() => useCarritoStore());

    // Agregamos dos productos
    act(() => {
      result.current.agregarAlCarrito(producto1);
      result.current.agregarAlCarrito(producto2);
    });
    expect(result.current.productosCarrito).toHaveLength(2);

    // Eliminamos el producto 1
    act(() => {
      result.current.eliminarDelCarrito('1');
    });

    expect(result.current.productosCarrito).toHaveLength(1);
    expect(result.current.productosCarrito[0].id).toBe('2');
  });

  it('no debería modificar el carrito si se intenta eliminar un producto con un ID que no existe', () => {
    const { result } = renderHook(() => useCarritoStore());

    act(() => {
      result.current.agregarAlCarrito(producto1);
    });
    expect(result.current.productosCarrito).toHaveLength(1);

    // Intentamos eliminar un producto con un ID inexistente
    act(() => {
      result.current.eliminarDelCarrito('999');
    });

    expect(result.current.productosCarrito).toHaveLength(1);
  });

  it('debería vaciar el carrito completamente', () => {
    const { result } = renderHook(() => useCarritoStore());

    // Agregamos productos
    act(() => {
      result.current.agregarAlCarrito(producto1);
      result.current.agregarAlCarrito(producto2);
    });
    expect(result.current.productosCarrito).toHaveLength(2);

    // Vaciamos el carrito
    act(() => {
      result.current.vaciarCarrito();
    });

    expect(result.current.productosCarrito).toHaveLength(0);
  });
});
