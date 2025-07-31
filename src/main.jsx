import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CarritoProvider } from "../src/features/cart/context/CarritoContext.jsx";
import { AuthProvider } from "../src/features/auth/context/AuthContext.jsx";
import { ProductosProvider } from "../src/features/products/context/ProductosContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";

// Crear un cliente
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ProductosProvider>
        <AuthProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </AuthProvider>
      </ProductosProvider>
    </QueryClientProvider>
  </StrictMode>
);
