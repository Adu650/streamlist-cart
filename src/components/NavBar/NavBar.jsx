/*modified to add light/dark theme selection*/

import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { FiHome, FiLayers, FiInfo, FiShoppingCart } from 'react-icons/fi';
import './NavBar.css';

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersLight =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export default function NavBar() {
  const { state } = useCart();
  const count = (state?.items ?? []).reduce((n, i) => n + (i.qty ?? 0), 0);

  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const linkClass = ({ isActive }) => `pill ${isActive ? 'active' : ''}`;

  return (
    <header className="nav" role="banner">
      <div className="nav__inner">
        <Link to="/" className="brand brand--xl" aria-label="EZ Tech home">
          EZ Tech
        </Link>

        <div className="spacer" />

        <nav id="main-nav" className={`nav__links ${open ? 'open' : ''}`} aria-label="Main">
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
            <FiHome className="icon" aria-hidden="true" />
            <span>Home</span>
          </NavLink>

          <NavLink to="/subscriptions" className={linkClass} onClick={() => setOpen(false)}>
            <FiLayers className="icon" aria-hidden="true" />
            <span>Subscriptions</span>
          </NavLink>

          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
            <FiInfo className="icon" aria-hidden="true" />
            <span>About</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `pill cartLink ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <FiShoppingCart className="icon" aria-hidden="true" />
            <span>Cart</span>
            {count > 0 && <span className="badge" data-testid="cart-badge">{count}</span>}
          </NavLink>
        </nav>

        <div className="controls">
          <button
            className="themeBtn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            className="menuBtn"
            aria-label="Toggle menu"
            aria-controls="main-nav"
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <span className="menuBtn__bar" />
            <span className="menuBtn__bar" />
            <span className="menuBtn__bar" />
          </button>
        </div>
      </div>
    </header>
  );
}
