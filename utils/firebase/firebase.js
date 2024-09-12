import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCe0j2DOH4e0acLp2J_6UarPNa8-5BVIy4",
  authDomain: "next-pwa-cf417.firebaseapp.com",
  projectId: "next-pwa-cf417",
  storageBucket: "next-pwa-cf417.appspot.com",
  messagingSenderId: "740196772738",
  appId: "1:740196772738:web:95428d3a98c6e5c0f67d9b",
  measurementId: "G-WYL97Z0BE6",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
