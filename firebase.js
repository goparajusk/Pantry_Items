// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBF3jlYrH0chrdcCSc9p7_-LFV8PLEE19U",
  authDomain: "inventory-management-app-cfdd7.firebaseapp.com",
  projectId: "inventory-management-app-cfdd7",
  storageBucket: "inventory-management-app-cfdd7.appspot.com",
  messagingSenderId: "336068605776",
  appId: "1:336068605776:web:23f14b6cae339ae9779e55",
  measurementId: "G-20XBDW8M4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { firestore };