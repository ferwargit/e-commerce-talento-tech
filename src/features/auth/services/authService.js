// src/features/auth/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config"; // Importamos la instancia centralizada

export async function crearUsuario(email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  return user;
}

export async function loginEmailPass(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

export function onEstadoAuth(callback) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      // Creamos nuestro propio objeto de usuario, agnóstico del backend.
      // El resto de la app solo conocerá este formato.
      const user = {
        email: firebaseUser.email,
        uid: firebaseUser.uid,
      };
      callback(user);
    } else {
      callback(null);
    }
  });
}

export function cerrarSesion() {
  return signOut(auth);
}
