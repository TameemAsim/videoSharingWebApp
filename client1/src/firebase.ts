import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

interface Firebase {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string
}

const firebaseConfig: Firebase = {
    apiKey: "AIzaSyDQU6Y1VvE7PsA1NjJgAsdtHN_DhEIfGkc",
    authDomain: "tam-tube-9cf9d.firebaseapp.com",
    projectId: "tam-tube-9cf9d",
    storageBucket: "tam-tube-9cf9d.appspot.com",
    messagingSenderId: "464209159634",
    appId: "1:464209159634:web:39cccd28b81df72cdfd40b",
    measurementId: "G-RLBM8LQJVX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

