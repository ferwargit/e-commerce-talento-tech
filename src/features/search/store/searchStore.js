import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  terminoBusqueda: '',
  setTerminoBusqueda: (termino) => set({ terminoBusqueda: termino }),
}));