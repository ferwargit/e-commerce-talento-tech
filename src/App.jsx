import { Suspense, lazy } from "react"; // Eliminamos useState
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from "@/layouts/Nav";
import Footer from "@/layouts/Footer";
import Loader from "@/components/ui/Loader";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { ToastContainer } from "react-toastify";
import { PATHS } from "@/constants/paths";
import "react-toastify/dist/ReactToastify.css";
import RoleBasedGuard from "@/components/auth/RoleBasedGuard";

// --- Lazy Imports para Code Splitting ---
const Home = lazy(() => import("@/layouts/Home"));
const ProductosContainer = lazy(() =>
  import("@/features/products/pages/ProductosContainer")
);
const Carrito = lazy(() => import("@/features/cart/components/Carrito"));
const About = lazy(() => import("@/features/about/pages/About"));
const Contacto = lazy(() => import("@/features/contact/pages/Contacto"));
const ProductoDetalle = lazy(() =>
  import("@/features/products/pages/ProductoDetalle")
);
const LoginBoost = lazy(() => import("@/features/auth/components/LoginBoost"));
const FormularioProducto = lazy(() =>
  import("@/features/admin/components/FormularioProducto")
);
const FormularioEdicion = lazy(() =>
  import("@/features/admin/components/FormularioEdicion")
);
const AdminProductos = lazy(() =>
  import("@/features/admin/components/AdminProductos")
);

function AppContent() {
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
      <Nav />
      <main>
        <ScrollToTop />
        <Suspense fallback={<Loader text="Cargando página..." />}>
          <Routes>
            <Route path={PATHS.HOME} element={<Home />} />
            <Route path={PATHS.LOGIN} element={<LoginBoost />} />
            <Route path={PATHS.PRODUCTS} element={<ProductosContainer />} />
            <Route path={PATHS.CART} element={<Carrito />} />
            <Route path={PATHS.ABOUT} element={<About />} />
            <Route path={PATHS.CONTACT} element={<Contacto />} />
            <Route path={PATHS.PRODUCT_DETAIL} element={<ProductoDetalle />} />
            <Route
              path={PATHS.ADMIN_DASHBOARD}
              element={
                <RoleBasedGuard
                  allowedRoles={["admin"]}
                  fallback={<Navigate to="/login" replace />}
                >
                  <AdminProductos />
                </RoleBasedGuard>
              }
            />
            <Route
              path={PATHS.ADMIN_ADD_PRODUCT}
              element={
                <RoleBasedGuard
                  allowedRoles={["admin"]}
                  fallback={<Navigate to="/login" replace />}
                >
                  <FormularioProducto />
                </RoleBasedGuard>
              }
            />
            <Route
              path={PATHS.ADMIN_EDIT_PRODUCT}
              element={
                <RoleBasedGuard
                  allowedRoles={["admin"]}
                  fallback={<Navigate to="/login" replace />}
                >
                  <FormularioEdicion />
                </RoleBasedGuard>
              }
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
