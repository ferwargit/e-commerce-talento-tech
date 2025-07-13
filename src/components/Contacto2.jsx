// src/components/Contacto.jsx
import React from "react";
import SEO from "./SEO";
import { StyledInput, StyledTextarea } from "./StyledFormElements";
import { StyledButton } from "./Button";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";

const InfoItem = ({ icon, title, children }) => (
  <div className="text-center mb-4">
    <div className="fs-1 mb-2" style={{ color: "var(--color-primary)" }}>
      {icon}
    </div>
    <h4 style={{ color: "var(--color-text-primary)" }}>{title}</h4>
    <p className="mb-0" style={{ color: "var(--color-text-muted)" }}>
      {children}
    </p>
  </div>
);

function Contacto() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("¡Gracias por tu mensaje! Te contactaremos pronto.");
    e.target.reset();
  };

  return (
    <>
      <SEO
        title="Contacto"
        description="Ponte en contacto con el equipo de TechStore. Estamos aquí para ayudarte con cualquier consulta sobre nuestros productos y servicios."
      />
      <div className="container my-5 py-5">
        <div className="text-center mb-5">
          <h1
            className="display-4 fw-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Contáctanos
          </h1>
          <p className="lead" style={{ color: "var(--color-text-muted)" }}>
            ¿Tienes alguna pregunta? No dudes en escribirnos.
          </p>
        </div>

        <div className="row g-5 justify-content-center align-items-stretch">
          <div className="col-lg-7">
            <div
              className="card h-100"
              style={{
                backgroundColor: "var(--color-background-light)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
              }}
            >
              {/* --- INICIO DE LA CORRECCIÓN --- */}
              {/* 1. Hacemos el card-body un contenedor flex vertical */}
              <div className="card-body p-4 d-flex flex-column">
                <h3
                  className="h4 mb-4 text-center"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Formulario de Contacto
                </h3>
                {/* 2. Hacemos que el formulario crezca para ocupar el espacio */}
                <form
                  onSubmit={handleSubmit}
                  className="d-flex flex-column flex-grow-1"
                >
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Tu Nombre
                    </label>
                    <StyledInput
                      type="text"
                      id="name"
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Tu Email
                    </label>
                    <StyledInput
                      type="email"
                      id="email"
                      required
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="mb-3 flex-grow-1 d-flex flex-column">
                    <label htmlFor="message" className="form-label">
                      Tu Mensaje
                    </label>
                    <StyledTextarea
                      id="message"
                      rows="6"
                      required
                      placeholder="Escribe tu consulta aquí..."
                      className="flex-grow-1"
                    ></StyledTextarea>
                  </div>
                  {/* 3. El botón se mantiene al final del todo */}
                  <div className="d-grid">
                    <StyledButton type="submit" $variant="primary">
                      Enviar Mensaje
                    </StyledButton>
                  </div>
                </form>
              </div>
              {/* --- FIN DE LA CORRECCIÓN --- */}
            </div>
          </div>

          <div className="col-lg-5">
            <div
              className="card h-100"
              style={{
                backgroundColor: "var(--color-background-light)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
              }}
            >
              <div className="card-body p-4 d-flex flex-column justify-content-center">
                <h3
                  className="h4 mb-4 text-center"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Información Directa
                </h3>
                <InfoItem icon={<FaMapMarkerAlt />} title="Dirección">
                  Av. Siempreviva 742, Springfield
                </InfoItem>
                <InfoItem icon={<FaPhone />} title="Teléfono">
                  (+54) 11 1234-5678
                </InfoItem>
                <InfoItem icon={<FaEnvelope />} title="Email">
                  soporte@techstore.com
                </InfoItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contacto;
