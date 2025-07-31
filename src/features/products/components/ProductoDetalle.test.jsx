// src/components/ProductoDetalle.test.jsx

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; 
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductoDetalle from "./ProductoDetalle";
import { CarritoProvider } from "../../cart/context/CarritoContext";
import { AuthProvider } from "../../auth/context/AuthContext";

// Mock para react-router-dom para simular la navegación
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

// Mock (simulación) de los servicios
vi.mock("../services/productService", async () => {
  const originalModule = await vi.importActual("../services/productService");
  return {
    ...originalModule,
    getProductById: vi.fn().mockResolvedValue({
      id: "1",
      name: "Teclado Mecánico",
      price: 150,
      description: "Un teclado increíble.",
      image: "test.jpg",
    }),
    deleteProduct: vi.fn(),
  };
});

// Wrapper para proveer todos los contextos necesarios
const AllTheProviders = ({ children }) => {
  // Creamos una nueva instancia de QueryClient para cada test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Desactivamos los reintentos para que los tests no esperen innecesariamente
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <CarritoProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={["/productos/1"]}>
            <Routes>
              <Route path="/productos/:id" element={children} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </CarritoProvider>
    </QueryClientProvider>
  );
};

describe("ProductoDetalle", () => {
  it("debería renderizar los detalles del producto y permitir añadirlo al carrito", async () => {
    // Arrange: Renderizar el componente con sus proveedores
    render(<ProductoDetalle />, { wrapper: AllTheProviders });

    // Act & Assert: Verificar que los detalles del producto se muestran
    // Usamos `findBy` para esperar a que el contenido asíncrono cargue
    expect(await screen.findByText("Teclado Mecánico")).toBeInTheDocument();
    expect(screen.getByText("Un teclado increíble.")).toBeInTheDocument();

    // Act: El usuario hace clic en el botón "Agregar al Carrito"
    const botonAgregar = screen.getByRole("button", {
      name: /agregar al carrito/i,
    });
    await userEvent.click(botonAgregar);

    // Assert: Verificar que el modal de confirmación aparece
    // `waitFor` es útil para esperar a que aparezcan elementos después de una acción
    await waitFor(() => {
      expect(screen.getByText("¡Producto Agregado!")).toBeInTheDocument();
    });
  });
});
