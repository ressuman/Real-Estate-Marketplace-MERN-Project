// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyCRehJO_mVdM986vvDswdyABXlT2-bYgp0",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "ressuman-mern-real-estate-hub.firebaseapp.com",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "ressuman-mern-real-estate-hub",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "ressuman-mern-real-estate-hub.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "84324736061",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:84324736061:web:1e128da14c97a16cabde54",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
