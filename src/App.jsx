// src/App.jsx
import "./App.css";
import Home from "./layouts/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductosContainer from "./components/ProductosContainer";
import Carrito from "./components/Carrito";
import About from "./components/About";
import Contacto from "./components/Contacto";
import ProductoDetalle from "./components/ProductoDetalle";
import LoginAdmin from "./components/LoginAdmin";
import LoginBoost from "./components/LoginBoost";
import FormularioProducto from "./components/FormularioProducto";
import FormularioEdicion from "./components/FormularioEdicion";
import AdminProductos from "./components/AdminProductos";

// Creamos un sub-componente para poder usar el hook 'useLocation'
function AppContent() {
  const location = useLocation();
  const showFooter = location.pathname !== "/admin/login";

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginBoost />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/productos" element={<ProductosContainer />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/admin" element={<AdminProductos />} />
          <Route
            path="/admin/agregarProductos"
            element={<FormularioProducto />}
          />
          <Route
            path="/admin/editarProducto/:id"
            element={<FormularioEdicion />}
          />
        </Routes>
      </main>
      {/* 2. Renderizamos el Footer solo si 'showFooter' es true */}
      {showFooter && <Footer />}
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
