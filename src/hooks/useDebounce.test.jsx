
import { renderHook, act } from '@testing-library/react';
import { describe, beforeEach, afterEach,it, expect, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Controla los temporizadores para simular el debounce
  });

  afterEach(() => {
    vi.useRealTimers(); // Restaura los temporizadores reales
  });

  it('debería devolver el valor inicial inmediatamente', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('no debería actualizar el valor inmediatamente al cambiar la entrada', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    rerender({ value: 'changed', delay: 500 });
    expect(result.current).toBe('initial'); // El valor no debe cambiar aún
  });

  it('debería actualizar el valor después del retardo especificado', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    rerender({ value: 'changed', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(500); // Avanza el tiempo por el retardo
    });
    expect(result.current).toBe('changed'); // El valor debe actualizarse ahora
  });

  it('debería actualizar el valor solo una vez con el último valor si hay cambios rápidos', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    rerender({ value: 'first change', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200); // Avanza un poco, pero no lo suficiente
    });
    expect(result.current).toBe('initial');

    rerender({ value: 'second change', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200); // Otro cambio, otro avance
    });
    expect(result.current).toBe('initial');

    rerender({ value: 'final change', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(500); // Avanza el tiempo completo para el último cambio
    });
    expect(result.current).toBe('final change'); // Solo el último valor debe ser el resultado
  });

  it('debería limpiar el temporizador en el unmount del componente', () => {
    const { result, rerender, unmount } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    rerender({ value: 'changed', delay: 500 });
    unmount(); // Desmonta el hook

    act(() => {
      vi.advanceTimersByTime(500); // Avanza el tiempo
    });
    // El valor no debería haber cambiado porque el temporizador fue limpiado
    expect(result.current).toBe('initial');
  });
});
