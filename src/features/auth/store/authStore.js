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
onEstadoAuth((user) => {
  if (user) {
    const isAdmin = user.email === env.VITE_FIREBASE_ADMIN_EMAIL;
    useAuthStore.setState({ user: user.email, admin: isAdmin ? user.email : null, loading: false });
  } else {
    useAuthStore.setState({ user: null, admin: null, loading: false });
  }
});