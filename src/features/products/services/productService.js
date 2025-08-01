// src/services/productService.js
// Este servicio maneja las operaciones CRUD para productos en Firestore.
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config"; // Importar la instancia de la base de datos

// Referencia a la colección 'products' en Firestore
const productsCollectionRef = collection(db, "products");

/**
 * Obtiene todos los productos de Firestore.
 * @returns {Promise<Array>} Una promesa que se resuelve con un array de productos.
 */
export const getProducts = async () => {
  const snapshot = await getDocs(productsCollectionRef);
  // Mapeamos los documentos para incluir el ID que Firestore maneja por separado.
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Obtiene un producto específico por su ID.
 * @param {string} id - El ID del producto a obtener.
 * @returns {Promise<Object|null>} Una promesa que se resuelve con el producto o null si no se encuentra.
 */
export const getProductById = async (id) => {
  const docRef = doc(db, "products", id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

/**
 * Crea un nuevo producto en Firestore.
 * @param {Object} productData - Los datos del producto a crear.
 * @returns {Promise<DocumentReference>} Una promesa que se resuelve con la referencia al nuevo documento.
 */
export const createProduct = async (productData) => {
  // Firestore asignará un ID automáticamente
  return addDoc(productsCollectionRef, {
    ...productData,
    createdAt: serverTimestamp(), // ¡Añade esto para la marca de tiempo del servidor!
  });
};

/**
 * Actualiza un producto existente en Firestore.
 * @param {string} id - El ID del producto a actualizar.
 * @param {Object} productData - Los nuevos datos para el producto.
 * @returns {Promise<void>}
 */
export const updateProduct = async (id, productData) => {
  const docRef = doc(db, "products", id);
  return updateDoc(docRef, {
    ...productData,
    updatedAt: serverTimestamp(), // ¡Añade esto para saber cuándo se actualizó!
  });
};

/**
 * Elimina un producto de Firestore.
 * @param {string} id - El ID del producto a eliminar.
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
  const docRef = doc(db, "products", id);
  return deleteDoc(docRef);
};
