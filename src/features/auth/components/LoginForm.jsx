import { useFormContext } from "react-hook-form";
import { StyledButton } from "@/components/ui/Button";
import { StyledInput } from "@/components/ui/StyledFormElements";

// Componente de UI para mostrar errores de validación
const ErrorMessage = ({ message }) => (
  <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.875em' }}>{message}</p>
);

function LoginForm({
  title,
  buttonText,
  usernameLabel = "Email",
}) {
  const { register, formState: { errors, isSubmitting } } = useFormContext();

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
        {/* El <form> ahora está en el componente padre (LoginBoost) */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label d-block">
            {usernameLabel}
          </label>
          <StyledInput
            id="email"
            type="email"
            {...register("email")}
            placeholder="Ingrese su email"
          />
          {errors.email && <ErrorMessage message={errors.email.message} />}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label d-block">
            Contraseña
          </label>
          <StyledInput
            id="password"
            type="password"
            {...register("password")}
            placeholder="Ingrese su contraseña"
          />
          {errors.password && <ErrorMessage message={errors.password.message} />}
        </div>
        <div className="d-grid">
          <StyledButton type="submit" $variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : buttonText}
          </StyledButton>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
