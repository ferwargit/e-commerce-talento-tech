
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { PATHS } from '@/constants/paths';

/**
 * Hook personalizado para manejar la lógica de búsqueda de productos en la barra de navegación.
 * Sincroniza el input de búsqueda con los parámetros de la URL y maneja el debounce.
 */
export function useProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTermFromUrl = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(searchTermFromUrl);
  const debouncedInputValue = useDebounce(inputValue, 300);

  const navigate = useNavigate();
  const location = useLocation();

  // Ref para evitar navegación automática cuando es causada por clic en enlaces
  const isNavigatingToDetail = useRef(false);
  // Ref para trackear si el usuario está escribiendo activamente
  const isUserTyping = useRef(false);

  // Sincronizar el input con la URL SOLO cuando cambia la URL y hay un término de búsqueda
  // O cuando estamos en la página de productos
  useEffect(() => {
    if (searchTermFromUrl && searchTermFromUrl !== inputValue) {
      isUserTyping.current = false; // No es el usuario escribiendo, es sincronización
      setInputValue(searchTermFromUrl);
    } else if (
      !searchTermFromUrl &&
      location.pathname === PATHS.PRODUCTS &&
      inputValue
    ) {
      // Solo limpiar el input si estamos en productos y no hay término de búsqueda en la URL
      isUserTyping.current = false;
      setInputValue('');
    }
  }, [searchTermFromUrl, location.pathname]);

  // Detectar navegación a páginas de detalle para pausar búsqueda automática
  useEffect(() => {
    const isProductDetail = location.pathname.startsWith(PATHS.PRODUCTS + '/');
    if (isProductDetail && inputValue.trim()) {
      isNavigatingToDetail.current = true;
      // Resetear después de un breve delay
      setTimeout(() => {
        isNavigatingToDetail.current = false;
      }, 100);
    }
  }, [location.pathname, inputValue]);

  // Efecto principal para disparar la búsqueda debounced
  useEffect(() => {
    const newQuery = debouncedInputValue.trim();
    const currentQuery = searchTermFromUrl;

    if (
      newQuery === currentQuery ||
      isNavigatingToDetail.current ||
      !isUserTyping.current
    ) {
      return;
    }

    if (newQuery) {
      navigate(`${PATHS.PRODUCTS}?q=${encodeURIComponent(newQuery)}`);
      isUserTyping.current = false; // Restablecer después de la navegación
    } else if (location.pathname === PATHS.PRODUCTS && searchTermFromUrl) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('q');
      setSearchParams(newSearchParams, { replace: true });
      isUserTyping.current = false; // Restablecer después de la navegación
    }
  }, [
    debouncedInputValue,
    searchTermFromUrl,
    navigate,
    location.pathname,
    setSearchParams,
    searchParams,
  ]);

  const handleSearchChange = (e) => {
    isUserTyping.current = true; // Marcar que el usuario está escribiendo
    setInputValue(e.target.value);
  };

  return {
    searchTerm: inputValue,
    handleSearchChange,
  };
}
