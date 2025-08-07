# Instrucciones Globales de Gemini

## Preferencias de Comunicación:
- Comunícate de manera amigable, profesional y directa
- Proporciona consejos accionables que sean directos y evita frases genéricas
- Usa español para toda la ortografía, puntuación y gramática
- Sé específico y evita respuestas vagas

## Estándares de Codificación:
- Al programar, prioriza la legibilidad y las mejores prácticas
- Siempre incluye comentarios explicativos en el código
- Utiliza nombres de variables descriptivos
- Sigue las convenciones de nomenclatura del lenguaje correspondiente

## Descripción General del Proyecto

**TechStore** es una aplicación de comercio electrónico completamente funcional desarrollada con **React 19**, que muestra las mejores prácticas en el desarrollo frontend moderno.

## Scripts Disponibles

Los siguientes scripts están disponibles en el `package.json`:

*   `npm run dev`: Inicia el servidor de desarrollo usando Vite.
*   `npm run build`: Compila la aplicación para producción.
*   `npm run lint`: Analiza el código base usando ESLint.
*   `npm run preview`: Sirve la compilación de producción localmente para previsualización.
*   `npm run test`: Ejecuta la suite de pruebas usando Vitest.

## Tecnologías y Arquitectura

-   **Framework:** **[React 19](https://react.dev/)**
-   **Herramienta de Build:** **[Vite](https://vitejs.dev/)**
-   **Enrutamiento:** **[React Router](https://reactrouter.com/)**
-   **Estilos:**
    -   **[Bootstrap 5](https://getbootstrap.com/)** para el layout y la responsividad.
    -   **[Styled Components](https://styled-components.com/)** para un sistema de diseño de componentes encapsulado y reutilizable.
    -   **Módulos CSS** para estilos específicos de componentes.
    -   **Variables CSS Globales (`:root`)** para una paleta de colores centralizada.
-   **Gestión de Formularios:**
    -   **React Hook Form**: Para un manejo de formularios performante.
    -   **Zod**: Para la validación de esquemas.
-   **Gestión de Estado:**
    -   **Estado del Servidor:** **TanStack Query (React Query)** para fetching de datos, cacheo y sincronización.
    -   **Estado del Cliente (Global):** **Zustand** para una gestión de estado global (autenticación, carrito, búsqueda).
-   **Iconografía:** **[React Icons](https://react-icons.github.io/react-icons/)**
-   **Pruebas:**
    -   **Vitest**: Framework de testing moderno.
    -   **React Testing Library**: Para escribir tests que simulan el comportamiento real del usuario.
-   **Backend y Servicios:**
    -   **[Firebase Authentication](https://firebase.google.com/docs/auth)** para la autenticación de usuarios.
    -   **[Firebase Firestore](https://firebase.google.com/docs/firestore)** como base de datos NoSQL.
    -   **[Netlify Forms](https://docs.netlify.com/forms/setup/)** para la gestión del formulario de contacto.

## Estilo de Código y Convenciones

Seguimos las reglas definidas en el archivo `eslint.config.js` para mantener un estilo de código coherente. Las convenciones clave incluyen:

*   **ESLint:** Usamos ESLint con las configuraciones recomendadas de JavaScript y React.
*   **React Hooks:** Nos adherimos a las reglas de los hooks.
*   **Variables no utilizadas:** Las variables no utilizadas se marcan como errores, excepto aquellas que comienzan con una letra mayúscula o un guion bajo (`^[A-Z_]`).

## Pruebas

Usamos Vitest y React Testing Library para las pruebas. Los tests se encuentran junto a los archivos que están probando o en un directorio `__tests__`.

Para ejecutar las pruebas, usa el siguiente comando:

```bash
npm run test
```
