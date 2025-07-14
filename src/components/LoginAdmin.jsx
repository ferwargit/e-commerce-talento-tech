import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import LoginForm from "./LoginForm";
import SEO from "./SEO";
import ThemedSwal from "../assets/ThemedSwal"; 

function LoginAdmin() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { login, admin } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate("/admin");
    }
  }, [admin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario === "admin" && password === "1234") {
      login("admin");
    } else {
      ThemedSwal.fire({
        title: "Error de Acceso",
        text: "Las credenciales de administrador no son correctas.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };

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
