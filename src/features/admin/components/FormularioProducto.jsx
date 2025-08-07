import { useProductForm } from '@/features/admin/hooks/useProductForm';
import ProductForm from '../components/ProductForm';

function FormularioProducto() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
  } = useProductForm();

  return (
    <ProductForm
      onSubmit={handleSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      title="Agregar Nuevo Producto"
      buttonText="Agregar Producto"
    />
  );
}

export default FormularioProducto;