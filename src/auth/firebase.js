import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const _app = initializeApp(firebaseConfig);
const auth = getAuth();

export async function crearUsuario(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Credenciales: ", userCredential);
    const user = userCredential.user;
    console.log("Usuario: ", user);
    return user;
  } catch (error) {
    console.log("Error al crear usuario: ", error.code, error.message);
    throw error;
  }
}

export function loginEmailPass(email, password) {
  return new Promise((res, rej) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Credenciales: ", userCredential);
        const user = userCredential.user;
        console.log("Usuario: ", user);
        res(user);
      })
      .catch((error) => {
        console.log("Error al crear usuario: ", error.code, error.message);
        rej(error);
      });
  });
}
