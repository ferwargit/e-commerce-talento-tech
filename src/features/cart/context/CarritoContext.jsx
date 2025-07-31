import { createContext, useState, useEffect, useContext } from "react";

// Crear el contexto
export const CarritoContext = createContext();

// Proveedor del contexto
export function CarritoProvider({ children }) {
  const [productosCarrito, setProductosCarrito] = useState(() => {
    try {
      const productosEnLocalStorage = localStorage.getItem("carritoItems");
      return productosEnLocalStorage ? JSON.parse(productosEnLocalStorage) : [];
    } catch (error) {
      console.error("No se pudo parsear el carrito desde localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carritoItems", JSON.stringify(productosCarrito));
    console.log("Carrito guardado en localStorage:", productosCarrito);
  }, [productosCarrito]);

  const agregarAlCarrito = (producto) => {
    const existe = productosCarrito.find((p) => p.id === producto.id);
    if (existe) {
      const carritoActualizado = productosCarrito.map((p) => {
        if (p.id === producto.id) {
          return { ...p, cantidad: p.cantidad + producto.cantidad };
        }
        return p;
      });
      setProductosCarrito(carritoActualizado);
    } else {
      const nuevoCarrito = [...productosCarrito, producto];
      setProductosCarrito(nuevoCarrito);
    }
  };

  const vaciarCarrito = () => {
    setProductosCarrito([]);
  };

  function borrarProductoCarrito(id) {
    const nuevoCarrito = productosCarrito.filter((p) => p.id !== id);
    setProductosCarrito(nuevoCarrito);
  }

  return (
    <CarritoContext.Provider
      value={{
        productosCarrito,
        agregarAlCarrito,
        vaciarCarrito,
        borrarProductoCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

/**
 * Hook personalizado para acceder al contexto del carrito.
 * Simplifica el uso del contexto y añade una capa de validación.
 */
export const useCarritoContext = () => {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error("useCarritoContext debe ser usado dentro de un CarritoProvider");
  }
  return context;
};
