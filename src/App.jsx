import { Suspense, lazy, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Nav from "./layouts/Nav";
import Footer from "./layouts/Footer";
import ScrollToTop from "./components/ui/ScrollToTop";
import { ToastContainer } from "react-toastify";
import { PATHS } from "./constants/paths";
import "react-toastify/dist/ReactToastify.css";

// --- Lazy Imports para Code Splitting ---
const Home = lazy(() => import("./layouts/Home"));
const ProductosContainer = lazy(() => import("./features/products/components/ProductosContainer"));
const Carrito = lazy(() => import("./features/cart/components/Carrito"));
const About = lazy(() => import("./pages/About"));
const Contacto = lazy(() => import("./pages/Contacto"));
const ProductoDetalle = lazy(() => import("./features/products/components/ProductoDetalle"));
const LoginBoost = lazy(() => import("./features/auth/components/LoginBoost"));
const FormularioProducto = lazy(() => import("./features/admin/components/FormularioProducto"));
const FormularioEdicion = lazy(() => import("./features/admin/components/FormularioEdicion"));
const AdminProductos = lazy(() => import("./features/admin/components/AdminProductos"));

function AppContent() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Nav
        terminoBusqueda={terminoBusqueda}
        setTerminoBusqueda={setTerminoBusqueda}
      />
      <main>
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="vh-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" variant="primary" />
            </div>
          }
        >
          <Routes>
            <Route path={PATHS.HOME} element={<Home />} />
            <Route path={PATHS.LOGIN} element={<LoginBoost />} />
            <Route
              path={PATHS.PRODUCTS}
              element={<ProductosContainer terminoBusqueda={terminoBusqueda} />}
            />
            <Route path={PATHS.CART} element={<Carrito />} />
            <Route path={PATHS.ABOUT} element={<About />} />
            <Route path={PATHS.CONTACT} element={<Contacto />} />
            <Route path={PATHS.PRODUCT_DETAIL} element={<ProductoDetalle />} />
            <Route
              path={PATHS.ADMIN_DASHBOARD}
              element={<AdminProductos terminoBusqueda={terminoBusqueda} />}
            />
            <Route
              path={PATHS.ADMIN_ADD_PRODUCT}
              element={<FormularioProducto />}
            />
            <Route
              path={PATHS.ADMIN_EDIT_PRODUCT}
              element={<FormularioEdicion />}
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
