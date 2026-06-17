import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ user, onLogout, theme, setTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">🚌</span> TicketBari
        </Link>
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/tickets">All Tickets</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {!user && <NavLink to="/login">Login</NavLink>}
          {!user && <NavLink to="/register">Register</NavLink>}
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}> {theme === 'light' ? 'Dark' : 'Light'} </button>
          {user ? (
            <div className="user-menu">
              <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
              <span>{user.name}</span>
              <button className="logout-button" onClick={onLogout}>Logout</button>
            </div>
          ) : null}
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
