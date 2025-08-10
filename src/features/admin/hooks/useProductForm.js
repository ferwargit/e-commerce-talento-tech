
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { getProductById, createProduct, updateProduct } from '@/features/products/services/productService';
import { productSchema } from '@/features/products/schemas/productSchema';
import { getFriendlyErrorMessage } from '@/utils/getFriendlyErrorMessage';
import { PATHS } from '@/constants/paths';

export function useProductForm({ id } = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEditMode = !!id;

  // Lógica de obtención de datos solo para el modo de edición
  const { data: initialProductData, isLoading: isLoadingProduct, error: errorProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: isEditMode, // Solo se ejecuta si estamos en modo de edición
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

  // Lógica para resetear el formulario cuando los datos iniciales están disponibles
  useEffect(() => {
    if (isEditMode && initialProductData) {
      reset(initialProductData);
    }
  }, [initialProductData, isEditMode, reset]);

  // Mutación para crear o actualizar
  const mutation = useMutation({
    mutationFn: (productData) => {
      return isEditMode ? updateProduct(id, productData) : createProduct(productData);
    },
    onSuccess: (_variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ['product', id] });
        toast.success('¡Producto actualizado con éxito!');
        navigate(`${PATHS.PRODUCTS}/${id}`);
      } else {
        toast.success('¡Producto agregado con éxito!');
        navigate(PATHS.ADMIN_DASHBOARD);
      }
    },
    onError: (error) => {
      const message = getFriendlyErrorMessage(error);
      setError('root.serverError', { type: 'custom', message });
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: isSubmitting || mutation.isPending,
    isLoading: isLoadingProduct,
    error: errorProduct,
    isEditMode,
    onSubmit,
  };
}
