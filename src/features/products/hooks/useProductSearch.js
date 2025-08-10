import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { PATHS } from '@/constants/paths';

/**
 * Hook personalizado para manejar la lógica de búsqueda de productos en la barra de navegación.
 * Sincroniza el input de búsqueda con los parámetros de la URL y maneja el debounce.
 * 
 * Características:
 * - Sincronización bidireccional entre input y URL
 * - Debounce para evitar navegaciones excesivas
 * - Control de flujo para evitar loops infinitos
 * - Manejo de navegación a páginas de detalle
 */
export function useProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Estados separados para mejor control
  const [inputValue, setInputValue] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Valores derivados memoizados para optimización
  const searchTermFromUrl = useMemo(() => searchParams.get('q') || '', [searchParams]);
  const debouncedInputValue = useDebounce(inputValue, 300);
  const isProductsPage = useMemo(() => location.pathname === PATHS.PRODUCTS, [location.pathname]);
  const isProductDetail = useMemo(() => 
    location.pathname.startsWith(PATHS.PRODUCTS + '/'), 
    [location.pathname]
  );

  // Referencias para control de flujo y estado interno
  const isNavigatingToDetail = useRef(false);
  const isUserTyping = useRef(false);
  const lastSyncedUrlTerm = useRef('');

  // Inicialización única del hook al montar
  useEffect(() => {
    if (!isInitialized) {
      setInputValue(searchTermFromUrl);
      lastSyncedUrlTerm.current = searchTermFromUrl;
      setIsInitialized(true);
    }
  }, [searchTermFromUrl, isInitialized]);

  // Sincronización con cambios en URL (navegación externa o back/forward)
  useEffect(() => {
    // No sincronizar hasta que el hook esté inicializado
    if (!isInitialized) return;

    // Solo sincronizar si NO hay interacción del usuario activa
    if (isUserTyping.current) return;

    const shouldSync = searchTermFromUrl !== lastSyncedUrlTerm.current;
    
    if (shouldSync) {
      if (searchTermFromUrl) {
        // Hay un término en la URL, actualizar el input
        setInputValue(searchTermFromUrl);
        lastSyncedUrlTerm.current = searchTermFromUrl;
      } else if (isProductsPage && inputValue && lastSyncedUrlTerm.current) {
        // No hay término en URL pero estamos en productos y hay texto, limpiar
        setInputValue('');
        lastSyncedUrlTerm.current = '';
      }
    }
  }, [searchTermFromUrl, isProductsPage, isInitialized]);

  // Control de navegación a páginas de detalle de producto
  useEffect(() => {
    if (isProductDetail && inputValue.trim()) {
      // Pausar búsqueda automática temporalmente al navegar a detalle
      isNavigatingToDetail.current = true;
      const timer = setTimeout(() => {
        isNavigatingToDetail.current = false;
      }, 100);
      
      // Cleanup del timer
      return () => clearTimeout(timer);
    }
  }, [isProductDetail, inputValue]);

  // Efecto principal de búsqueda con debounce
  useEffect(() => {
    // No ejecutar si no está inicializado o el usuario no está escribiendo
    if (!isInitialized || !isUserTyping.current) return;

    const trimmedQuery = debouncedInputValue.trim();
    const currentUrlQuery = searchTermFromUrl;

    // Evitar navegación innecesaria si el valor es igual al actual o estamos navegando a detalle
    if (trimmedQuery === currentUrlQuery || isNavigatingToDetail.current) {
      // Resetear flag SOLO si no vamos a navegar
      isUserTyping.current = false;
      return;
    }

    // Ejecutar la navegación correspondiente
    if (trimmedQuery) {
      // Hay texto de búsqueda, navegar a productos con query
      navigate(`${PATHS.PRODUCTS}?q=${encodeURIComponent(trimmedQuery)}`);
      lastSyncedUrlTerm.current = trimmedQuery;
    } else if (isProductsPage) {
      // CORREGIDO: Input vacío en página de productos, eliminar parámetro de búsqueda
      // Removimos la condición && currentUrlQuery que impedía la limpieza
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('q');
      setSearchParams(newParams, { replace: true });
      lastSyncedUrlTerm.current = '';
    }

    // Resetear flag de control después de la navegación exitosa
    // Usar setTimeout para permitir que el usuario siga escribiendo sin interrupciones
    setTimeout(() => {
      isUserTyping.current = false;
    }, 100);
  }, [
    debouncedInputValue,
    searchTermFromUrl,
    isProductsPage,
    navigate,
    setSearchParams,
    searchParams,
    isInitialized,
  ]);

  // Handler optimizado para cambios en el input
  const handleSearchChange = useCallback((e) => {
    const newValue = e.target.value;
    isUserTyping.current = true;
    setInputValue(newValue);
  }, []);

  return {
    searchTerm: inputValue,
    handleSearchChange,
  };
}