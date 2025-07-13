// src/components/About.jsx
import React from "react";
import SEO from "./SEO";
import { FaMicrochip, FaAward, FaHeadset } from "react-icons/fa"; // Importamos iconos relevantes

const Feature = ({ icon, title, text }) => (
  <div className="col-lg-4 text-center px-4">
    <div className="fs-1 mb-3" style={{ color: "var(--color-primary)" }}>
      {icon}
    </div>
    <h3 className="h4 mb-3" style={{ color: "var(--color-text-primary)" }}>{title}</h3>
    <p className="px-md-3" style={{ color: "var(--color-text-muted)" }}>
      {text}
    </p>
  </div>
);

function About() {
  return (
    <>
      <SEO
        title="Sobre Nosotros"
        description="Conoce la historia y los valores de TechStore, tu tienda de confianza para productos de tecnología."
      />
      <div className="container my-5 py-5">
        {/* --- SECCIÓN PRINCIPAL --- */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <h1 className="display-4 fw-bold" style={{ color: "var(--color-text-primary)" }}>Nuestra Misión</h1>
            <p
              className="lead mt-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              En TechStore, nuestra misión es simple: acercar la mejor
              tecnología a nuestros clientes con un servicio excepcional.
              Creemos que la tecnología no solo debe ser poderosa, sino también
              accesible y confiable.
            </p>
          </div>
        </div>

        <hr className="my-5" style={{ borderColor: "var(--color-border)" }} />

        {/* --- SECCIÓN DE VALORES --- */}
        <div className="row mt-5">
          <Feature
            icon={<FaMicrochip />}
            title="Innovación Constante"
            text="Seleccionamos cuidadosamente cada producto, asegurando que siempre tengas acceso a lo último en innovación y rendimiento."
          />
          <Feature
            icon={<FaAward />}
            title="Calidad Garantizada"
            text="Cada item en nuestro catálogo pasa por rigurosos controles de calidad y cuenta con garantía oficial para tu tranquilidad."
          />
          <Feature
            icon={<FaHeadset />}
            title="Soporte Apasionado"
            text="Somos tan fanáticos de la tecnología como tú. Nuestro equipo de expertos está siempre disponible para guiarte y resolver tus dudas."
          />
        </div>
      </div>
    </>
  );
}

export default About;
