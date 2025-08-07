
import { useState, useEffect, useMemo } from 'react';

/**
 * Un hook reutilizable para manejar la lógica de paginación del lado del cliente.
 * @param {Array} data - El array completo de datos a paginar.
 * @param {number} itemsPerPage - El número de elementos a mostrar por página.
 * @returns {{currentPage: number, totalPages: number, currentData: Array, handlePageChange: Function}}
 */
export function usePagination(data, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(1);

  // Resetea la página a 1 si los datos cambian (ej. por un filtro)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Usamos useMemo para evitar recalcular esto en cada render a menos que cambien las dependencias
  const { currentData, totalPages } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    return { currentData, totalPages };
  }, [data, currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Comportamiento por defecto de llevar al tope
  };

  return {
    currentPage,
    totalPages,
    currentData,
    handlePageChange,
  };
}
