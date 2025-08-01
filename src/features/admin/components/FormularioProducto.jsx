// src/features/admin/components/FormularioProducto.jsx
import { useMutation, useQueryClient, useIsMutating } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { createProduct } from "@/features/products/services/productService";
import ProductForm from "./ProductForm";
import { PATHS } from "@/constants/paths";

function FormularioProducto() {
  const queryClient = useQueryClient();
  const admin = useAuthStore((state) => state.admin);
  const navigate = useNavigate();
  const isCreating = useIsMutating({ mutationKey: ['createProduct'] }) > 0;

  const createMutation = useMutation({
    mutationKey: ['createProduct'],
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate(PATHS.ADMIN_DASHBOARD);
    },
  });

  const handleSubmit = async (data) => {
      toast.promise(createMutation.mutateAsync(data), {
        pending: "Agregando producto...",
        success: "¡Producto agregado con éxito!",
        error: "Hubo un problema al agregar el producto.",
      });
  };

  if (!admin) {
    return <Navigate to="/login" replace />;
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
                Agregar Nuevo Producto
              </h2>
              <ProductForm
                onSubmit={handleSubmit}
                isSubmitting={isCreating}
                submitButtonText="Agregar Producto"
                submitButtonVariant="success"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioProducto;
