// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  // Extraemos el pathname (ej: "/productos") del objeto de ubicación
  const { pathname } = useLocation();

  // useEffect se ejecutará cada vez que el 'pathname' cambie
  useEffect(() => {
    // "Scroll a la posición x=0, y=0"
    window.scrollTo(0, 0);
  }, [pathname]); // El array de dependencias asegura que esto se ejecute solo cuando la ruta cambie

  // Este componente no renderiza nada en el DOM
  return null;
}

export default ScrollToTop;
