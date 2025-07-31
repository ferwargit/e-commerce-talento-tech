import SEO from "../components/ui/SEO.jsx";
import Hero from "./Hero.jsx";
import FeaturedProducts from "../features/products/components/FeaturedProducts.jsx";
import Features from "../components/ui/Features.jsx";

function Home() {
  return (
    <>
      <SEO
        title="Inicio"
        description="TechStore - Tu tienda de tecnología de confianza. Encuentra los mejores gadgets y componentes."
      />
      <Hero />
      <FeaturedProducts />
      <Features />
    </>
  );
}

export default Home;
