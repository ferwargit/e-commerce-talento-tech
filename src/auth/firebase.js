import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const provider = new GoogleAuthProvider();
const auth = getAuth();

export async function crearUsuario(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
        // Signed in
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

/////////////////////////////////////////////////////////////////
///////////////////// BASE DE DATOS FIRESTORE  //////////////////
/////////////////////////////////////////////////////////////////

import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";

const db = getFirestore(app);

export function crearProducto(name, image, price, description) {
  return new Promise(async (res, rej) => {
    try {
      const docRef = await addDoc(collection(db, "productos"), {
        name: name,
        imagen: image,
        price: price,
        description: description,
      });

      console.log("Document written with ID: ", docRef.id);
      res(docRef);
    } catch (e) {
      console.error("Error adding document: ", e);
      rej(e);
    }
  });
}

export function obtenerProductos() {
  return new Promise(async (res, rej) => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));

      const resultados = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          image: data.image,
          price: data.price,
          description: data.description,
        };
      });

      res(resultados);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      rej(error);
    }
  });
}
