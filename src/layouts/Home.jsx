import SEO from "../components/SEO";
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
      <Hero />
      <FeaturedProducts />
      <Features />
    </>
  );
}

export default Home;
