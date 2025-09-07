/* Creating a light/dark theme toggle -- JC */

// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// set theme on <html> before React mounts
(function () {
  try {
    const saved = localStorage.getItem('theme');
    const prefersLight =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme =
      saved === 'light' || saved === 'dark'
        ? saved
        : prefersLight
        ? 'light'
        : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();

// load tokens first, then global styles
import './styles/tokens.css';
import './styles/globals.css';

import AppRoutes from './app/routes.jsx';
import { CartProvider } from './context/CartContext.jsx';

const rootEl = document.getElementById('root');
const root = createRoot(rootEl);

root.render(
  <React.StrictMode>
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  </React.StrictMode>
);
