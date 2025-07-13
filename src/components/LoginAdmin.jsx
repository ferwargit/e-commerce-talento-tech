// src/components/LoginAdmin.jsx
import { useState, useEffect } from "react"; // 1. Importa useEffect
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import LoginForm from "./LoginForm";
import SEO from "./SEO";
import ThemedSwal from "../assets/ThemedSwal"; // 1. Importa nuestra alerta tematizada

function LoginAdmin() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { login, admin } = useAuthContext();
  const navigate = useNavigate();

  // --- LA SOLUCIÓN ---
  // 2. Usamos useEffect para manejar la redirección post-renderizado
  useEffect(() => {
    // Si el 'admin' está logueado, navega a la página de admin.
    if (admin) {
      navigate("/admin");
    }
  }, [admin, navigate]); // El efecto se re-ejecutará si 'admin' o 'navigate' cambian

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario === "admin" && password === "1234") {
      login("admin");
      // La redirección después del login es segura porque está dentro de un evento (onSubmit),
      // no durante el renderizado inicial.
      // El useEffect de arriba se encargará de la redirección de todas formas
      // cuando el estado 'admin' cambie a true.
    } else {
      // --- INICIO DE LA CORRECCIÓN ---
      // Reemplazamos el alert() nativo por nuestro ThemedSwal
      ThemedSwal.fire({
        title: "Error de Acceso",
        text: "Las credenciales de administrador no son correctas.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
      // --- FIN DE LA CORRECCIÓN ---
    }
  };

  // 3. Si es admin, renderizamos null para no mostrar el formulario mientras redirige.
  // Si no es admin, renderizamos el formulario.
  if (admin) {
    return null;
  }

  return (
    <>
      <SEO title="Acceso de Administrador" />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <LoginForm
              title="Acceso de Administrador"
              usernameLabel="Usuario"
              onSubmit={handleSubmit}
              buttonText="Ingresar"
              usuario={usuario}
              setUsuario={setUsuario}
              password={password}
              setPassword={setPassword}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginAdmin;
