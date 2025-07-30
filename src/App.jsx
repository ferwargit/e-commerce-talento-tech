import { Suspense, lazy } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Lazy Imports para Code Splitting ---
const Home = lazy(() => import("./layouts/Home"));
const ProductosContainer = lazy(() => import("./components/ProductosContainer"));
const Carrito = lazy(() => import("./components/Carrito"));
const About = lazy(() => import("./components/About"));
const Contacto = lazy(() => import("./components/Contacto"));
const ProductoDetalle = lazy(() => import("./components/ProductoDetalle"));
const LoginBoost = lazy(() => import("./components/LoginBoost"));
const FormularioProducto = lazy(() => import("./components/FormularioProducto"));
const FormularioEdicion = lazy(() => import("./components/FormularioEdicion"));
const AdminProductos = lazy(() => import("./components/AdminProductos"));

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
        <Suspense
          fallback={
            <div className="vh-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" variant="primary" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginBoost />} />
            <Route path="/productos" element={<ProductosContainer />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} />
            <Route path="/admin" element={<AdminProductos />} />
            <Route
              path="/admin/agregarProducto"
              element={<FormularioProducto />}
            />
            <Route
              path="/admin/editarProducto/:id"
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
