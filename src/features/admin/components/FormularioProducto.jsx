import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../auth/context/AuthContext";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { createProduct } from "../../products/services/productService";
import ProductForm from "./ProductForm";
import { validarFormularioProducto } from "../utils/productValidation";

function FormularioProducto() {
  const queryClient = useQueryClient();
  const { admin } = useAuthContext();

  const [producto, setProducto] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: "",
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Reseteamos el formulario
      setProducto({
        name: "", price: "", stock: "",
        category: "", description: "", image: "",
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validarForm = validarFormularioProducto(producto);
    if (validarForm === true) {
      const productoConNumeros = {
        ...producto,
        price: Number(producto.price),
        stock: Number(producto.stock),
      };

      toast.promise(createMutation.mutateAsync(productoConNumeros), {
        pending: "Agregando producto...",
        success: "¡Producto agregado con éxito!",
        error: "Hubo un problema al agregar el producto.",
      });
    } else {
      toast.error(validarForm);
    }
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
                producto={producto}
                setProducto={setProducto}
                onSubmit={handleSubmit}
                isSubmitting={createMutation.isPending}
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
