import { StyledInput, StyledTextarea, StyledLabel } from "@/components/ui/StyledFormElements";
import { StyledButton } from "@/components/ui/Button";
import styled from "styled-components";

const FormContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2.5rem;
  background-color: var(--color-background-light);
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-border);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem; /* Reducido para un diseño más compacto, similar a mb-3 de Bootstrap */

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    
    .full-width {
      grid-column: 1 / -1;
    }
  }
`;

/* Componente específico para el input de precio para que se integre visualmente con el span '$' */
const PriceInput = styled(StyledInput)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  /* Estas dos líneas son la clave para la alineación correcta */
  width: auto;
  flex: 1 1 auto;
`;

const ErrorMessage = styled.p`
  color: var(--color-danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  min-height: 1rem; // Evita que el layout salte al aparecer/desaparecer el error
`;

function ProductForm({ onSubmit, register, errors, isSubmitting, title, buttonText }) {
  return (
    <FormContainer>
      <form onSubmit={onSubmit} noValidate>
        <h1 className="text-center mb-4" style={{ color: "var(--color-text-primary)" }}>{title}</h1>

        {errors.root?.serverError && (
          <div className="alert alert-danger">
            {errors.root.serverError.message}
          </div>
        )}

        <FormGrid>
          <div className="full-width">
            <StyledLabel htmlFor="name">Nombre del Producto</StyledLabel>
            <StyledInput
              id="name"
              {...register("name")}
              disabled={isSubmitting}
              aria-invalid={errors.name ? "true" : "false"}
              placeholder="Ej: Teclado Mecánico RGB"
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          <div>
            <StyledLabel htmlFor="price">Precio</StyledLabel>
            <div className="input-group">
              <span className="input-group-text" style={{ 
                backgroundColor: 'var(--color-background-dark)', 
                borderColor: 'var(--color-border)', 
                color: 'var(--color-text-muted)' 
              }}>$</span>
              <PriceInput
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                disabled={isSubmitting}
                aria-invalid={errors.price ? "true" : "false"}
                placeholder="199.99"
              />
            </div>
            {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
          </div>

          <div>
            <StyledLabel htmlFor="stock">Stock</StyledLabel>
            <StyledInput
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              disabled={isSubmitting}
              aria-invalid={errors.stock ? "true" : "false"}
              placeholder="50"
            />
            {errors.stock && <ErrorMessage>{errors.stock.message}</ErrorMessage>}
          </div>

          <div className="full-width">
            <StyledLabel htmlFor="category">Categoría</StyledLabel>
            <StyledInput
              id="category"
              {...register("category")}
              disabled={isSubmitting}
              aria-invalid={errors.category ? "true" : "false"}
              placeholder="Ej: Teclados, Mouses, Monitores"
            />
            {errors.category && <ErrorMessage>{errors.category.message}</ErrorMessage>}
          </div>

          <div className="full-width">
            <StyledLabel htmlFor="description">Descripción</StyledLabel>
            <StyledTextarea
              id="description"
              rows="4"
              {...register("description")}
              disabled={isSubmitting}
              aria-invalid={errors.description ? "true" : "false"}
              placeholder="Describe las características principales del producto..."
            />
            {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
          </div>

          <div className="full-width">
            <StyledLabel htmlFor="image">URL de la Imagen</StyledLabel>
            <StyledInput
              id="image"
              {...register("image")}
              disabled={isSubmitting}
              aria-invalid={errors.image ? "true" : "false"}
              placeholder="Ej: /images/products/teclado-mecanico.jpg"
            />
            {errors.image && <ErrorMessage>{errors.image.message}</ErrorMessage>}
          </div>
        </FormGrid>

        <StyledButton type="submit" $variant="primary" className="w-100 mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : buttonText}
        </StyledButton>
      </form>
    </FormContainer>
  );
}

export default ProductForm;
