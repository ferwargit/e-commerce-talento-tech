import SEO from "./SEO";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { crearUsuario, loginEmailPass } from "../services/authService"; // No necesitamos `cerrarSesion` aquí
import { dispararSweetBasico } from "../assets/SweetAlert";
import LoginForm from "./LoginForm";
import { StyledButton } from "./Button";

function LoginBoost() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [modo, setModo] = useState("firebase");

  const { user, logout, admin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); 

  const from = location.state?.from?.pathname || "/";

  const registrarUsuario = (e) => {
    e.preventDefault();
    crearUsuario(usuario, password)
      .then(() => {
        dispararSweetBasico(
          "¡Registro Exitoso!",
          "Tu cuenta ha sido creada y ya has iniciado sesión.",
          "success",
          "Empezar a Comprar"
        );
        navigate("/");
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

  const iniciarSesionEmailPass = (e) => {
    e.preventDefault();
    loginEmailPass(usuario, password)
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
        console.log(error)
        dispararSweetBasico(
          "Credenciales incorrectas",
          "El email o la contraseña no son válidos.",
          "error",
          "Cerrar"
        );
      });
  };

  const handleModo = (nuevoModo) => {
    setModo(nuevoModo);
    setUsuario("");
    setPassword("");
  };

  if (user || admin) { // Si hay un usuario o un admin logueado
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
            {modo === "firebase" && (
              <LoginForm
                title="Iniciar Sesión"
                onSubmit={iniciarSesionEmailPass}
                buttonText="Iniciar Sesión"
                usuario={usuario}
                setUsuario={setUsuario}
                password={password}
                setPassword={setPassword}
              />
            )}

            {modo === "registro" && (
              <LoginForm
                title="Crear una Cuenta"
                onSubmit={registrarUsuario}
                buttonText="Registrarse"
                usuario={usuario}
                setUsuario={setUsuario}
                password={password}
                setPassword={setPassword}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginBoost;
