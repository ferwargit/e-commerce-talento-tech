// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Siempre leeremos desde la clave 'user'
  const [user, setUser] = useState(() => localStorage.getItem("user") || null);
  const [admin, setAdmin] = useState(() => localStorage.getItem("isAdmin") === "true");

  // Usamos useEffect para mantener el localStorage sincronizado cuando el estado cambia.
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", user);
    } else {
      localStorage.removeItem("user");
    }

    if (admin) {
      localStorage.setItem("isAdmin", "true");
    } else {
      localStorage.removeItem("isAdmin");
    }
  }, [user, admin]);


  const login = (username) => {
    const isAdmin = username === "admin";
    if (isAdmin) {
      setAdmin(true);
      setUser(username); // También seteamos el user como 'admin'
    } else {
      setUser(username);
      setAdmin(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAdmin(false);
    // El useEffect se encargará de limpiar el localStorage
  };

  // Esta función ya no es necesaria, la lógica ahora está en el estado inicial y el useEffect.
  // function verificacionLog() { ... }

  // El valor del Provider ahora es más simple
  return (
    <AuthContext.Provider value={{ user, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
