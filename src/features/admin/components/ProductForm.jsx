import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../../products/schemas/productSchema";
import { StyledButton } from "../../../components/ui/Button";
import {
  StyledInput,
  StyledTextarea,
} from "../../../components/ui/StyledFormElements";

// Componente de UI para mostrar errores de validación
const ErrorMessage = ({ message }) => (
  <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.875em' }}>{message}</p>
);

function ProductForm({
  onSubmit,
  initialData = {},
  submitButtonText,
  submitButtonVariant = "primary",
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Nombre del Producto
        </label>
        <StyledInput
          id="name"
          {...register("name")}
          className="form-control"
          placeholder="Ej: Teclado Mecánico RGB"
        />
        {errors.name && <ErrorMessage message={errors.name.message} />}
      </div>

      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          URL de la Imagen
        </label>
        <StyledInput
          id="image"
          {...register("image")}
          className="form-control"
          placeholder="/images/products/nombre-del-producto.jpg"
        />
        {errors.image && <ErrorMessage message={errors.image.message} />}
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
            {...register("price")}
            className="form-control"
            min="0.01"
            step="0.01"
          />
        </div>
        {errors.price && <ErrorMessage message={errors.price.message} />}
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="stock" className="form-label">
            Stock
          </label>
          <StyledInput
            id="stock"
            type="number"
            {...register("stock")}
            className="form-control"
            min="0"
          />
          {errors.stock && <ErrorMessage message={errors.stock.message} />}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="category" className="form-label">
            Categoría
          </label>
          <StyledInput
            id="category"
            {...register("category")}
            className="form-control"
            placeholder="Ej: Teclados"
          />
          {errors.category && <ErrorMessage message={errors.category.message} />}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="form-label">
          Descripción
        </label>
        <StyledTextarea
          id="description"
          {...register("description")}
          className="form-control"
          rows="4"
          placeholder="Describe el producto aquí..."
        />
        {errors.description && <ErrorMessage message={errors.description.message} />}
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