import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
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

let analytics;
if (typeof window !== 'undefined') {
  // Load and initialize Analytics only on the client side
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

const firestore = getFirestore(app);

export { firestore, analytics };
