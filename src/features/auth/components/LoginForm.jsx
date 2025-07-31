import { StyledButton } from "../../../components/ui/Button";
import { StyledInput } from "../../../components/ui/StyledFormElements";

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
