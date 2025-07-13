import SEO from "./SEO";
import { useEffect, useState, useCallback } from "react";
import Card from "./Card";
import { useProductosContext } from "../context/ProductosContext";
import Paginador from "./Paginador";

function ProductosContainer() {
  const { productos, obtenerProductos, terminoBusqueda } =
    useProductosContext(); // 1. Obtén el término de búsqueda
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // --- INICIO DE LA LÓGICA DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Muestra 6 productos por página
  // --- FIN DE LA LÓGICA DE PAGINACIÓN ---

  // Usamos useCallback para la función de carga
  const cargarProductos = useCallback(async () => {
    try {
      await obtenerProductos();
    } catch (err) {
      setError("Hubo un problema al cargar los productos.");
    } finally {
      setCargando(false);
    }
  }, [obtenerProductos]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // Efecto para resetear la página a 1 cuando la búsqueda cambia
  useEffect(() => {
    setCurrentPage(1);
  }, [terminoBusqueda]);

  // Mensaje de carga mejorado
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
    return <p className="container text-center mt-5 text-danger">{error}</p>;
  }

  // Filtra y ordena los productos primero
  const productosFiltradosYOrdenados = productos
    .filter((producto) =>
      producto.name.toLowerCase().includes(terminoBusqueda.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // --- LÓGICA PARA CALCULAR QUÉ PRODUCTOS MOSTRAR ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productosFiltradosYOrdenados.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(
    productosFiltradosYOrdenados.length / productsPerPage
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
          {/* Mapeamos sobre los productos de la página actual */}
          {currentProducts.map((producto) => (
            <div
              key={producto.id}
              className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch"
            >
              <Card producto={producto} />
            </div>
          ))}

          {productosFiltradosYOrdenados.length === 0 && !cargando && (
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

        {/* Añadimos el componente Paginador al final */}
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
