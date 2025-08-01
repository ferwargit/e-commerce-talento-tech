import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Configura el servidor de mocking con nuestros manejadores.
export const server = setupServer(...handlers);