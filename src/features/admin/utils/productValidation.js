// src/features/admin/utils/productValidation.js

export const validarFormularioProducto = (producto) => {
  if (!producto || !producto.name || !producto.name.trim())
    return "El nombre es obligatorio.";
  if (!producto.price || producto.price <= 0)
    return "El precio debe ser un número positivo.";
  if (producto.stock === "" || producto.stock < 0)
    return "El stock debe ser un número positivo o cero.";
  if (!producto.category || !producto.category.trim())
    return "La categoría es obligatoria.";
  if (
    !producto.description ||
    !producto.description.trim() ||
    producto.description.length < 10
  )
    return "La descripción debe tener al menos 10 caracteres.";
  if (!producto.image || !producto.image.trim())
    return "La URL de la imagen no debe estar vacía.";
  return true;
};
