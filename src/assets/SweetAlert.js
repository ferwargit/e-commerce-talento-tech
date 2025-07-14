import ThemedSwal from "./ThemedSwal";

export function dispararSweetBasico(titulo, text, icon, textoBoton) {
  ThemedSwal.fire({
    title: titulo || "¡Éxito!",
    text: text || "",
    icon: icon || "success",
    confirmButtonText: textoBoton || "Aceptar",
  });
}
