import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { crearUsuario, loginEmailPass } from "../auth/firebase";
import { dispararSweetBasico } from "../assets/SweetAlert";

function Login2() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [modo, setModo] = useState("firebase"); // 'firebase' | 'registro' | 'manual'

  const { login, user, logout, admin } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmitManual = (e) => {
    e.preventDefault();
    if (usuario === "admin" && password === "1234") {
      login("admin");
      navigate("/");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const registrarUsuario = (e) => {
    e.preventDefault();
    crearUsuario(usuario, password)
      .then(() => {
        login(usuario);
        dispararSweetBasico("Logeo exitoso", "", "success", "Confirmar");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          dispararSweetBasico(
            "Credenciales incorrectas",
            "",
            "error",
            "Cerrar"
          );
        }
        if (error.code === "auth/weak-password") {
          dispararSweetBasico(
            "Contraseña débil",
            "Password should be at least 6 characters",
            "error",
            "Cerrar"
          );
        }
      });
  };

  const cerrarSesion = (e) => {
    e.preventDefault();
    logout();
  };

  const iniciarSesionEmailPass = (e) => {
    e.preventDefault();
    loginEmailPass(usuario, password)
      .then(() => {
        login(usuario);
        dispararSweetBasico("Logeo exitoso", "", "success", "Confirmar");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          dispararSweetBasico(
            "Credenciales incorrectas",
            "",
            "error",
            "Cerrar"
          );
        }
      });
  };

  const handleModo = (nuevoModo) => {
    setModo(nuevoModo);
    setUsuario("");
    setPassword("");
  };

  if (user || admin ) {
    return (
      <form onSubmit={cerrarSesion}>
        <button type="submit">Cerrar sesión</button>
      </form>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => handleModo("firebase")}>Login con Email</button>
        <button onClick={() => handleModo("registro")}>Registrarse</button>
        <button onClick={() => handleModo("manual")}>Login Manual</button>
      </div>

      {modo === "firebase" && (
        <form onSubmit={iniciarSesionEmailPass}>
          <h2>Iniciar sesión con Email y pass</h2>
          <div>
            <label>Email:</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
      )}

      {modo === "registro" && (
        <form onSubmit={registrarUsuario}>
          <h2>Registrarse</h2>
          <div>
            <label>Email:</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Registrarse</button>
        </form>
      )}

      {modo === "manual" && (
        <form onSubmit={handleSubmitManual}>
          <h2>Login Manual (usuario: admin / pass: 1234)</h2>
          <div>
            <label>Usuario:</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
      )}
    </div>
  );
}

export default Login2;
