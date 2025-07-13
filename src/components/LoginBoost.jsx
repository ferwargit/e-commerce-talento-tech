// src/components/LoginBoost.jsx
import SEO from "./SEO";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { crearUsuario, loginEmailPass } from "../auth/firebase";
import { dispararSweetBasico } from "../assets/SweetAlert";
import LoginForm from "./LoginForm"; // 1. Importamos nuestro nuevo componente
import { StyledButton } from "./Button";

function LoginBoost() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [modo, setModo] = useState("firebase");

  const { login, user, logout, admin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); // 2. Obtén la ubicación

  // 3. Determinamos a dónde redirigir después del login
  const from = location.state?.from?.pathname || "/";

  const registrarUsuario = (e) => {
    e.preventDefault();
    crearUsuario(usuario, password)
      .then(() => {
        login(usuario);
        dispararSweetBasico("Logeo exitoso", "", "success", "Confirmar");
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
        login(usuario);
        dispararSweetBasico("Logeo exitoso", "", "success", "Confirmar");
        // 4. Usamos nuestra nueva ruta de redirección dinámica
        navigate(from, { replace: true });
      })
      .catch((error) => {
        dispararSweetBasico(
          "Credenciales incorrectas",
          "El email o la contraseña no son válidos.",
          "error",
          "Cerrar"
        );
      });
  };

  const cerrarSesion = (e) => {
    e.preventDefault();
    logout();
  };

  const handleModo = (nuevoModo) => {
    setModo(nuevoModo);
    setUsuario("");
    setPassword("");
  };

  if (user || admin) {
    return (
      <div className="container text-center mt-5">
        <p>Ya has iniciado sesión</p>
        <StyledButton onClick={cerrarSesion} $variant="danger">
          Cerrar sesión
        </StyledButton>
      </div>
    );
  }

  // 2. Aquí está el nuevo layout mejorado
  return (
    <>
      <SEO
        title="Login"
        description="Inicia sesión o regístrate en nuestra tienda"
      />

      <div className="container mt-5">
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
              {/* <button
                type="button"
                className={`btn ${
                  modo === "manual" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => handleModo("manual")}
              >
                Acceso Admin
              </button> */}
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

            {/* {modo === "manual" && (
              <LoginForm
                title="Acceso Admin"
                usernameLabel="Usuario:"
                onSubmit={handleSubmitManual}
                buttonText="Iniciar Sesión"
                usuario={usuario}
                setUsuario={setUsuario}
                password={password}
                setPassword={setPassword}
              />
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginBoost;
