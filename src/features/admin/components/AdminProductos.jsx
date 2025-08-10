// src/features/admin/components/AdminProductos.jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/features/products/services/productService";
import { StyledLinkButton, StyledButton } from "@/components/ui/Button";
import SEO from "@/components/ui/SEO";
import { toast } from "react-toastify";
import styles from "./AdminTable.module.css";
import ThemedSwal from "@/assets/ThemedSwal";
import Loader from "@/components/ui/Loader";
import Paginador from "@/components/ui/Paginador";
import { useProducts } from "@/features/products/hooks/useProducts";
import { usePagination } from "@/hooks/usePagination";
import { formatPrice } from "@/utils/formatters";

function AdminProductos() {
  const queryClient = useQueryClient();
  const { productos, productosFiltrados, isLoading: cargando, error } =
    useProducts();
  const {
    currentPage,
    totalPages,
    currentData: currentProducts,
    handlePageChange,
  } = usePagination(productosFiltrados, 10);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado con éxito 👌");
    },
  });

  const handleEliminar = (id, nombreProducto) => {
    ThemedSwal.fire({
      title: "¿Estás seguro?",
      text: `No podrás revertir la eliminación de "${nombreProducto}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, ¡eliminar!",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "var(--color-danger)",
      cancelButtonColor: "#4b5563",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id); // Llamada más simple, los efectos se manejan en la mutación
      }
    });
  };

  

  if (cargando) {
    return <Loader text="Cargando gestión de productos..." />;
  }

  if (error) {
    return (
      <div className="container text-center my-5 text-danger">
        <h4>Error al cargar los productos</h4>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Gestión de Productos" />
      <div className="container-lg my-5">
        <h1
          className="mb-5 text-center"
          style={{ color: "var(--color-text-primary)" }}
        >
          Gestión de Productos
        </h1>

        <div className="d-flex justify-content-end mb-4">
          <StyledLinkButton to="/admin/agregarProducto" $variant="success">
            + Crear Nuevo Producto
          </StyledLinkButton>
        </div>

        <div>
          <table className={`w-100 ${styles.customTable}`}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th className={styles.priceHeader}>Precio</th>
                <th className={styles.actionsHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((producto) => (
                <tr key={producto.id}>
                  <td data-label="Imagen" className={styles.imageCell}>
                    <img
                      src={producto.image}
                      alt={producto.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                      className="rounded"
                    />
                  </td>
                  <td data-label="Nombre">
                    <span className={styles.cellValue}>{producto.name}</span>
                  </td>
                  <td data-label="Categoría">
                    <span className={styles.cellValue}>
                      {producto.category}
                    </span>
                  </td>
                  <td data-label="Stock">
                    <span className={styles.cellValue}>{producto.stock}</span>
                  </td>
                  <td data-label="Precio" className={styles.priceCell}>
                    <span className={styles.cellValue}>
                      {formatPrice(producto.price)}
                    </span>
                  </td>
                  <td data-label="Acciones">
                    <div className="btn-group d-flex justify-content-center">
                      <StyledLinkButton
                        to={`/admin/editarProducto/${producto.id}`}
                        $variant="primary"
                        style={{ padding: "5px 10px", fontSize: "14px" }}
                      >
                        Editar
                      </StyledLinkButton>
                      <StyledButton
                        onClick={() =>
                          handleEliminar(producto.id, producto.name)
                        }
                        $variant="danger"
                        style={{ padding: "5px 10px", fontSize: "14px" }}
                      >
                        Eliminar
                      </StyledButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lógica de mensajes condicionales mejorada */}
        {productos.length === 0 && !cargando ? ( // Usamos `productos` para el total
          <div className="text-center mt-4">
            <h4 style={{ color: "var(--color-text-primary)" }}>
              No hay productos para mostrar
            </h4>
            <p style={{ color: "var(--color-text-muted)" }}>
              ¡Comienza agregando tu primer producto!
            </p>
          </div>
        ) : productosFiltrados.length === 0 && !cargando ? ( // Y `productosFiltrados` para la búsqueda
          <div className="text-center mt-4">
            <p className="text-light">
              No se encontraron productos con ese término de búsqueda.
            </p>
          </div>
        ) : null}
        <div className="my-5">
          <Paginador
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default AdminProductos;
