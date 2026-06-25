import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQnKKbaZODEsyPvS9Pm5QnSSvmK0sCnbg",
  authDomain: "task-management-2c4a8.firebaseapp.com",
  projectId: "task-management-2c4a8",
  storageBucket: "task-management-2c4a8.firebasestorage.app",
  messagingSenderId: "118391646031",
  appId: "1:118391646031:web:cf4de25fd0d0d9c5db073a",
  measurementId: "G-95FWH4ZWPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, analytics, db, auth, googleProvider };

