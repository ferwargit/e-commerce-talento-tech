import { z } from "zod";

// 1. Definimos el esquema de las variables de entorno que tu app NECESITA.
const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1, "VITE_FIREBASE_API_KEY is required"),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, "VITE_FIREBASE_AUTH_DOMAIN is required"),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, "VITE_FIREBASE_PROJECT_ID is required"),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1, "VITE_FIREBASE_STORAGE_BUCKET is required"),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, "VITE_FIREBASE_MESSAGING_SENDER_ID is required"),
  VITE_FIREBASE_APP_ID: z.string().min(1, "VITE_FIREBASE_APP_ID is required"),
  // Añadimos la validación para el email del admin.
  VITE_FIREBASE_ADMIN_EMAIL: z
    .string()
    .email("VITE_FIREBASE_ADMIN_EMAIL must be a valid email")
    .min(1, "VITE_FIREBASE_ADMIN_EMAIL is required"),
  // Añadimos la validación para la URL de nuestra futura API
  VITE_API_BASE_URL: z.string().url("VITE_API_BASE_URL must be a valid URL").min(1),
});

// 2. Validamos las variables de entorno de Vite contra nuestro esquema.
const parsedEnv = envSchema.safeParse(import.meta.env);

// 3. Si falta alguna variable o es incorrecta, la aplicación fallará al iniciar con un error claro.
if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables. Check your .env file.");
}

// 4. Exportamos las variables validadas y con tipo seguro para usar en la app.
export const env = parsedEnv.data;