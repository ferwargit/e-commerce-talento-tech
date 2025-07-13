
---

# TechStore - E-commerce Moderno con React

 <!-- Reemplaza esta URL con una captura de pantalla actualizada de tu proyecto -->

**TechStore** es una aplicación web de comercio electrónico (e-commerce) completamente funcional y responsiva, desarrollada desde cero con **React 19**. Este proyecto no solo demuestra la creación de una tienda online, sino que también sirve como un caso de estudio en la implementación de las mejores prácticas de desarrollo frontend, desde la gestión de estado y la arquitectura de componentes hasta el diseño de una experiencia de usuario (UX) pulida y coherente.

La aplicación cuenta con un catálogo de productos dinámico, un carrito de compras persistente, un sistema de autenticación dual (clientes y administradores) con rutas protegidas, y un completo panel de administración para la gestión de productos (CRUD).

**[Ver Demo en Vivo](https://e-commerce-10.netlify.app/)** <!-- Reemplaza con el enlace a tu deploy en Netlify -->

## ✨ Características Principales

-   **Catálogo de Productos Dinámico:** Carga y muestra productos desde una API externa (`mockAPI`), con funcionalidades de **búsqueda global**, **ordenamiento alfabético** y **paginación**.
-   **Diseño "Dark Mode" Sofisticado y Responsivo:** Interfaz completamente adaptable a cualquier dispositivo, construida con **Bootstrap 5** y un sistema de diseño personalizado con variables CSS para una consistencia visual impecable.
-   **Carrito de Compras Persistente:** Los productos añadidos al carrito se conservan entre sesiones de navegación gracias al uso de `localStorage`, mejorando la retención de usuarios.
-   **Panel de Administración Completo y Protegido:**
    -   Ruta de acceso exclusiva y protegida (`/admin`).
    -   Funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar) para la gestión de productos.
    -   Tabla de productos responsiva que se transforma en tarjetas en la vista móvil.
-   **Sistema de Autenticación y Roles:**
    -   Registro e inicio de sesión de clientes utilizando **Firebase Authentication**.
    -   Rol de Administrador con credenciales separadas, permisos especiales y una interfaz de navegación adaptada a su rol.
-   **Experiencia de Usuario (UX) Pulida:**
    -   **Optimización SEO:** Metadatos (`<title>`, `<meta name="description">`) dinámicos para cada página, renderizados de forma nativa con React 19.
    -   **Notificaciones Interactivas:** Uso de **SweetAlert2** para confirmaciones críticas (ej. eliminar producto) y **React-Toastify** para notificaciones pasivas (ej. producto agregado), ambas tematizadas para coincidir con el diseño.
    -   **Microinteracciones y Efectos Visuales:** Efectos de `hover` en las tarjetas de producto (elevación, resplandor de marca y zoom de imagen) que mejoran el feedback visual y la sensación de calidad.
-   **Arquitectura de Componentes Profesional:**
    -   Fuerte separación de incumbencias utilizando componentes reutilizables como `Button`, `Paginador`, y `StyledFormElements`.
    -   Uso de **Styled Components** para crear un sistema de diseño encapsulado y mantenible.

## 🛠️ Tecnologías y Librerías Utilizadas

### Frontend
-   **[React 19](https://react.dev/):** Utilizando las últimas características, incluyendo el renderizado nativo de metadatos.
-   **[Vite](https://vitejs.dev/):** Herramienta de construcción moderna y ultrarrápida.
-   **[React Router](https://reactrouter.com/):** Para la gestión de rutas del lado del cliente en esta Single Page Application (SPA).
-   **[Bootstrap 5](https://getbootstrap.com/):** Para el sistema de rejilla (Grid), responsividad y componentes base de la UI.
-   **[Styled Components](https://styled-components.com/):** Para crear componentes estilizados, reutilizables y con lógica de variantes.
-   **Context API & Hooks (`useState`, `useEffect`, `useContext`, `useCallback`):** Para una gestión de estado global (productos, carrito, autenticación) eficiente y optimizada.
-   **[React Icons](https://react-icons.github.io/react-icons/):** Para una iconografía clara y consistente en toda la aplicación.
-   **[SweetAlert2](https://sweetalert2.github.io/):** Para modales de confirmación interactivos y tematizados.
-   **[React-Toastify](https://fkhadra.github.io/react-toastify/introduction):** Para notificaciones "toast" no intrusivas y personalizadas.

### Backend & Servicios
-   **[Firebase Authentication](https://firebase.google.com/docs/auth):** Para la gestión de registro e inicio de sesión de usuarios.
-   **[MockAPI](https://mockapi.io/):** Utilizado como un backend simulado para el CRUD de productos.

## 🚀 Cómo Empezar

Para ejecutar este proyecto de forma local, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura el archivo de redirección para despliegue (Netlify):**
    Asegúrate de que el archivo `_redirects` exista dentro de la carpeta `/public` con el siguiente contenido para manejar las rutas de la SPA:
    ```
    /*    /index.html    200
    ```

4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```    La aplicación estará disponible en `http://localhost:5173`.

## 🔑 Credenciales de Acceso

-   **Cliente:** Puedes registrar un nuevo usuario en la sección de "Registrarse" en la página de Login.
-   **Administrador:**
    -   Navega directamente a la ruta: `/admin/login`
    -   **Usuario:** `admin`
    -   **Contraseña:** `1234`

## ✍️ Autor

-   **[Tu Nombre](https://github.com/tu-usuario)** - ¡Conecta conmigo!

---

