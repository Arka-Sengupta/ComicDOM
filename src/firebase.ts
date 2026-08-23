import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBJQsFx6TvaaokQTqCr2DW1Fo3VmDCTWCk",
  authDomain: "comicdom.firebaseapp.com",
  projectId: "comicdom",
  storageBucket: "comicdom.firebasestorage.app",
  messagingSenderId: "493074905858",
  appId: "1:493074905858:web:f8037cc7d3d5729b93201b",
  measurementId: "G-R83WPX1VYC"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
