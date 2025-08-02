// src/features/products/pages/ProductosContainer.jsx
// Este componente muestra una lista de productos con paginación y búsqueda.
import SEO from "@/components/ui/SEO";
import { useState, useEffect } from "react";
import Card from "@/features/products/components/Card";
import Paginador from "@/components/ui/Paginador";
import { useProducts } from "@/features/products/hooks/useProducts";

function ProductosContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  // Usamos nuestro nuevo custom hook. ¡Mucho más limpio!
  const { productosFiltrados, isLoading: cargando, error } = useProducts();

  useEffect(() => {
    setCurrentPage(1);
  }, [productosFiltrados]); // Se resetea si la búsqueda cambia

  if (cargando) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-light">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return <p className="container text-center mt-5 text-danger">{error.message}</p>;
  }

  // --- LÓGICA PARA CALCULAR QUÉ PRODUCTOS MOSTRAR ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productosFiltrados.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(
    productosFiltrados.length / productsPerPage
  );

  // Función para cambiar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Opcional: lleva al usuario al tope de la página
  };

  return (
    <>
      <SEO title="Nuestros Productos" />
      <div className="container mt-4">
        {/* Encabezado de la sección de productos */}
        <div className="text-center mb-5">
          <h1
            className="display-4 fw-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Explora Nuestro Catálogo
          </h1>
          <p className="lead" style={{ color: "var(--color-text-muted)" }}>
            Los mejores productos de tecnología, seleccionados para ti
          </p>
        </div>

        <div className="row g-4">
          {currentProducts.map((producto) => (
            <div
              key={producto.id}
              className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch"
            >
              <Card producto={producto} />
            </div>
          ))}

          {productosFiltrados.length === 0 && !cargando && (
            <div className="col-12 text-center">
              <h3 style={{ color: "var(--color-text-primary)" }}>
                No se encontraron productos
              </h3>
              <p style={{ color: "var(--color-text-muted)" }}>
                Intenta con otro término de búsqueda.
              </p>
            </div>
          )}
        </div>

        <div className="mt-5">
          <Paginador
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
export default ProductosContainer;
