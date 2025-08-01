// Mapeo de códigos de error de Firebase a mensajes amigables en español.
const FIREBASE_ERROR_MESSAGES = {
  "auth/user-not-found": "El correo electrónico o la contraseña son incorrectos.",
  "auth/wrong-password": "El correo electrónico o la contraseña son incorrectos.",
  "auth/invalid-email": "El formato del correo electrónico no es válido.",
  "auth/email-already-in-use": "Este correo electrónico ya está registrado.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests":
    "Hemos bloqueado las solicitudes de este dispositivo debido a actividad inusual. Inténtalo más tarde.",
  "permission-denied":
    "No tienes permisos para realizar esta acción. Contacta al administrador.",
  // ... puedes añadir más códigos de error de Firestore, Storage, etc. aquí
};

/**
 * Procesa un error (generalmente de una promesa rechazada) y devuelve un mensaje de error estandarizado y amigable.
 * @param {any} error - El error capturado en el bloque catch.
 * @returns {string} Un mensaje de error legible para el usuario.
 */
export function getFriendlyErrorMessage(error) {
  // Mantenemos el log del error original para depuración en la consola del desarrollador.
  console.error("Error original:", error);

  if (error?.code && FIREBASE_ERROR_MESSAGES[error.code]) {
    return FIREBASE_ERROR_MESSAGES[error.code];
  }

  return "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
}