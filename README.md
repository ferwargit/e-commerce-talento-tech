# TechStore - E-commerce Avanzado con React

<!-- Añade aquí una captura de pantalla principal de tu proyecto -->
![Captura de Pantalla de TechStore](https://e-commerce-talento-2.netlify.app/images/products/inicio.jpg) 

**TechStore** es una aplicación web de comercio electrónico (e-commerce) completamente funcional, desarrollada desde cero con **React 19**. Este proyecto es un escaparate de las mejores prácticas en el desarrollo frontend moderno, abarcando desde una arquitectura de componentes robusta y una gestión de estado centralizada, hasta una experiencia de usuario (UX) pulida, responsiva y coherente.

La aplicación simula un entorno de venta real con un catálogo de productos dinámico, un carrito de compras persistente, y un sistema de autenticación dual que separa claramente los flujos de cliente y administrador.

### 🌐 Demo en Vivo

| Rol | Link de Acceso |
| :--- | :--- |
| 🛍️ **Cliente** | [**Acceder a la Tienda**](https://e-commerce-talento-2.netlify.app/) |
| ⚙️ **Administrador** | [**Acceder al Panel**](https://e-commerce-talento-2.netlify.app/login) |

---

## ✨ Características Principales

### Para Clientes:
-   **Navegación Intuitiva:** Catálogo de productos con **búsqueda global**, **ordenamiento alfabético** y **paginación**.
-   **Diseño "Dark Mode" Premium:** Interfaz completamente responsiva construida con **Bootstrap 5** y un sistema de diseño personalizado que garantiza una experiencia visual impecable en cualquier dispositivo.
-   **Flujo de Compra Completo:** Desde la selección de productos y la gestión de cantidad, hasta un carrito de compras persistente que simula costos de envío dinámicos.
-   **Autenticación Segura:** Registro e inicio de sesión de usuarios a través de **Firebase Authentication**.
-   **Redirección Contextual:** La aplicación recuerda la página a la que el usuario intentaba acceder antes de iniciar sesión (ej. `/carrito`) y lo redirige allí después de una autenticación exitosa.

### Para Administradores:
-   **Panel de Administración Protegido:** Acceso a través de la ruta de **Login** unificada (`/login`) que, con credenciales de administrador, redirige a una interfaz de gestión exclusiva y protegida.
-   **Gestión de Productos (CRUD):** Funcionalidad completa para Crear, Leer, Actualizar y Eliminar productos.
-   **Tabla de Datos Inteligente:**
    -   Vista de tabla enriquecida con **imágenes, categoría y stock** para una gestión rápida.
    -   Totalmente responsiva, transformándose de una tabla de datos a una lista de tarjetas en móviles.
    -   Funcionalidad de **búsqueda por nombre o categoría** y paginación integrada.

### Características Técnicas y de UX:
-   **Sistema de Notificaciones Unificado:**
    -   Uso de **SweetAlert2** para modales de confirmación críticos (ej. "¿Eliminar producto?").
    -   Uso de **React-Toastify** para notificaciones pasivas ("toast") de éxito o error.
    -   Ambas librerías están tematizadas para integrarse perfectamente con el diseño "dark mode".
-   **Carga Optimizada (Code Splitting):** Implementación de `React.lazy` y `Suspense` para dividir el código por rutas, asegurando que los usuarios solo descarguen el código necesario para la vista actual, resultando en tiempos de carga iniciales drásticamente reducidos.
-   **Arquitectura Escalable y Probada:** Estructura de carpetas organizada por **"features"** que facilita el mantenimiento. Suite de **tests unitarios y de integración** con Vitest y React Testing Library que garantiza la fiabilidad del código.
-   **Microinteracciones y Efectos Visuales:** Efectos de `:hover` en las tarjetas de producto que incluyen elevación, un resplandor de marca y un sutil zoom en la imagen para mejorar el feedback visual.
-   **Optimización SEO:** Metadatos (`<title>`, `<meta name="description">`) dinámicos para cada página, renderizados de forma nativa con React 19.
-   **Seguridad de Claves:** Todas las claves de API y secretos están correctamente gestionados a través de variables de entorno (`.env`), y el historial de Git ha sido limpiado para eliminar cualquier exposición accidental.
-   **Validación de Entorno Segura:** Uso de **Zod** para validar las variables de entorno (`.env`) al iniciar la aplicación, previniendo errores de configuración en tiempo de ejecución.

---

## 🛠️ Tecnologías y Arquitectura

-   **Framework:** **[React 19](https://react.dev/)**
-   **Herramienta de Build:** **[Vite](https://vitejs.dev/)**
-   **Routing:** **[React Router](https://reactrouter.com/)**
-   **Estilos:**
    -   **[Bootstrap 5](https://getbootstrap.com/)** para el layout y la responsividad.
    -   **[Styled Components](https://styled-components.com/)** para un sistema de diseño de componentes encapsulado y reutilizable (`Button`, `StyledInput`, etc.).
    -   **Módulos CSS** para estilos específicos de componentes (`AdminTable.module.css`).
    -   **Variables CSS Globales (`:root`)** para una paleta de colores centralizada y mantenible.
-   **Gestión de Formularios:**
    -   **React Hook Form**: Para un manejo de formularios performante, desacoplado y con control preciso sobre los re-renders.
    -   **Zod**: Para la validación de esquemas tanto en formularios (login, creación/edición de productos) como en variables de entorno, garantizando la integridad de los datos.   
-   **Gestión de Estado:**
    -   **Estado del Servidor:** **TanStack Query (React Query)** para un fetching de datos, cacheo y sincronización de estado asíncrono declarativo y eficiente.
    -   **Estado del Cliente (Global):**
        -   **Zustand**: Para estados que cambian con alta frecuencia (carrito de compras, término de búsqueda), previniendo re-renders innecesarios y optimizando el rendimiento. Incluye middleware `persist` para el carrito.
        -   **React Context API**: Para estado de bajo cambio como la autenticación de usuario (`useAuthContext`), manteniendo un enfoque simple y nativo de React donde es apropiado.
-   **Iconografía:** **[React Icons](https://react-icons.github.io/react-icons/)**
-   **Testing:**
    -   **Vitest**: Un framework de testing moderno y ultrarrápido integrado con Vite.
    -   **React Testing Library**: Para escribir tests que simulan el comportamiento real del usuario.
    -   **Mocking de Servicios:** Mocks a nivel de capa de servicio (`productService`) para aislar los componentes de la lógica de fetching, permitiendo tests de UI puros y fiables.
-   **Backend & Servicios:**
    -   **[Firebase Authentication](https://firebase.google.com/docs/auth)** para la autenticación de usuarios.
    -   **[Firebase Firestore](https://firebase.google.com/docs/firestore)** como base de datos NoSQL para el CRUD de productos.
    -   **[Netlify Forms](https://docs.netlify.com/forms/setup/)** para la gestión segura y sin servidor del formulario de contacto.

---

## 🚀 Cómo Empezar Localmente

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/e-commerce-talento-tech.git
    cd e-commerce-talento-tech
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

3.  **Crear el Archivo de Variables de Entorno:**
    -   En la raíz del proyecto, crea un archivo `.env`.
    -   Añade las claves de tu proyecto de Firebase con el prefijo `VITE_`, por ejemplo:
        ```env
        VITE_FIREBASE_API_KEY="TU_API_KEY"
        VITE_FIREBASE_AUTH_DOMAIN="TU_AUTH_DOMAIN"
        # ... y así sucesivamente para todas las claves.
        ```

4.  **Iniciar el Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

5.  **Ejecutar los Tests:**
    ```bash
    npm run test
    ```
    Esto iniciará Vitest en modo "watch" para validar la integridad de los componentes.

---

## 🔑 Credenciales de Acceso

-   **Cliente:** Puedes registrar una nueva cuenta en la sección "Registrarse".
-   **Administrador:**
    -   Navega a la ruta de **Login** (`/login`).
    -   **Email:** `admin@admin.com`
    -   **Contraseña:** `123456`

---

## ✍️ Autor

-   **[Fernando Warno](https://github.com/ferwargit/)** - GitHub