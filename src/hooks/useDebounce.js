// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Un custom hook que retrasa la actualización de un valor.
 * Solo devolverá el último valor después de que haya pasado el tiempo de 'delay' sin cambios.
 * @param {any} value - El valor a "debouncear".
 * @param {number} delay - El tiempo de espera en milisegundos.
 * @returns {any} El valor "debounceado".
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}