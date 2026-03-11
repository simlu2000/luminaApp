import { initializeApp } from 'firebase/app';
import { getGenerativeModel } from 'firebase/ai';

export const firebaseConfig = {
  apiKey: "AIzaSyASGF8Y77s6exLjy9Uja-xUpyOmqkJCnDA",
  authDomain: "luminaapp-5db27.firebaseapp.com",
  projectId: "luminaapp-5db27",
  storageBucket: "luminaapp-5db27.firebasestorage.app",
  messagingSenderId: "826296394073",
  appId: "1:826296394073:web:431eb9048af5a9c6e8ac48",
  measurementId: "G-9S26WYH7JV"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza il servizio Gemini
const model = getGenerativeModel(app, { model: 'gemini-pro' }); 

export { app, model };