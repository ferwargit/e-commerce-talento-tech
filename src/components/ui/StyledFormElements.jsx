import styled, { css } from "styled-components";

// Definimos los estilos comunes para todos nuestros inputs y textareas
const commonInputStyles = css`
  background-color: var(--color-background-dark);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  line-height: 1.5;

  /* La regla clave para el placeholder */
  &::placeholder {
    color: var(--color-text-muted);
    opacity: 1;
  }

  /* Efecto de foco consistente */
  &:focus {
    border-color: var(--color-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(20, 184, 166, 0.25);
  }
`;

export const StyledInput = styled.input`
  ${commonInputStyles}
`;

export const StyledTextarea = styled.textarea`
  ${commonInputStyles}
`;
