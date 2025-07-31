// src/context/ProductosContext.jsx
// Este contexto maneja el estado y las operaciones relacionadas con los productos.
import { createContext, useState, useContext, useCallback } from "react";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/productService";

const ProductosContext = createContext();

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [productoEncontrado, setProductoEncontrado] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // Las funciones ahora son mucho más limpias, simplemente llaman al servicio
  // y actualizan el estado cuando es necesario.

  const obtenerProductos = useCallback(async () => {
    const datos = await getProducts();
    setProductos(datos);
    return datos;
  }, []);

  const agregarProducto = useCallback(async (producto) => {
    return createProduct(producto);
  }, []);

  const obtenerProducto = useCallback(async (id) => {
    const producto = await getProductById(id);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    setProductoEncontrado(producto);
    return producto;
  }, []);

  const editarProducto = useCallback(async (producto) => {
    // El servicio de actualización espera el id y los datos por separado.
    const { id, ...data } = producto;
    return updateProduct(id, data);
  }, []);

  const eliminarProducto = useCallback(async (id) => {
    // Primero, eliminamos el producto en Firebase
    await deleteProduct(id);
    // Después, actualizamos el estado local para reflejar el cambio al instante.
    setProductos((productosAnteriores) =>
      productosAnteriores.filter((p) => p.id !== id)
    );
  }, []);

  return (
    <ProductosContext.Provider
      value={{
        obtenerProductos,
        productos,
        agregarProducto,
        obtenerProducto,
        productoEncontrado,
        editarProducto,
        eliminarProducto,
        terminoBusqueda,
        setTerminoBusqueda,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
}

export const useProductosContext = () => useContext(ProductosContext);
