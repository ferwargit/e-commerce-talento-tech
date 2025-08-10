// src/layouts/Nav.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, test } from "vitest";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "./Nav";
import { PATHS } from "@/constants/paths";
import { useAuthStore } from "@/features/auth/store/authStore"; 

// Mocks
vi.mock("@/features/cart/store/carritoStore", () => ({
  useCarritoStore: vi.fn((selector) => selector({ productosCarrito: [] })),
}));

vi.mock("@/features/auth/store/authStore", () => ({
  useAuthStore: vi.fn(selector => selector({ user: null, admin: null, logout: vi.fn() })),
}));

// Mock mejorado para useProductSearch que maneja correctamente la lógica de limpieza
// Estado global para persistir el valor del search term entre renders
let globalSearchTerm = '';

vi.mock("@/features/products/hooks/useProductSearch", () => ({
  useProductSearch: () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Inicializar desde URL o valor global
    const initialTerm = searchParams.get('q') || globalSearchTerm || '';
    const [searchTerm, setSearchTerm] = useState(initialTerm);

    // Actualizar estado global cuando cambia el término local
    useEffect(() => {
      globalSearchTerm = searchTerm;
    }, [searchTerm]);

    // Sincronizar con URL al cambiar (solo si no hay valor global más reciente)
    useEffect(() => {
      const urlTerm = searchParams.get('q') || '';
      // Solo actualizar si el término de la URL es diferente Y no hay un valor más reciente
      if (urlTerm !== searchTerm && !globalSearchTerm) {
        setSearchTerm(urlTerm);
        globalSearchTerm = urlTerm;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleSearchChange = (e) => {
      const newValue = e.target.value;
      setSearchTerm(newValue);
      globalSearchTerm = newValue;

      // Simular comportamiento del hook real
      if (location.pathname === PATHS.PRODUCTS) {
        if (newValue.trim()) {
          setSearchParams({ q: newValue });
        } else {
          // Limpiar parámetros cuando el input está vacío
          setSearchParams({});
        }
      } else if (newValue.trim()) {
        navigate(`${PATHS.PRODUCTS}?q=${encodeURIComponent(newValue)}`);
      }
    };

    return {
      searchTerm: globalSearchTerm || searchTerm,
      handleSearchChange,
    };
  },
}));

// Componente helper
const LocationDisplay = () => {
  const location = useLocation();
  return (
    <div data-testid="location-display">
      {location.pathname}
      {location.search}
    </div>
  );
};

// --- Componentes Mock para simular las páginas ---
const MockProductList = () => (
  <div>
    <h1>Página de Productos</h1>
    <div data-testid="product-card">
      <p>Smartphone Apple</p>
      <Link to="/productos/smartphone-123">Ver Detalle</Link>
    </div>
  </div>
);

const MockProductDetail = () => (
  <div>
    <h1>Detalle del Producto</h1>
  </div>
);
const MockHome = () => (
  <div>
    <h1>Página de Inicio</h1>
  </div>
);
const MockContact = () => (
  <div>
    <h1>Página de Contacto</h1>
  </div>
);

const renderNavWithRouter = (initialEntries = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Nav />
      <LocationDisplay />
      <Routes>
        <Route path="/" element={<MockHome />} />
        <Route path={PATHS.CONTACT} element={<MockContact />} />
        <Route path={PATHS.PRODUCTS} element={<MockProductList />} />
        <Route path={`${PATHS.PRODUCTS}/:id`} element={<MockProductDetail />} />
        <Route path="*" element={<div>Página genérica</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Nav Component - E-commerce Search Experience", () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpiar estado global del mock
    globalSearchTerm = '';
    vi.mocked(useAuthStore).mockImplementation(selector => selector({
      user: null,
      admin: null,
      logout: vi.fn()
    }));
  });

  // El resto de tus tests están perfectos y no necesitan cambios.
  it("debería buscar automáticamente desde cualquier página (Home)", async () => {
    const user = userEvent.setup();
    renderNavWithRouter(["/"]);

    expect(screen.getByText("Página de Inicio")).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    await user.type(searchInput, "s");

    await waitFor(() => {
      expect(screen.getByTestId("location-display").textContent).toBe("/productos?q=s");
    });

    expect(screen.getByText("Página de Productos")).toBeInTheDocument();
    expect(searchInput.value).toBe("s");
  });

  it("debería buscar automáticamente desde la página de contacto", async () => {
    const user = userEvent.setup();
    renderNavWithRouter([PATHS.CONTACT]);

    expect(screen.getByText("Página de Contacto")).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    await user.type(searchInput, "smart");

    await waitFor(() => {
      expect(screen.getByTestId("location-display").textContent).toBe("/productos?q=smart");
    });

    expect(screen.getByText("Página de Productos")).toBeInTheDocument();
  });

  it("debería actualizar la búsqueda cuando ya está en productos", async () => {
    const user = userEvent.setup();
    renderNavWithRouter([PATHS.PRODUCTS]);

    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    await user.type(searchInput, "iphone");

    expect(searchInput.value).toBe("iphone");

    await waitFor(
      () => {
        expect(screen.getByTestId("location-display").textContent).toBe(`${PATHS.PRODUCTS}?q=iphone`);
      },
      { timeout: 1000 }
    );
  });

  test("flujo completo: buscar desde cualquier página → ver detalle → funciona sin conflictos", async () => {
    const user = userEvent.setup();
    renderNavWithRouter([PATHS.CONTACT]);

    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    await user.type(searchInput, "smart");

    await waitFor(() => {
      expect(screen.getByTestId("location-display").textContent).toBe("/productos?q=smart");
    });
    expect(screen.getByText("Página de Productos")).toBeInTheDocument();

    const detailLink = screen.getByRole("link", { name: /ver detalle/i });
    await user.click(detailLink);

    await waitFor(() => {
      expect(screen.getByTestId("location-display").textContent).toBe("/productos/smartphone-123");
    });
    expect(screen.getByText("Detalle del Producto")).toBeInTheDocument();
    expect(searchInput.value).toBe("smart");
  });

  test("debería navegar a nueva búsqueda desde página de detalle", async () => {
    const user = userEvent.setup();
    renderNavWithRouter([`${PATHS.PRODUCTS}/smartphone-123`]);

    expect(screen.getByText("Detalle del Producto")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    await user.clear(searchInput);
    await user.type(searchInput, "tablet");

    await waitFor(() => {
      expect(screen.getByTestId("location-display").textContent).toBe(`${PATHS.PRODUCTS}?q=tablet`);
    });
    expect(screen.getByText("Página de Productos")).toBeInTheDocument();
  });

  test("debería sincronizar el input con búsquedas existentes en la URL", async () => {
    renderNavWithRouter([`${PATHS.PRODUCTS}?q=existente`]);

    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    expect(searchInput.value).toBe("existente");
    expect(screen.getByTestId("location-display").textContent).toBe("/productos?q=existente");
  });

  test("debería limpiar la búsqueda cuando se borra el texto en productos", async () => {
    const user = userEvent.setup();
    renderNavWithRouter([`${PATHS.PRODUCTS}?q=test`]);

    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    expect(searchInput.value).toBe("test");

    // Borrar todo el contenido del input
    await user.clear(searchInput);

    // Esperar suficiente tiempo para el debounce (300ms) + margen adicional
    await waitFor(() => {
      expect(screen.getByTestId("location-display").textContent).toBe(PATHS.PRODUCTS);
    }, { timeout: 1000 });
  });

  test("NO debería interceptar navegación programática cuando hay valor en el input", async () => {
    vi.mocked(useAuthStore).mockImplementation(selector => selector({
      user: "test@example.com",
      admin: null,
      logout: vi.fn(),
    }));

    const user = userEvent.setup();
    const MockCart = () => (
      <div>
        <h1>Página del Carrito</h1>
      </div>
    );

    render(
      <MemoryRouter initialEntries={[`${PATHS.PRODUCTS}/smartphone-123`]}>
        <Nav />
        <LocationDisplay />
        <Routes>
          <Route path="/" element={<MockHome />} />
          <Route path={PATHS.CONTACT} element={<MockContact />} />
          <Route path={PATHS.PRODUCTS} element={<MockProductList />} />
          <Route path={`${PATHS.PRODUCTS}/:id`} element={<MockProductDetail />} />
          <Route path={PATHS.CART} element={<MockCart />} />
          <Route path="*" element={<div>Página genérica</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText("Detalle del Producto")).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    await user.type(searchInput, "smartphone");

    await waitFor(() => {
      expect(screen.getByTestId("location-display").textContent).toBe("/productos?q=smartphone");
    });
    
    const cartLink = screen.getByRole("link", {
      name: (name, element) => element.getAttribute("href") === PATHS.CART,
    });
    await user.click(cartLink);

    await waitFor(() => {
      expect(screen.getByTestId("location-display").textContent).toBe(PATHS.CART);
    });
    expect(screen.getByText("Página del Carrito")).toBeInTheDocument();
    expect(searchInput.value).toBe("smartphone");
  });

  test("NO debería interceptar navegación a otras páginas cuando input tiene valor", async () => {
    const user = userEvent.setup();
    renderNavWithRouter([`${PATHS.PRODUCTS}?q=test`]);

    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    expect(searchInput.value).toBe("test");
    expect(screen.getByText("Página de Productos")).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: /inicio/i });
    await user.click(homeLink);

    await waitFor(() => {
      expect(screen.getByTestId("location-display").textContent).toBe("/");
    });
    expect(screen.getByText("Página de Inicio")).toBeInTheDocument();
    expect(searchInput.value).toBe("test");
  });
});