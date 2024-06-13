// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBRpWc2I3m1M7N7eotdk4ExjQNhwugpGpg",
  authDomain: "crm-webapp-8244c.firebaseapp.com",
  projectId: "crm-webapp-8244c",
  storageBucket: "crm-webapp-8244c.appspot.com",
  messagingSenderId: "440169313313",
  appId: "1:440169313313:web:18d8d02785a031caa9df60",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, GoogleAuthProvider }; 