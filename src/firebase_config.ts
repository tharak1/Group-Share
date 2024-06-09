// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxtWyUM_1XnUbvqz05mMnAgWvppEXtWP0",
  authDomain: "newddd-c106e.firebaseapp.com",
  projectId: "newddd-c106e",
  storageBucket: "newddd-c106e.appspot.com",
  messagingSenderId: "203996033041",
  appId: "1:203996033041:web:6d6f2546c3d2bbeada41b0",
  measurementId: "G-1DGMYJ9JCR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const messaging = getMessaging(app);