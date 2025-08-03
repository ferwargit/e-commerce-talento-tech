// src/layouts/Nav.jsx
import { useState, useEffect, useRef } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useCarritoStore } from "@/features/cart/store/carritoStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { PATHS } from "@/constants/paths";
import RoleBasedGuard from "@/components/auth/RoleBasedGuard";
import { StyledInput } from "@/components/ui/StyledFormElements";
import { useDebounce } from "@/hooks/useDebounce";

import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { RiAdminFill, RiLoginBoxLine, RiAddBoxFill } from "react-icons/ri";
import {
  BsBoxSeamFill,
  BsFillHouseDoorFill,
  BsFillInfoCircleFill,
  BsFillTelephoneFill,
} from "react-icons/bs";

// --- Sub-componentes para los enlaces de la Navegación ---
const AdminNavLinks = ({
  closeMenu,
  handleLogout,
  terminoBusqueda,
  handleBusquedaChange,
  activeLinkStyle,
}) => (
  <>
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <NavLink
          className="nav-link"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          to={PATHS.HOME}
          onClick={closeMenu}
        >
          <BsFillHouseDoorFill className="me-2" />
          Inicio
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className="nav-link"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          to={PATHS.PRODUCTS}
          onClick={closeMenu}
        >
          <BsBoxSeamFill className="me-2" />
          Productos
        </NavLink>
      </li>
    </ul>
    <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
      <form
        className="d-flex"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <StyledInput
          type="search"
          placeholder="Buscar productos..."
          value={terminoBusqueda}
          onChange={handleBusquedaChange}
          style={{ width: "240px" }}
        />
      </form>
      <div className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle text-white"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <FaUserCircle className="me-1" /> Administrador
        </a>
        <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
          <li>
            <NavLink
              className="dropdown-item"
              to={PATHS.ADMIN_DASHBOARD}
              onClick={closeMenu}
            >
              <RiAdminFill className="me-1" />
              Gestión de Productos
            </NavLink>
          </li>
          <li>
            <NavLink
              className="dropdown-item"
              to={PATHS.ADMIN_ADD_PRODUCT}
              onClick={closeMenu}
            >
              <RiAddBoxFill className="me-1" />
              Agregar Producto
            </NavLink>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <Link
              className="dropdown-item"
              to={PATHS.HOME}
              onClick={handleLogout}
            >
              <RiLoginBoxLine className="me-1" />
              Cerrar Sesión
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </>
);

const ClientNavLinks = ({
  user,
  totalItems,
  closeMenu,
  handleLogout,
  terminoBusqueda,
  handleBusquedaChange,
  activeLinkStyle,
}) => (
  <>
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <NavLink
          className="nav-link"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          to={PATHS.HOME}
          onClick={closeMenu}
        >
          <BsFillHouseDoorFill className="me-2" />
          Inicio
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className="nav-link"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          to={PATHS.PRODUCTS}
          onClick={closeMenu}
        >
          <BsBoxSeamFill className="me-2" />
          Productos
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className="nav-link"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          to={PATHS.ABOUT}
          onClick={closeMenu}
        >
          <BsFillInfoCircleFill className="me-2" />
          Nosotros
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          className="nav-link"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          to={PATHS.CONTACT}
          onClick={closeMenu}
        >
          <BsFillTelephoneFill className="me-2" />
          Contacto
        </NavLink>
      </li>
    </ul>
    <hr className="d-lg-none" style={{ borderColor: "var(--color-border)" }} />
    <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
      <form
        className="d-flex w-100 w-lg-auto"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <StyledInput
          type="search"
          placeholder="Buscar productos..."
          value={terminoBusqueda}
          onChange={handleBusquedaChange}
          style={{ width: "240px" }}
        />
      </form>
      <ul className="navbar-nav d-flex flex-row justify-content-between w-100 w-lg-auto pt-3 pt-lg-0">
        <li className="nav-item">
          <NavLink className="nav-link" to={PATHS.CART} onClick={closeMenu}>
            <FaShoppingCart />
            {totalItems > 0 && (
              <span className="badge bg-primary ms-1">{totalItems}</span>
            )}
          </NavLink>
        </li>
        {user ? (
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUserCircle className="me-1" /> {user.split("@")[0]}
            </a>
            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
              <li>
                <Link
                  className="dropdown-item"
                  to={PATHS.HOME}
                  onClick={handleLogout}
                >
                  <RiLoginBoxLine className="me-1" />
                  Cerrar Sesión
                </Link>
              </li>
            </ul>
          </li>
        ) : (
          <li className="nav-item">
            <NavLink className="nav-link" to={PATHS.LOGIN} onClick={closeMenu}>
              <RiLoginBoxLine className="me-1" />
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  </>
);

function Nav() {
  const productosCarrito = useCarritoStore((state) => state.productosCarrito);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTermFromUrl = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(searchTermFromUrl);
  const debouncedInputValue = useDebounce(inputValue, 300);

  const user = useAuthStore((state) => state.user);
  const admin = useAuthStore((state) => state.admin);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();
  const location = useLocation();

  // Ref para evitar navegación automática cuando es causada por clic en enlaces
  const isNavigatingToDetail = useRef(false);
  // Ref para trackear si el usuario está escribiendo activamente
  const isUserTyping = useRef(false);

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeMenu = () => setIsNavCollapsed(true);

  const totalItems = productosCarrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  const activeLinkStyle = {
    color: "var(--color-primary)",
  };

  // Sincronizar el input con la URL SOLO cuando cambia la URL y hay un término de búsqueda
  // O cuando estamos en la página de productos
  useEffect(() => {
    if (searchTermFromUrl && searchTermFromUrl !== inputValue) {
      isUserTyping.current = false; // No es el usuario escribiendo, es sincronización
      setInputValue(searchTermFromUrl);
    } else if (
      !searchTermFromUrl &&
      location.pathname === PATHS.PRODUCTS &&
      inputValue
    ) {
      // Solo limpiar el input si estamos en productos y no hay término de búsqueda en la URL
      isUserTyping.current = false;
      setInputValue("");
    }
  }, [searchTermFromUrl, location.pathname]);

  // Detectar navegación a páginas de detalle para pausar búsqueda automática
  useEffect(() => {
    const isProductDetail = location.pathname.startsWith(PATHS.PRODUCTS + "/");
    if (isProductDetail && inputValue.trim()) {
      isNavigatingToDetail.current = true;
      // Resetear después de un breve delay
      setTimeout(() => {
        isNavigatingToDetail.current = false;
      }, 100);
    }
  }, [location.pathname, inputValue]);

  // Búsqueda automática global con debounce
  // useEffect(() => {
  //   const newQuery = debouncedInputValue.trim();
  //   const currentQuery = searchTermFromUrl;

  //   // No hacer nada si no hay cambio real, si estamos navegando a detalle, o si no es el usuario escribiendo
  //   if (newQuery === currentQuery || isNavigatingToDetail.current || !isUserTyping.current) {
  //     return;
  //   }

  //   if (newQuery) {
  //     // BÚSQUEDA GLOBAL: Navegar a productos con búsqueda desde cualquier página
  //     navigate(`${PATHS.PRODUCTS}?q=${encodeURIComponent(newQuery)}`);
  //   } else if (location.pathname === PATHS.PRODUCTS && searchTermFromUrl) {
  //     // Solo limpiar si estamos en productos y había una búsqueda
  //     const newSearchParams = new URLSearchParams(searchParams);
  //     newSearchParams.delete('q');
  //     setSearchParams(newSearchParams, { replace: true });
  //   }
  // }, [debouncedInputValue, searchTermFromUrl, navigate, location.pathname, setSearchParams, searchParams]);

  useEffect(() => {
    const newQuery = debouncedInputValue.trim();
    const currentQuery = searchTermFromUrl;

    if (
      newQuery === currentQuery ||
      isNavigatingToDetail.current ||
      !isUserTyping.current
    ) {
      return;
    }

    if (newQuery) {
      navigate(`${PATHS.PRODUCTS}?q=${encodeURIComponent(newQuery)}`);
      isUserTyping.current = false; // <-- AÑADIR ESTA LÍNEA
    } else if (location.pathname === PATHS.PRODUCTS && searchTermFromUrl) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("q");
      setSearchParams(newSearchParams, { replace: true });
      isUserTyping.current = false; // <-- AÑADIR ESTA LÍNEA
    }
  }, [
    debouncedInputValue,
    searchTermFromUrl,
    navigate,
    location.pathname,
    setSearchParams,
    searchParams,
  ]);

  const handleBusquedaChange = (e) => {
    isUserTyping.current = true; // Marcar que el usuario está escribiendo
    setInputValue(e.target.value);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const renderClientNav = () => (
    <ClientNavLinks
      user={user}
      totalItems={totalItems}
      closeMenu={closeMenu}
      handleLogout={handleLogout}
      terminoBusqueda={inputValue}
      handleBusquedaChange={handleBusquedaChange}
      activeLinkStyle={activeLinkStyle}
    />
  );

  const renderAdminNav = () => (
    <AdminNavLinks
      closeMenu={closeMenu}
      handleLogout={handleLogout}
      terminoBusqueda={inputValue}
      handleBusquedaChange={handleBusquedaChange}
      activeLinkStyle={activeLinkStyle}
    />
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to={PATHS.HOME} onClick={closeMenu}>
          TechStore
        </Link>
        {!location.pathname.startsWith("/admin/login") && (
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavCollapse}
            aria-controls="navContent"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}
        <div
          className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
          id="navContent"
        >
          <RoleBasedGuard
            allowedRoles={["admin"]}
            fallback={
              <RoleBasedGuard
                allowedRoles={["client", "guest"]}
                children={renderClientNav()}
              />
            }
          >
            {renderAdminNav()}
          </RoleBasedGuard>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
