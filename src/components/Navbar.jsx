import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Crown } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.875rem 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 0.8} onMouseOut={e => e.currentTarget.style.opacity = 1}>
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
              <path d="M 75 25 A 35 35 0 1 0 75 75" stroke="var(--accent-primary)" strokeWidth="10" strokeLinecap="round" />
              <circle cx="50" cy="50" r="8" fill="var(--accent-primary)" />
          </svg>
          <span className="heading-md" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Contestra
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-secondary">Sign in</Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              
              <Link to={user.role === 'Host' ? '/host' : '/participant'} 
                 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 500 }}
                 onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'} >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <div style={{ width: '1px', height: '20px', background: 'var(--border-light)' }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="text-sm">
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                </span>
                
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }} title="Logout">
                  <LogOut size={16} color="var(--text-secondary)" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
