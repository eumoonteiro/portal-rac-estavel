import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBI_PS9poJyyCrGgTXaU82xNoEGCh6jFK0",
  authDomain: "portal-rac.firebaseapp.com",
  projectId: "portal-rac",
  storageBucket: "portal-rac.firebasestorage.app",
  messagingSenderId: "844052242861",
  appId: "1:844052242861:web:03aff23e67ec52c07fc124"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
