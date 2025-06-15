import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";  // Added storage import

const firebaseConfig = {
  apiKey: "AIzaSyDGkIXR_h1Xkhf3hGgETUA36OIGiPKyC-w",
  authDomain: "mindtrack-b73d0.firebaseapp.com",
  databaseURL: "https://mindtrack-b73d0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mindtrack-b73d0",
  storageBucket: "mindtrack-b73d0.appspot.com",  // This line already exists
  messagingSenderId: "219430898513",
  appId: "1:219430898513:web:0b780d4eaf7a4ed119a170"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);  // Added storage export