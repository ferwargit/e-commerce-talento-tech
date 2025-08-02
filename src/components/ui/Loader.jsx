import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 300px; /* Evita que el layout "salte" en contenedores pequeños */
`;

const Spinner = styled.div`
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

const LoaderText = styled.p`
  margin-top: 1rem;
  color: var(--color-text-muted);
  font-size: 1rem;
`;

export default function Loader({ text = "Cargando..." }) {
  return (
    <LoaderWrapper>
      <Spinner />
      {text && <LoaderText>{text}</LoaderText>}
    </LoaderWrapper>
  );
}