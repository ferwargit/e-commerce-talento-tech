// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductosProvider } from "./context/ProductosContext.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./index.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ProductosProvider>
    <AuthProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </AuthProvider>
  </ProductosProvider>
  // {/* </StrictMode>, */}
);
