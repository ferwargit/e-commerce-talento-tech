import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductosContext } from "../context/ProductosContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Asegúrate de importar los estilos de Toastify
import { StyledButton, StyledLinkButton } from "./Button";
import { StyledInput, StyledTextarea } from "./StyledFormElements";

function FormularioEdicion() {
  const { obtenerProducto, editarProducto } = useProductosContext();
  const { id } = useParams();
  const navigate = useNavigate();

  // 'producto' es el estado del formulario, inicializado como null
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // 1. useEffect mejorado para cargar los datos del producto
  useEffect(() => {
    obtenerProducto(id)
      .then((productoCargado) => {
        setProducto(productoCargado); // Poblamos el estado del formulario con los datos recibidos
      })
      .catch((err) => {
        setError(
          err.message || "Hubo un error al cargar los datos del producto."
        );
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id, obtenerProducto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const validarFormulario = () => {
    if (!producto.name.trim()) return "El nombre es obligatorio.";
    if (!producto.price || producto.price <= 0)
      return "El precio debe ser un número positivo.";
    if (!producto.description.trim() || producto.description.length < 10)
      return "La descripción debe tener al menos 10 caracteres.";
    if (!producto.image.trim())
      return "La URL de la imagen no debe estar vacía.";
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const esValido = validarFormulario();
    if (esValido === true) {
      toast
        .promise(editarProducto(producto), {
          pending: "Actualizando producto...",
          success: "¡Producto actualizado con éxito!",
          error: "Hubo un problema al actualizar el producto.",
        })
        .then(() => {
          setTimeout(() => navigate(`/productos/${id}`), 2000); // Redirige al detalle después de 2s
        });
    } else {
      toast.error(esValido);
    }
  };

  // 2. Estados de carga y error profesionales
  if (cargando) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">
            Cargando datos del producto...
          </span>
        </div>
        <p className="mt-2 text-light">Cargando datos del producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center">
          <h2>Error</h2>
          <p>{error}</p>
          <StyledLinkButton to="/productos" $variant="primary">
            Volver a Productos
          </StyledLinkButton>
        </div>
      </div>
    );
  }

  // 3. JSX del formulario modernizado
  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div
            className="card shadow-lg border-0"
            style={{
              backgroundColor: "var(--color-background-light)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="card-body p-4">
              <h2
                className="card-title text-center mb-4"
                style={{ color: "var(--color-text-primary)" }}
              >
                Editar Producto
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre del Producto
                  </label>
                  <StyledInput
                    id="name"
                    type="text"
                    name="name"
                    value={producto.name || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                    style={{
                      backgroundColor: "var(--color-background-dark)",
                      color: "var(--color-text-primary)",
                      borderColor: "var(--color-border)",
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    URL de la Imagen
                  </label>
                  <StyledInput
                    id="image"
                    type="text"
                    name="image"
                    value={producto.image || ""}
                    onChange={handleChange}
                    className="form-control"
                    required
                    style={{
                      backgroundColor: "var(--color-background-dark)",
                      color: "var(--color-text-primary)",
                      borderColor: "var(--color-border)",
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Precio
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <StyledInput
                      id="price"
                      type="number"
                      name="price"
                      value={producto.price || ""}
                      onChange={handleChange}
                      className="form-control"
                      required
                      min="0.01"
                      step="0.01"
                      style={{
                      backgroundColor: "var(--color-background-dark)",
                      color: "var(--color-text-primary)",
                      borderColor: "var(--color-border)",
                    }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    Descripción
                  </label>
                  <StyledTextarea
                    id="description"
                    name="description"
                    value={producto.description || ""}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                    required
                    style={{
                      backgroundColor: "var(--color-background-dark)",
                      color: "var(--color-text-primary)",
                      borderColor: "var(--color-border)",
                    }}
                  />
                </div>

                <div className="d-grid">
                  <StyledButton type="submit" $variant="primary">
                    Actualizar Producto
                  </StyledButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioEdicion;
