import { useAuthStore } from "@/features/auth/store/authStore";

/**
 * Un componente "Guardia" que renderiza su contenido (`children`) solo si
 * el usuario actual cumple con uno de los roles permitidos.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - El contenido a renderizar si el rol es válido.
 * @param {string[]} props.allowedRoles - Un array de roles permitidos (ej. ['admin', 'client']).
 * @param {React.ReactNode} [props.fallback=null] - Contenido opcional a renderizar si el rol no es válido.
 */
function RoleBasedGuard({ children, allowedRoles, fallback = null }) {
  const admin = useAuthStore((state) => state.admin);
  const user = useAuthStore((state) => state.user);

  const currentRole = admin ? 'admin' : (user ? 'client' : 'guest');

  const isAllowed = allowedRoles.includes(currentRole);

  return isAllowed ? <>{children}</> : fallback;
}

export default RoleBasedGuard;