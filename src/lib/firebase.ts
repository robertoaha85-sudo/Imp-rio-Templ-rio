import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgFDo_hkKtwMx3JFfde7420PAifr5jdW8",
  authDomain: "templario-9955c.firebaseapp.com",
  projectId: "templario-9955c",
  storageBucket: "templario-9955c.firebasestorage.app",
  messagingSenderId: "249705434472",
  appId: "1:249705434472:web:32478dc66ef0bc030f1add",
  measurementId: "G-QM7X838ZK3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
};
