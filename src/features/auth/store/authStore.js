import { create } from "zustand";
import { onEstadoAuth, cerrarSesion } from "@/features/auth/services/authService";
import { env } from "@/config/env";

export const useAuthStore = create((set, get) => ({
  user: null,
  admin: null,
  loading: true, // Inicia en true hasta que Firebase verifique el estado

  // Selector para obtener el rol del usuario de forma derivada
  getRole: () => {
    const { admin, user } = get();
    if (admin) return 'admin';
    if (user) return 'client';
    return 'guest';
  },

  logout: () => {
    // Actualización optimista: cambiamos el estado local inmediatamente para una UX instantánea.
    set({ user: null, admin: null });
    cerrarSesion();
    // El listener de onEstadoAuth confirmará este estado cuando Firebase responda.
  },
}));

// --- Listener de Firebase ---
// Esto se ejecuta una vez cuando la app carga y se mantiene escuchando.
// Es la forma moderna de manejar el estado de autenticación en toda la app.
onEstadoAuth((user) => {
  try {
    if (user) {
      const isAdmin = user.email === env.VITE_FIREBASE_ADMIN_EMAIL;
      useAuthStore.setState({ user: user.email, admin: isAdmin ? user.email : null, loading: false });
    } else {
      useAuthStore.setState({ user: null, admin: null, loading: false });
    }
  } catch (error) {
    console.error("Error en el listener de autenticación:", error);
    // Aseguramos que loading se establezca a false incluso si hay un error
    useAuthStore.setState({ user: null, admin: null, loading: false });
  }
});