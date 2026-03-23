import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        {/* Logo */}
        <Link to="/" className="nav-logo">
          <svg width="32" height="28" viewBox="0 0 110 96" fill="none">
            {/* Hub spokes */}
            <circle cx="55" cy="48" r="9" fill="var(--accent)" />
            <line x1="55" y1="6" x2="55" y2="39" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
            <line x1="55" y1="57" x2="55" y2="90" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
            <line x1="13" y1="48" x2="46" y2="48" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
            <line x1="64" y1="48" x2="97" y2="48" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
            <line x1="25" y1="18" x2="44" y2="38" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
            <line x1="66" y1="58" x2="85" y2="78" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
            <line x1="85" y1="18" x2="66" y2="38" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
            <line x1="44" y1="58" x2="25" y2="78" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
          </svg>
          ContestHub
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          ) : (
            <>
              <Link
                to={user?.role === 'Host' ? '/host' : '/participant'}
                className="nav-link"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Sign Out">
                <LogOut size={15} /> Sign Out
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Mobile Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="mobile-controls">
          <button className="theme-toggle" onClick={toggleTheme} style={{ display: 'none' }}>
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} color="var(--text-primary)" /> : <Menu size={22} color="var(--text-primary)" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
          </>
        ) : (
          <>
            <Link
              to={user?.role === 'Host' ? '/host' : '/participant'}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <LogOut size={15} /> Sign Out
            </button>
          </>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
