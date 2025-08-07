// src/features/admin/components/FormularioProducto.jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createProduct } from "@/features/products/services/productService";
import ProductForm from "./ProductForm";
import { PATHS } from "@/constants/paths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/features/products/schemas/productSchema";
import { getFriendlyErrorMessage } from "@/utils/getFriendlyErrorMessage";

function FormularioProducto() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const createMutation = useMutation({
    mutationKey: ['createProduct'],
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("¡Producto agregado con éxito!");
      navigate(PATHS.ADMIN_DASHBOARD);
    },
    onError: (error) => {
      const message = getFriendlyErrorMessage(error);
      setError("root.serverError", { type: "custom", message });
      toast.error(message);
    }
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  

  return (
    <ProductForm
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      title="Agregar Nuevo Producto"
      buttonText="Agregar Producto"
    />
  );
}

export default FormularioProducto;
