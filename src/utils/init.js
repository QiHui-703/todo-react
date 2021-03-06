// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoFwit7SPw7o4INUKaUnj3MRKEbUrsvLc",
  authDomain: "todo-b26da.firebaseapp.com",
  projectId: "todo-b26da",
  storageBucket: "todo-b26da.appspot.com",
  messagingSenderId: "789889204044",
  appId: "1:789889204044:web:ac7219475690f12b8219e9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
export const db = getFirestore(app);
export const auth = getAuth();
