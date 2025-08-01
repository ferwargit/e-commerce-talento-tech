import { create } from "zustand";
import { onEstadoAuth, cerrarSesion } from "@/features/auth/services/authService";
import { env } from "@/config/env";

export const useAuthStore = create((set) => ({
  user: null,
  admin: null,
  loading: true, // Inicia en true hasta que Firebase verifique el estado
  logout: () => {
    cerrarSesion();
    // El listener de onEstadoAuth se encargará de actualizar el estado a null
  },
}));

// --- Listener de Firebase ---
// Esto se ejecuta una vez cuando la app carga y se mantiene escuchando.
// Es la forma moderna de manejar el estado de autenticación en toda la app.
onEstadoAuth((firebaseUser) => {
  // --- INICIO DE DEPURACIÓN ---
  console.log("🕵️‍♂️ [authStore] Verificando estado de autenticación...");

  if (firebaseUser) {
    console.log("  - Usuario de Firebase encontrado:", firebaseUser);
    console.log("  - Email del usuario:", `"${firebaseUser.email}"`);
    console.log("  - Email de admin (desde .env):", `"${env.VITE_FIREBASE_ADMIN_EMAIL}"`);

    const isAdmin = firebaseUser.email === env.VITE_FIREBASE_ADMIN_EMAIL;
    console.log("  - ¿Es administrador?:", isAdmin);

    useAuthStore.setState({ user: firebaseUser.email, admin: isAdmin ? firebaseUser.email : null, loading: false });
    console.log("  - Estado de authStore actualizado.");
  } else {
    console.log("  - No se encontró usuario de Firebase. Estado reseteado.");
    useAuthStore.setState({ user: null, admin: null, loading: false });
  }
  console.log("🕵️‍♂️ [authStore] Verificación completada.");
  // --- FIN DE DEPURACIÓN ---
});