// src/app/routes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Subscriptions from '../pages/Subscriptions.jsx';
import CartPage from '../pages/CartPage.jsx';
import About from '../pages/About.jsx'; // Added about page - JC   
import NavBar from '../components/NavBar/NavBar.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/about" element={<About />} /> {/* Added route for About page - JC */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <section className="card">
      <h2>Page not found</h2>
      <p>Try the <Link to="/">home page</Link>.</p>
    </section>
  );
}
