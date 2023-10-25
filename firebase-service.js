// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import * as admin from 'firebase-admin';
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFYi4bhrjVP1SFv7feBKmxyPE1X1wpXZ4",
  authDomain: "api-auth-5eba3.firebaseapp.com",
  projectId: "api-auth-5eba3",
  storageBucket: "api-auth-5eba3.appspot.com",
  messagingSenderId: "601937009201",
  appId: "1:601937009201:web:76141a37cce056331b5310"
};

// Initialize Firebase
admin.initializeApp(firebaseConfig);

export const auth = firebase.auth

export default admin