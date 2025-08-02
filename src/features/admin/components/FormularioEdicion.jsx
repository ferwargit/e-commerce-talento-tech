// src/features/admin/components/FormularioEdicion.jsx
// Este componente muestra un formulario para editar un producto existente.
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductById, updateProduct } from "@/features/products/services/productService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StyledLinkButton } from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import ProductForm from "./ProductForm";
import { PATHS } from "@/constants/paths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/features/products/schemas/productSchema";
import { getFriendlyErrorMessage } from "@/utils/getFriendlyErrorMessage";

function FormularioEdicion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const admin = useAuthStore((state) => state.admin);
  const authLoading = useAuthStore((state) => state.loading);

  const { data: initialProductData, isLoading: cargando, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (initialProductData) {
      reset(initialProductData);
    }
  }, [initialProductData, reset]);

  const updateMutation = useMutation({
    mutationKey: ['updateProduct', id],
    mutationFn: (updatedProduct) => updateProduct(updatedProduct.id, updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("¡Producto actualizado con éxito!");
      navigate(`${PATHS.PRODUCTS}/${id}`);
    },
    onError: (error) => {
      const message = getFriendlyErrorMessage(error);
      setError("root.serverError", { type: "custom", message });
      toast.error(message);
    }
  });

  const onSubmit = (data) => {
    const productoAActualizar = { ...data, id };
    updateMutation.mutate(productoAActualizar);
  };

  if (authLoading) {
    return <Loader text="Verificando autenticación..." />;
  }

  if (!admin && !authLoading) {
    return <Navigate to="/login" replace />;
  }

  if (cargando) {
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
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      title="Editar Producto"
      buttonText="Actualizar Producto"
    />
  );
}

export default FormularioEdicion;
