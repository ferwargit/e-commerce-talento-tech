/**
 * Formatea un valor numérico como una cadena de moneda en pesos argentinos (ARS).
 * @param {number} value - El valor a formatear.
 * @returns {string} El valor formateado como moneda.
 */
export const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);