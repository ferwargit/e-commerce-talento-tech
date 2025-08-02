import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getProducts } from "@/features/products/services/productService";
import { useSearchStore } from "@/features/search/store/searchStore";

/**
 * Custom Hook para gestionar la obtención, filtrado y ordenamiento de productos.
 * Centraliza la lógica de datos de productos para ser reutilizada en la aplicación.
 */
export function useProducts() {
  const terminoBusqueda = useSearchStore((state) => state.terminoBusqueda);

  const {
    data: productos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Usamos useMemo para evitar recalcular el filtrado y ordenamiento en cada render
  // a menos que los productos o el término de búsqueda cambien.
  const productosFiltrados = useMemo(() => {
    const productosOrdenados = [...productos].sort((a, b) => a.name.localeCompare(b.name));

    if (!terminoBusqueda) {
      return productosOrdenados;
    }
    return productosOrdenados.filter(
      (p) =>
        p.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        (p.category &&
          p.category.toLowerCase().includes(terminoBusqueda.toLowerCase()))
    );
  }, [productos, terminoBusqueda]);

  return { isLoading, isError, error, productos, productosFiltrados };
}