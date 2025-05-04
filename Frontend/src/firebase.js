// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Already included, good
import { getStorage } from "firebase/storage"; // Added for potential image uploads

const firebaseConfig = {
    apiKey: "AIzaSyAsxwW4kHxz7-HzuVtNd3jByDTVOP4CYls",
    authDomain: "weebos-31f97.firebaseapp.com",
    projectId: "weebos-31f97",
    storageBucket: "weebos-31f97.appspot.com", // Fixed typo: .firebasestorage.app → .appspot.com
    messagingSenderId: "696360971601",
    appId: "1:696360971601:web:e7fac579d0c8ebebb6f770",
    measurementId: "G-PK50H6XGNC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); // Export storage for later use