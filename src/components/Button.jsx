// src/components/Button.jsx

import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

// El objeto variants ahora usa nuestras variables CSS
const variants = {
  primary: {
    background: "var(--color-primary)",
    hover: "var(--color-primary-hover)",
  },
  success: {
    // Mantenemos success usando el color primario
    background: "var(--color-primary)",
    hover: "var(--color-primary-hover)",
  },
  danger: {
    background: "var(--color-danger)",
    hover: "var(--color-danger-hover)",
  },
};

const buttonStyles = css`
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px; /* Bordes un poco más redondeados */
  cursor: pointer;
  font-size: 16px;
  font-weight: 500; /* Un poco más de peso */
  margin: 5px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;

  background-color: ${(props) =>
    variants[props.$variant || "primary"].background};

  &:hover {
    background-color: ${(props) => variants[props.$variant || "primary"].hover};
    color: white !important;
  }

  &:active {
    transform: scale(0.98); /* Pequeño efecto al hacer clic */
  }
`;

// No se necesitan cambios aquí, los estilos se aplican igual
export const StyledButton = styled.button`
  ${buttonStyles}
`;

export const StyledLinkButton = styled(Link)`
  ${buttonStyles}
`;
