// src/features/admin/components/ProductForm.jsx
import { StyledButton } from "../../../components/ui/Button";
import {
  StyledInput,
  StyledTextarea,
} from "../../../components/ui/StyledFormElements";

function ProductForm({
  producto,
  setProducto,
  onSubmit,
  isSubmitting,
  submitButtonText,
  submitButtonVariant = "primary",
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} noValidate>
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
          placeholder="Ej: Teclado Mecánico RGB"
          required
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
          placeholder="/images/products/nombre-del-producto.jpg"
          required
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
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="stock" className="form-label">
            Stock
          </label>
          <StyledInput
            id="stock"
            type="number"
            name="stock"
            value={producto.stock || ""}
            onChange={handleChange}
            className="form-control"
            required
            min="0"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="category" className="form-label">
            Categoría
          </label>
          <StyledInput
            id="category"
            type="text"
            name="category"
            value={producto.category || ""}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Ej: Teclados"
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
          placeholder="Describe el producto aquí..."
        />
      </div>

      <div className="d-grid">
        <StyledButton
          type="submit"
          $variant={submitButtonVariant}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Procesando..." : submitButtonText}
        </StyledButton>
      </div>
    </form>
  );
}

export default ProductForm;