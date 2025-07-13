// src/assets/SweetAlert.js

// ANTES: import Swal from "sweetalert2";
// AHORA: Importamos nuestra versión "tematizada" desde el archivo que creamos antes.
import ThemedSwal from "./ThemedSwal";

export function dispararSweetBasico(titulo, text, icon, textoBoton) {
  // ANTES: Swal.fire({ ... });
  // AHORA: Usamos ThemedSwal, que ya tiene nuestro tema oscuro incorporado.
  ThemedSwal.fire({
    title: titulo || "¡Éxito!",
    text: text || "",
    icon: icon || "success",
    confirmButtonText: textoBoton || "Aceptar",
  });
}
