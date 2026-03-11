import { initializeApp } from 'firebase/app';
import { getAI,getGenerativeModel } from 'firebase/ai';

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, 
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

const aiService = getAI(app);

// Inizializza il servizio Gemini
const model = getGenerativeModel(aiService, { model: 'gemini-pro' }); 
export { app, model };