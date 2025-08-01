// src/features/products/components/ProductoDetalle.test.jsx

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; 
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductoDetalle from "./ProductoDetalle";
import * as productService from '@/features/products/services/productService';

// Mock para react-router-dom para simular la navegación
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const originalModule = await vi.importActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

// Mock del service layer. Esta es la solución pragmática y robusta para este caso.
vi.mock("@/features/products/services/productService");

// Mock del store de Zustand para espiar sus acciones
const mockAgregarAlCarrito = vi.fn();
vi.mock('@/features/cart/store/carritoStore', () => ({
  useCarritoStore: vi.fn(() => mockAgregarAlCarrito),
}));


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
      <MemoryRouter initialEntries={["/productos/1"]}>
        <Routes>
          <Route path="/productos/:id" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("ProductoDetalle", () => {
  it("debería renderizar los detalles del producto y permitir añadirlo al carrito", async () => {
    // Arrange: Define lo que la función mockeada debe devolver para este test específico.
    productService.getProductById.mockResolvedValue({
      id: "1",
      name: "Teclado Mecánico desde Mock",
      price: 150,
      description: "Una descripción mockeada desde el servicio.",
      image: "test.jpg",
    });

    // Arrange: Renderizar el componente con sus proveedores
    render(<ProductoDetalle />, { wrapper: AllTheProviders });

    // Act & Assert: Verificar que los detalles del producto se muestran
    // Usamos `findBy` para esperar a que el contenido asíncrono cargue
    expect(await screen.findByText("Teclado Mecánico desde Mock")).toBeInTheDocument();
    expect(screen.getByText("Una descripción mockeada desde el servicio.")).toBeInTheDocument();

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

    // Assert: Verificar que la acción del store de Zustand fue llamada correctamente
    expect(mockAgregarAlCarrito).toHaveBeenCalledTimes(1);
    expect(mockAgregarAlCarrito).toHaveBeenCalledWith(expect.objectContaining({
      id: "1",
      name: "Teclado Mecánico desde Mock",
    }));
  });
});
