// src/features/products/components/FeaturedProducts.jsx
// Este componente muestra los productos destacados en la página de inicio.
import Loader from "@/components/ui/Loader";
import { useProducts } from "@/features/products/hooks/useProducts";
import Card from "./Card";

function FeaturedProducts() {
  // Usamos el hook centralizado. React Query se encarga de no volver a pedir los datos si ya los tiene.
  const { productos, isLoading: cargando, error } = useProducts();

  const featured = productos.slice(0, 3); // Tomamos los 3 primeros productos como venían originalmente

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
      {cargando ? <Loader text="Cargando destacados..." /> : error ? (
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
