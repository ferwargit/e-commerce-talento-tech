import React from "react";
import styled from "styled-components";
import { StyledButton } from "./Button";


// Creamos un componente de input estilizado
const StyledInput = styled.input`
  /* Estilos que ya tenías aplicados con 'style' */
  background-color: var(--color-background-dark);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  width: 100%;
  padding: 0.5rem 1rem; /* Padding de Bootstrap para form-control */
  font-size: 1rem;
  border-radius: 0.375rem; /* Bordes redondeados de Bootstrap */
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  /* La clave: Estilo para el placeholder */
  &::placeholder {
    color: var(--color-text-muted);
    opacity: 1; /* Para normalizar en Firefox */
  }

  /* Efecto de foco para que se parezca al de Bootstrap */
  &:focus {
    border-color: var(--color-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(20, 184, 166, 0.25); /* Sombra con nuestro color primario */
  }
`;

function LoginForm({
  title,
  onSubmit,
  buttonText,
  usernameLabel = "Email",
  usuario,
  setUsuario,
  password,
  setPassword,
}) {
  return (
    <div
      className="card shadow-lg border-0"
      style={{
        backgroundColor: "var(--color-background-light)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="card-body p-4">
        <h2
          className="card-title text-center mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label
              className="form-label d-block"
            >
              {usernameLabel}
            </label>
            <StyledInput
              type={usernameLabel === "Email" ? "email" : "text"}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder={
                usernameLabel === "Email"
                  ? "Ingrese su email"
                  : "Ingrese su usuario"
              }
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="form-label d-block"
            >
              Contraseña
            </label>
            <StyledInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          <div className="d-grid">
            <StyledButton type="submit" $variant="primary">
              {buttonText}
            </StyledButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
