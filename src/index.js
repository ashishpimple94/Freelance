import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Logout when tab/window is closed
window.addEventListener('beforeunload', () => {
  if (sessionStorage.getItem('isLoggedIn')) {
    navigator.sendBeacon('https://freelance-ys0n.onrender.com/api/auth/logout');
    sessionStorage.removeItem('isLoggedIn');
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
