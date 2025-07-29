// src/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebaseConfig"; // Importamos la instancia centralizada

export async function crearUsuario(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    // Es una mejor práctica que la lógica de UI (como los console.log o las alertas)
    // se maneje en el componente que llama a esta función.
    throw error;
  }
}

export async function loginEmailPass(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export function onEstadoAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function cerrarSesion() {
  return signOut(auth);
}
