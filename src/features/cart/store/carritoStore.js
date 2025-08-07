import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

export const useCarritoStore = create(
  // El middleware `persist` guardará automáticamente el estado en localStorage.
  persist(
    (set) => ({
      // --- STATE ---
      productosCarrito: [],

      // --- ACTIONS ---
      agregarAlCarrito: (producto) => { // El objeto `producto` ya viene con la propiedad `cantidad`
        set((state) => {
          let productoEncontrado = false;

          const productosActualizados = state.productosCarrito.map((p) => {
            if (p.id === producto.id) {
              productoEncontrado = true;
              const nuevaCantidad = p.cantidad + producto.cantidad;
              toast.info(`${producto.name} ahora tiene ${nuevaCantidad} unidades en el carrito.`);
              return { ...p, cantidad: nuevaCantidad };
            }
            return p;
          });

          if (productoEncontrado) {
            return { productosCarrito: productosActualizados };
          } else {
            toast.success(`${producto.name} (${producto.cantidad} ${producto.cantidad > 1 ? 'unidades' : 'unidad'}) se agregó al carrito.`);
            return { productosCarrito: [...state.productosCarrito, producto] };
          }
        });
      },

      eliminarDelCarrito: (productoId) => {
        set(state => ({
          productosCarrito: state.productosCarrito.filter(p => p.id !== productoId),
        }));
      },

      vaciarCarrito: () => set({ productosCarrito: [] }),
    }),
    {
      name: 'carrito-storage', // Nombre de la clave en localStorage
    }
  )
);