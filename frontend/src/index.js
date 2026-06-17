 import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 

// HTML-ல் உள்ள 'root' என்ற ஐடியை (ID) கண்டுபிடித்து React-ஐ அதனுள் செலுத்துகிறது
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);