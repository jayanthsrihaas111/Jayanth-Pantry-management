// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ-YekO-gIUK9d9GbhK5xyFSn7oiURet0",
  authDomain: "inventory-management-app-dbf2a.firebaseapp.com",
  projectId: "inventory-management-app-dbf2a",
  storageBucket: "inventory-management-app-dbf2a.appspot.com",
  messagingSenderId: "643942884582",
  appId: "1:643942884582:web:b4064fd7e307d37102c727",
  measurementId: "G-5G5WVQMMHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)
export {firestore}  // export the firestore instance