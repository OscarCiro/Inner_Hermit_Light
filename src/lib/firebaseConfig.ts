// src/lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics"; // Removido ya que no se usa actualmente

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQVCC5B0hCgwVPND1cuRQeQPGKhWNJHPM", // Asegúrate de que esta sea tu API Key real
  authDomain: "inner-hermit-light.firebaseapp.com",
  // databaseURL: "https://inner-hermit-light-default-rtdb.firebaseio.com", // No es necesario para Firestore
  projectId: "inner-hermit-light",
  storageBucket: "inner-hermit-light.firebasestorage.app",
  messagingSenderId: "291865552757",
  appId: "1:291865552757:web:7b665005104e8a35d3153c",
  // measurementId: "G-KV9PN24Z3Q" // Removido ya que getAnalytics no se usa actualmente
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app); // Removido

export { db, auth };
