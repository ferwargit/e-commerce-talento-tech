// src/assets/ThemedSwal.js
import Swal from "sweetalert2";

// Usamos Swal.mixin para crear una plantilla reutilizable
const ThemedSwal = Swal.mixin({
  customClass: {
    popup: "swal2-custom-dark",
    confirmButton: "swal2-confirm-button", // Estas clases son para la estructura, la de arriba es para el tema
    cancelButton: "swal2-cancel-button",
  },
  buttonsStyling: false, // IMPORTANTE: le decimos a Swal que no aplique sus estilos por defecto a los botones
});

export default ThemedSwal;
