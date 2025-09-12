import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyXXXXXX-XXXXXX_XXXXXX", 
  authDomain: "fatendfit-5c8f3.firebaseapp.com",
  projectId: "fatendfit-5c8f3",
  storageBucket: "fatendfit-5c8f3.appspot.com",
  messagingSenderId: "404949686772",
  appId: "404949686772:android:6b67d42ee7da443bd381a1",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);