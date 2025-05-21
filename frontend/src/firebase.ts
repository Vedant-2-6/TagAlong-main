// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Auth, getAuth } from "firebase/auth"; // Add this line

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaAMEOLJ2wdhliMjInryfcBa9JeJKY9s8",
  authDomain: "tagalong-6f3fe.firebaseapp.com",
  projectId: "tagalong-6f3fe",
  storageBucket: "tagalong-6f3fe.firebasestorage.app",
  messagingSenderId: "49400041603",
  appId: "1:49400041603:web:c350774a635987877acbb6",
  measurementId: "G-H4429CSBZ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth: Auth = getAuth(app); // ✅ Explicitly typed

export { auth }; // Export auth