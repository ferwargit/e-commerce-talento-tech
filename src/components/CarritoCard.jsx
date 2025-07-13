// src/components/CarritoCard.jsx
import React from "react";
import { StyledButton } from "./Button";

function CarritoCard({ producto, onEliminar }) {
  const formatPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

  return (
    <div
      className="card shadow-sm mb-3"
      style={{
        backgroundColor: "var(--color-background-light)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="row g-0">
        <div className="col-md-2 d-flex justify-content-center align-items-center p-2">
          <img
            src={producto.image}
            alt={producto.name}
            className="img-fluid rounded"
            style={{
              maxHeight: "100px",
              maxWidth: "100px",
              objectFit: "contain",
            }}
          />
        </div>
        <div className="col-md-10">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div className="flex-grow-1 d-flex flex-column">
                <h5
                  className="card-title mb-1 align-self-center"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {producto.name}
                </h5>
                <p
                  className="small mb-0 align-self-start"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {formatPrice(producto.price)} c/u
                </p>
              </div>
              <StyledButton
                onClick={() => onEliminar(producto.id, producto.name)}
                $variant="danger"
                style={{ padding: "5px 10px", fontSize: "14px" }}
              >
                ×
              </StyledButton>
            </div>
            <hr
              className="my-2"
              style={{
                margin: "0.5rem 0",
                border: 0,
                borderTop: "1px solid var(--color-border)",
                opacity: 0.75,
              }}
            />
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ color: "var(--color-text-primary)" }}>
                Cantidad: {producto.cantidad}
              </span>
              <span
                className="fw-bold fs-5"
                style={{ color: "var(--color-text-primary)" }}
              >
                {formatPrice(producto.price * producto.cantidad)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarritoCard;
