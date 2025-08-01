// src/features/products/components/FeaturedProducts.jsx
// Este componente muestra los productos destacados en la página de inicio.
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/services/productService";
import Card from "./Card";

function FeaturedProducts() {
  const { data: productos = [], isLoading: cargando, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

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
      ) : error ? (
        <div className="text-center text-danger">
          <p>Error al cargar los productos destacados.</p>
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
