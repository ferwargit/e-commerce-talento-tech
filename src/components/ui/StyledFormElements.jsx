import styled, { css } from "styled-components";

// Definimos los estilos comunes para todos nuestros inputs y textareas
const commonInputStyles = css`
  background-color: var(--color-background-dark);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  width: 100%;
  padding: 0.375rem 0.75rem; /* Alineado con padding de Bootstrap para compatibilidad con input-group */
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
    background-color: var(--color-background-dark);
    color: var(--color-text-primary);
    border-color: var(--color-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(20, 184, 166, 0.25);
  }
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-muted);
  font-weight: 500;
  text-align: left;
`;

export const StyledInput = styled.input`
  ${commonInputStyles}
`;

export const StyledTextarea = styled.textarea`
  ${commonInputStyles}
`;
