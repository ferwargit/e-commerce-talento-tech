import { createContext, useState, useEffect } from "react";

// Crear el contexto
export const CarritoContext = createContext();

// Proveedor del contexto
export function CarritoProvider({ children }) {
  // 1. INICIALIZAR EL ESTADO DESDE LOCALSTORAGE
  // Usamos una función en useState para que esta lógica se ejecute solo una vez, al cargar el componente.
  const [productosCarrito, setProductosCarrito] = useState(() => {
    try {
      // Intenta obtener el carrito guardado de localStorage.
      const productosEnLocalStorage = localStorage.getItem("carritoItems");
      // Si existe, lo parsea (porque se guarda como string). Si no, devuelve un array vacío.
      return productosEnLocalStorage ? JSON.parse(productosEnLocalStorage) : [];
    } catch (error) {
      // Si hay un error al parsear (ej: datos corruptos), devuelve un array vacío por seguridad.
      console.error("No se pudo parsear el carrito desde localStorage", error);
      return [];
    }
  });

  // 2. GUARDAR EL ESTADO EN LOCALSTORAGE CADA VEZ QUE CAMBIE
  // useEffect se ejecutará cada vez que 'productosCarrito' se modifique.
  useEffect(() => {
    // Convierte el array de productos a un string JSON y lo guarda en localStorage.
    localStorage.setItem("carritoItems", JSON.stringify(productosCarrito));
    // El console.log te ayudará a verificar que se está guardando correctamente.
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
