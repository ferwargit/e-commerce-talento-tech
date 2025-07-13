function Login({ setLogeadoUser, setLogeadoAdmin, user, admin }) {
  return (
    <div className="login-container">
      <div>
        <button type="" onClick={setLogeadoUser}>
          {user ? "Cerrar Sesion" : "Iniciar Sesion"}
        </button>
        <button type="" onClick={setLogeadoAdmin}>
          {admin ? "Cerrar Sesion Admin" : "Iniciar Sesion Admin"}
        </button>
      </div>
    </div>
  );
}

export default Login;
