// src/components/FormularioEdicion.jsx
// Este componente muestra un formulario para editar un producto existente.
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductById, updateProduct } from "../../products/services/productService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StyledLinkButton } from "../../../components/ui/Button";
import ProductForm from "./ProductForm";
import { validarFormularioProducto } from "../utils/productValidation";

function FormularioEdicion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [producto, setProducto] = useState(null);

  const { data: initialProductData, isLoading: cargando, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (initialProductData) {
      setProducto(initialProductData);
    }
  }, [initialProductData]);

  const updateMutation = useMutation({
    mutationFn: (updatedProduct) => updateProduct(updatedProduct.id, updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const esValido = validarFormularioProducto(producto);
    if (esValido === true) {
      // Aseguramos que los valores numéricos se envíen como números
      const productoAActualizar = {
        ...producto,
        price: Number(producto.price),
        stock: Number(producto.stock),
      };
      toast.promise(
        updateMutation.mutateAsync(productoAActualizar), {
        pending: "Actualizando producto...",
        success: "¡Producto actualizado con éxito!",
        error: "Hubo un problema al actualizar el producto.",
      }).then(() => {
        setTimeout(() => navigate(`/productos/${id}`), 2000);
      });
    } else {
      toast.error(esValido);
    }
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
          <StyledLinkButton to="/productos" $variant="primary">
            Volver a Productos
          </StyledLinkButton>
        </div>
      </div>
    );
  }

  // Evita renderizar el formulario hasta que los datos iniciales estén listos
  if (!producto) return null;

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
              <ProductForm
                producto={producto}
                setProducto={setProducto}
                onSubmit={handleSubmit}
                isSubmitting={updateMutation.isPending}
                submitButtonText="Actualizar Producto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioEdicion;
