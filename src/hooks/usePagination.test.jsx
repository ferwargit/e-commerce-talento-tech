
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, it, expect } from 'vitest';
import { usePagination } from './usePagination';

// Datos de prueba
const sampleData = Array.from({ length: 25 }, (_, i) => `Item ${i + 1}`); // 25 items

describe('usePagination Hook', () => {
  it('debería inicializar en la primera página y calcular el total de páginas correctamente', () => {
    const { result } = renderHook(() => usePagination(sampleData, 10));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3); // 25 items / 10 por página = 2.5 -> 3 páginas
  });

  it('debería devolver los datos correctos para la página actual', () => {
    const { result } = renderHook(() => usePagination(sampleData, 10));

    expect(result.current.currentData.length).toBe(10);
    expect(result.current.currentData[0]).toBe('Item 1');
    expect(result.current.currentData[9]).toBe('Item 10');
  });

  it('debería cambiar a la página correcta cuando se llama a handlePageChange', () => {
    const { result } = renderHook(() => usePagination(sampleData, 10));

    act(() => {
      result.current.handlePageChange(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentData.length).toBe(10);
    expect(result.current.currentData[0]).toBe('Item 11');
    expect(result.current.currentData[9]).toBe('Item 20');
  });

  it('debería manejar correctamente la última página con menos elementos', () => {
    const { result } = renderHook(() => usePagination(sampleData, 10));

    act(() => {
      result.current.handlePageChange(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.currentData.length).toBe(5);
    expect(result.current.currentData[0]).toBe('Item 21');
    expect(result.current.currentData[4]).toBe('Item 25');
  });

  it('debería resetear a la primera página si los datos de entrada cambian', () => {
    const { result, rerender } = renderHook(({ data }) => usePagination(data, 10), {
      initialProps: { data: sampleData },
    });

    // Cambiar a la página 2
    act(() => {
      result.current.handlePageChange(2);
    });

    expect(result.current.currentPage).toBe(2);

    // Simular un cambio en los datos (ej. un filtro se aplica)
    const newData = sampleData.slice(0, 15);
    rerender({ data: newData });

    // Verificar que la página se ha reseteado a 1
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(2);
  });
});
