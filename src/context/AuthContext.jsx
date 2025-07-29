// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from "react";
import { onEstadoAuth, cerrarSesion } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onEstadoAuth nos devuelve el observador de Firebase,
    // que se ejecuta cada vez que el estado de autenticación cambia.
    // También devuelve una función para "desuscribirse" del observador.
    const unsubscribe = onEstadoAuth((firebaseUser) => {
      if (firebaseUser) {
        // Si hay un usuario, actualizamos el estado.
        // Asumimos que el email del admin es 'admin@admin.com'.
        // ¡Asegúrate de cambiarlo por el email real de tu administrador!
        const userEmail = firebaseUser.email;
        setUser(userEmail);
        setAdmin(userEmail === "admin@admin.com");
      } else {
        // Si no hay usuario, reseteamos el estado.
        setUser(null);
        setAdmin(false);
      }
      // Una vez que tenemos una respuesta de Firebase, dejamos de cargar.
      setLoading(false);
    });

    // La función de limpieza de useEffect se encarga de desuscribirse
    // cuando el componente se desmonta, para evitar fugas de memoria.
    return () => unsubscribe();
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez.

  // La función logout ahora llama directamente al servicio de Firebase.
  const logout = () => cerrarSesion();
  
  return (
    <AuthContext.Provider value={{ user, admin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
