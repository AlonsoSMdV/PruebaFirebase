import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, collection, getDocs,  doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc} from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { Observable, from } from 'rxjs';
const firebaseConfig = {
  apiKey: "AIzaSyAypMZSz9Vgg0DUsGw1jLbzgUS3uNs86tg",
  authDomain: "footballcomps-f5afd.firebaseapp.com",
  projectId: "footballcomps-f5afd",
  storageBucket: "footballcomps-f5afd.firebasestorage.app",
  messagingSenderId: "1036668813891",
  appId: "1:1036668813891:web:1af654984665fdaae78af6",
  measurementId: "G-FR5S50J8LC"
};

const app = initializeApp(firebaseConfig);

// Exportar servicios de Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
@Injectable({
  providedIn: 'root'
})
export class BaseFirebaseRepositoryService<T> {


  constructor() { }

  getAll(collectionName: string): Observable<T[]> {
    const colRef = collection(db, collectionName)
    return from(getDocs(colRef).then((querySnapshot) => {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    }));
  }

  getById(collectionName: string, docId:string): Observable<T | undefined>{
    const docRef = doc(db, collectionName, docId)
    return from(getDoc(docRef).then((querySnapshot) => {
      if(querySnapshot.exists()){
        return {docId: querySnapshot.id, ...querySnapshot.data() } as T
      }
      return undefined;
    }))
  }

  // Añadir un nuevo documento
  addPrueba(collectionName: string, item: any): Observable<T> {
    const colRef = collection(db, collectionName)
    return from(addDoc(colRef, item).then((docRef) => {
      console.log('Documento añadido con ID generado de manera automática')
      return {id: docRef.id, ...item} as T
    })
    );
  }

  // Actualizar un documento
  updatePrueba(collectionName: string, docId: string, item: any): Observable<T>{ 
    const docRef = doc(db, collectionName, docId)
    return from(updateDoc(docRef, item).then(() => {
      return {docId, ...item} as T
    }));
  }

  // Eliminar un documento
  deletePrueba(collectionName: string, docId: string): Observable<string> {
    const docRef = doc(db, collectionName, docId)
    return from(deleteDoc(docRef).then(() => {
      return docId
    }));
  }
}
