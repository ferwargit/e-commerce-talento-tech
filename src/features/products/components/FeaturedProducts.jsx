// src/features/products/components/FeaturedProducts.jsx
// Este componente muestra los productos destacados en la página de inicio.
import { useEffect, useState, useCallback } from "react";
import { useProductosContext } from "../context/ProductosContext";
import Card from "./Card";

function FeaturedProducts() {
  const { productos, obtenerProductos } = useProductosContext();
  const [cargando, setCargando] = useState(true);

  const cargarProductos = useCallback(async () => {
    try {
      await obtenerProductos();
    } finally {
      setCargando(false);
    }
  }, [obtenerProductos]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const featured = productos.slice(0, 3);

  return (
    <div className="container my-5 py-5">
      <div className="text-center mb-5">
        <h2
          className="display-5 fw-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Productos Destacados
        </h2>
        <p className="lead" style={{ color: "var(--color-text-muted)" }}>
          Una selección de nuestros items más populares.
        </p>
      </div>
      {cargando ? (
        <div className="text-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {featured.map((producto) => (
            <div
              key={producto.id}
              className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch"
            >
              <Card producto={producto} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeaturedProducts;
