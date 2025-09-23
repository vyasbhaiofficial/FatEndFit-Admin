import { initializeApp } from "firebase/app";
import { getFirestore, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with your real API key
  authDomain: "fatendfit-5c8f3.firebaseapp.com",
  projectId: "fatendfit-5c8f3",
  storageBucket: "fatendfit-5c8f3.appspot.com",
  messagingSenderId: "404949686772",
  appId: "404949686772:android:6b67d42ee7da443bd381a1",
};

let app;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Enable network for better connection handling
  enableNetwork(db).catch(console.warn);
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Create fallback objects
  db = null;
  storage = null;
}

export { db, storage };
export default app;

// For development, you can use the emulator (commented out for now)
// if (process.env.NODE_ENV === 'development') {
//   try {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//   } catch (error) {
//     // Emulator already connected
//   }
// }