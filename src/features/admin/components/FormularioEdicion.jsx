import { useParams } from 'react-router-dom';
import { useProductForm } from '@/features/admin/hooks/useProductForm';
import ProductForm from '../components/ProductForm';
import Loader from '@/components/ui/Loader';
import { StyledLinkButton } from '@/components/ui/Button';
import { PATHS } from '@/constants/paths';

function FormularioEdicion() {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    error,
  } = useProductForm({ id });

  if (isLoading) {
    return <Loader text="Cargando datos del producto..." />;
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center">
          <h2>Error</h2>
          <p>{error.message}</p>
          <StyledLinkButton to={PATHS.PRODUCTS} $variant="primary">
            Volver a Productos
          </StyledLinkButton>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      onSubmit={handleSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      title="Editar Producto"
      buttonText="Actualizar Producto"
    />
  );
}

export default FormularioEdicion;