// src/features/admin/components/AdminProductos.jsx
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "../../products/services/productService";
import { StyledLinkButton, StyledButton } from "../../../components/ui/Button";
import SEO from "../../../components/ui/SEO";
import { toast } from "react-toastify";
import styles from "./AdminTable.module.css";
import ThemedSwal from "../../../assets/ThemedSwal";
import Paginador from "../../../components/ui/Paginador";

function AdminProductos({ terminoBusqueda }) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const { data: productos = [], isLoading: cargando, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [terminoBusqueda]);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
        toast.promise(deleteMutation.mutateAsync(id), {
          pending: "Eliminando producto...",
          success: "Producto eliminado con éxito 👌",
          error: "Error al eliminar el producto 🤯",
        });
      }
    });
  };

  const productosFiltradosYOrdenados = productos
    .filter(
      (p) =>
        p.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        (p.category && // Verificamos que la categoría exista para evitar errores
          p.category.toLowerCase().includes(terminoBusqueda.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productosFiltradosYOrdenados.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(
    productosFiltradosYOrdenados.length / productsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (cargando) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">
            Cargando gestión de productos...
          </span>
        </div>
        <p className="mt-2 text-light">Cargando gestión de productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center my-5 text-danger">
        <h4>Error al cargar los productos</h4>
        <p>{error.message}</p>
      </div>
    );
  }
  const formatPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

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
        {productos.length === 0 && !cargando ? (
          <div className="text-center mt-4">
            <h4 style={{ color: "var(--color-text-primary)" }}>
              No hay productos para mostrar
            </h4>
            <p style={{ color: "var(--color-text-muted)" }}>
              ¡Comienza agregando tu primer producto!
            </p>
          </div>
        ) : productosFiltradosYOrdenados.length === 0 && !cargando ? (
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
