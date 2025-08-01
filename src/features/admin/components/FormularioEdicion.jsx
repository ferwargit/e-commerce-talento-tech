// src/features/admin/components/FormularioEdicion.jsx
// Este componente muestra un formulario para editar un producto existente.
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, useIsMutating } from "@tanstack/react-query";
import { getProductById, updateProduct } from "@/features/products/services/productService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StyledLinkButton } from "@/components/ui/Button";
import ProductForm from "./ProductForm";
import { PATHS } from "@/constants/paths";

function FormularioEdicion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isUpdating = useIsMutating({ mutationKey: ['updateProduct', id] }) > 0;

  const { data: initialProductData, isLoading: cargando, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
  
  const updateMutation = useMutation({
    mutationKey: ['updateProduct', id],
    mutationFn: (updatedProduct) => updateProduct(updatedProduct.id, updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });

  const handleSubmit = async (data) => {
      const productoAActualizar = { ...data, id };
      toast.promise(updateMutation.mutateAsync(productoAActualizar), {
        pending: "Actualizando producto...",
        success: "¡Producto actualizado con éxito!",
        error: "Hubo un problema al actualizar el producto.",
      }).then(() => {
        setTimeout(() => navigate(`${PATHS.PRODUCTS}/${id}`), 2000);
      });
  };

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
          <p>{error.message}</p>
          <StyledLinkButton to={PATHS.PRODUCTS} $variant="primary">
            Volver a Productos
          </StyledLinkButton>
        </div>
      </div>
    );
  }

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
              {initialProductData && <ProductForm
                key={initialProductData.id} // Clave para forzar el re-renderizado con nuevos datos
                initialData={initialProductData}
                onSubmit={handleSubmit}
                isSubmitting={isUpdating}
                submitButtonText="Actualizar Producto"
              />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioEdicion;
