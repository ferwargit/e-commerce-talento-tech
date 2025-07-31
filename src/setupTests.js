// src/setupTests.js
import '@testing-library/jest-dom';

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
