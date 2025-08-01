import SEO from "../../../components/ui/SEO";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
import { useAuthStore } from "../store/authStore";
import { crearUsuario, loginEmailPass } from "../services/authService";
import { PATHS } from "../../../constants/paths";
import { dispararSweetBasico } from "../../../assets/SweetAlert";
import LoginForm from "./LoginForm";
import { StyledButton } from "../../../components/ui/Button";

function LoginBoost() {
  const [modo, setModo] = useState("firebase");

  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });

  const user = useAuthStore((state) => state.user);
  const admin = useAuthStore((state) => state.admin);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || PATHS.HOME;

  const registrarUsuario = (data) => {
    crearUsuario(data.email, data.password)
      .then(() => {
        dispararSweetBasico(
          "¡Registro Exitoso!",
          "Tu cuenta ha sido creada y ya has iniciado sesión.",
          "success",
          "Empezar a Comprar"
        );
        navigate(PATHS.HOME);
      })
      .catch((error) => {
        let message = "Ocurrió un error inesperado.";
        if (error.code === "auth/email-already-in-use") {
          message = "El email ya está registrado.";
        } else if (error.code === "auth/weak-password") {
          message = "La contraseña debe tener al menos 6 caracteres.";
        }
        dispararSweetBasico("Error de Registro", message, "error", "Cerrar");
      });
  };

  const iniciarSesionEmailPass = (data) => {
    loginEmailPass(data.email, data.password)
      .then(() => {
        dispararSweetBasico(
          "Logeo exitoso",
          "",
          "success",
          "Empezar a Comprar"
        );
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.log(error);
        dispararSweetBasico(
          "Credenciales incorrectas",
          "El email o la contraseña no son válidos.",
          "error",
          "Cerrar"
        );
      });
  };

  // Limpiar el formulario al cambiar de modo
  const handleModo = (nuevoModo) => {
    setModo(nuevoModo);
    methods.reset();
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

      <div className="container my-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            {/* Botones para cambiar de modo, ahora estilizados */}
            <div className="btn-group w-100 mb-4" role="group">
              <button
                type="button"
                className={`btn ${
                  modo === "firebase" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => handleModo("firebase")}
              >
                Login
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

            {/* Renderizado condicional del formulario reutilizable */}
            <FormProvider {...methods}>
              {modo === "firebase" && (
                <form onSubmit={methods.handleSubmit(iniciarSesionEmailPass)}>
                  <LoginForm
                    title="Iniciar Sesión"
                    buttonText="Iniciar Sesión"
                  />
                </form>
              )}
              {modo === "registro" && (
                <form onSubmit={methods.handleSubmit(registrarUsuario)}>
                  <LoginForm title="Crear una Cuenta" buttonText="Registrarse" />
                </form>
              )}
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginBoost;
