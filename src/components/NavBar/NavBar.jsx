import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import './NavBar.css';

export default function NavBar() {
  const { state } = useCart?.() ?? { state: { items: [] } };
  const count = (state?.items ?? []).reduce((n, i) => n + (i.qty ?? 0), 0);
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) => `pill ${isActive ? 'active' : ''}`;

  return (
    <header className="nav" role="banner">
      <div className="nav__inner">
        <Link to="/" className="brand brand--xl" aria-label="EZ Tech home">
          EZ Tech
        </Link>

        <button
          className="menuBtn"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(o => !o)}
        >
          <span className="menuBtn__bar" />
          <span className="menuBtn__bar" />
          <span className="menuBtn__bar" />
        </button>

        <nav id="main-nav" className={`nav__links ${open ? 'open' : ''}`} aria-label="Main">
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/subscriptions" className={linkClass} onClick={() => setOpen(false)}>
            Subscriptions
          </NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
            About
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `pill cartLink ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
            Cart
            {count > 0 && (
              <span className="badge" data-testid="cart-badge">
                {count}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
