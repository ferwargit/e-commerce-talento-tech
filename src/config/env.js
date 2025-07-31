import { z } from 'zod';

// 1. Definimos el esquema de las variables de entorno que esperamos.
//    z.string().min(1) asegura que la variable exista y no esté vacía.
const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
});

// 2. Intentamos "parsear" (validar y procesar) las variables de entorno.
const parsedEnv = envSchema.safeParse(import.meta.env);

// 3. Si la validación falla, mostramos un error claro y detenemos la ejecución.
if (!parsedEnv.success) {
  console.error('Error de validación de variables de entorno:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Faltan variables de entorno o son inválidas. Revisa tu archivo .env y compáralo con .env.example');
}

// 4. Si todo es correcto, exportamos las variables validadas y tipadas.
export const env = parsedEnv.data;