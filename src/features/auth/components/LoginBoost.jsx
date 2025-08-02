import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/auth/schemas/loginSchema";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  crearUsuario,
  loginEmailPass,
} from "@/features/auth/services/authService";
import { toast } from "react-toastify";
import { getFriendlyErrorMessage } from "@/utils/getFriendlyErrorMessage";
import { StyledInput, StyledLabel } from "@/components/ui/StyledFormElements";
import { StyledButton } from "@/components/ui/Button";
import SEO from "@/components/ui/SEO";
import styled from "styled-components";

const LoginContainer = styled.div`
  max-width: 450px;
  margin: 5rem auto;
  padding: 2.5rem;
  background-color: var(--color-background-light);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-border);

  h1 {
    color: var(--color-text-primary);
    font-weight: 700;
    text-align: center;
  }

  .btn-group {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--color-primary);
  }
`;

function LoginBoost() {
  const [modo, setModo] = useState("login"); // 'login' o 'registro'

  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });

  const user = useAuthStore((state) => state.user);
  const admin = useAuthStore((state) => state.admin);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (admin ? "/admin" : "/");

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, admin, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = methods;

  const onSubmit = async (data) => {
    try {
      if (modo === "registro") {
        await crearUsuario(data.email, data.password);
        toast.success("¡Registro Exitoso! Tu cuenta ha sido creada.");
      } else {
        await loginEmailPass(data.email, data.password);
        toast.success("¡Bienvenido de nuevo!");
      }
      // La redirección se maneja en el useEffect
    } catch (error) {
      const friendlyMessage = getFriendlyErrorMessage(error);
      setError("root.serverError", {
        type: error.code,
        message: friendlyMessage,
      });
    }
  };

  // Limpiar el formulario al cambiar de modo
  const handleModo = (nuevoModo) => {
    setModo(nuevoModo);
    reset();
  };

  if (user || admin) {
    // Si hay un usuario o un admin logueado
    return (
      <div className="container text-center mt-5">
        <p>Ya has iniciado sesión como {user || admin}</p>
        <StyledButton onClick={logout} $variant="danger">
          Cerrar sesión
        </StyledButton>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Login"
        description="Inicia sesión o regístrate en nuestra tienda"
      />

      <LoginContainer>
        <div className="btn-group w-100 mb-4" role="group">
          <button
            type="button"
            className={`btn ${
              modo === "login" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleModo("login")}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`btn ${
              modo === "registro" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleModo("registro")}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="mb-4">
            {modo === "login" ? "Iniciar Sesión" : "Crear una Cuenta"}
          </h1>
          <div className="mb-3">
            <StyledLabel htmlFor="email">Correo Electrónico</StyledLabel>
            <StyledInput
              type="email"
              id="email"
              {...register("email")}
              placeholder="tu@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-danger mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <StyledLabel htmlFor="password">Contraseña</StyledLabel>
            <StyledInput
              type="password"
              id="password"
              {...register("password")}
              placeholder="********"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-danger mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Bloque para mostrar errores del servidor (ej. credenciales incorrectas) */}
          {errors.root?.serverError && (
            <div className="alert alert-danger" role="alert">
              {errors.root.serverError.message}
            </div>
          )}

          <StyledButton
            type="submit"
            $variant="primary"
            className="w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (modo === 'login' ? 'Iniciando...' : 'Registrando...') : (modo === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </StyledButton>
        </form>
      </LoginContainer>
    </>
  );
}

export default LoginBoost;
