import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

export default function Admin() {
  const { admin } = useAuthContext();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="container my-5 text-center">
      <p className="lead" style={{ color: 'var(--color-text-muted)' }}>Componente Admin</p>
    </div>
  );
}
