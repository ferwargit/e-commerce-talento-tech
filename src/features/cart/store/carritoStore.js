import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

export const useCarritoStore = create(
  // El middleware `persist` guardará automáticamente el estado en localStorage.
  persist(
    (set, get) => ({
      // --- STATE ---
      productosCarrito: [],

      // --- ACTIONS ---
      agregarAlCarrito: (producto) => { // El objeto `producto` ya viene con la propiedad `cantidad`
        const { productosCarrito } = get();
        const productoExistente = productosCarrito.find(p => p.id === producto.id);

        if (productoExistente) {
          // Si el producto ya existe, suma la nueva cantidad a la existente
          const productosActualizados = productosCarrito.map(p =>
            p.id === producto.id ? { ...p, cantidad: p.cantidad + producto.cantidad } : p
          );
          set({ productosCarrito: productosActualizados });
          toast.info(`Se agregaron ${producto.cantidad} unidad(es) de ${producto.name}`);
        } else {
          // Si es un producto nuevo, lo añade al carrito con su cantidad inicial
          set({ productosCarrito: [...productosCarrito, producto] });
          toast.success(`${producto.name} se agregó al carrito`);
        }
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