import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCSkDu17AzhIv0UgMahWiciNx9Dx8l1FFE",
  authDomain: "prueba-auth-5dde1.firebaseapp.com",
  projectId: "prueba-auth-5dde1",
  storageBucket: "prueba-auth-5dde1.firebasestorage.app",
  messagingSenderId: "329793553534",
  appId: "1:329793553534:web:f8f2efd61a0c5b75bec42f",
  measurementId: "G-ZV617Y9KDH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const provider = new GoogleAuthProvider();
const auth = getAuth();

export function crearUsuario(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      console.log("Credenciales: ", userCredential);
      const user = userCredential.user;
      console.log("Usuario: ", user);
      // ...
    })
    .catch((error) => {
      console.log("Error al crear usuario: ", error.code, error.message);
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
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
        const errorCode = error.code;
        const errorMessage = error.message;
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
