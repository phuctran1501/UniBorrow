import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxgH-7O52ala96bOKC8CHDl6QsSBYy8Hc",
  authDomain: "UniBorrow-bceb4.firebaseapp.com",
  projectId: "UniBorrow-bceb4",
  storageBucket: "UniBorrow-bceb4.firebasestorage.app",
  messagingSenderId: "1023243913057",
  appId: "1:1023243913057:web:8e082af9211928e1bd6720",
  measurementId: "G-1J4V2EZP9C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
