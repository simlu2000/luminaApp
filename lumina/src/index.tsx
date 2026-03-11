import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Registrazione Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = '/serviceWorker.js';
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('SW registrato con successo: ', registration.scope);
      })
      .catch((error) => {
        console.log('Registrazione SW fallita: ', error);
      });
  });
}