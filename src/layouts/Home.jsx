// src/layouts/Home.jsx
import SEO from "../components/SEO";
// 1. Actualizamos las rutas de importación
import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Features from "../components/home/Features";

function Home() {
  return (
    <>
      <SEO
        title="Inicio"
        description="TechStore - Tu tienda de tecnología de confianza. Encuentra los mejores gadgets y componentes."
      />
      {/* 2. La estructura del componente no cambia */}
      <Hero />
      <FeaturedProducts />
      <Features />
    </>
  );
}

export default Home;
