// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => localStorage.getItem("user") || null);
  const [admin, setAdmin] = useState(() => localStorage.getItem("isAdmin") === "true");

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
      setUser(username); 
    } else {
      setUser(username);
      setAdmin(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAdmin(false);
  };
  return (
    <AuthContext.Provider value={{ user, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
