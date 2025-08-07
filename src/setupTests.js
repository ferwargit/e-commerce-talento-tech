// src/setupTests.js
import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server.js';

// Inicia el servidor de MSW antes de todos los tests.
// onUnhandledRequest: 'warn' nos avisará en consola de peticiones no manejadas.
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Limpia los manejadores después de cada test, para que no interfieran entre sí.
afterEach(() => server.resetHandlers());

// Cierra el servidor cuando todos los tests hayan terminado.
afterAll(() => server.close());

// Mock para window.matchMedia, que no está implementado en JSDOM.
// Librerías como SweetAlert2 lo usan para detectar el tema del sistema.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock para window.scrollTo, que tampoco está en JSDOM.
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});
