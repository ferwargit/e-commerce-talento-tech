import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  image: z.string().min(1, 'La URL de la imagen es requerida.'),
  price: z.coerce
    .number({ invalid_type_error: 'El precio debe ser un número.' })
    .positive('El precio debe ser un número positivo.'),
  stock: z.coerce
    .number({ invalid_type_error: 'El stock debe ser un número.' })
    .int('El stock debe ser un número entero.')
    .min(0, 'El stock no puede ser negativo.'),
  category: z.string().min(1, 'La categoría es requerida.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
});