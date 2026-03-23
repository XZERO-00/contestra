import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const loggedInUser = await login(email, password);
      setTimeout(() => {
        if (loggedInUser?.email === import.meta.env.VITE_ADMIN_EMAIL || loggedInUser?.role === 'Admin') navigate('/admin');
        else if (loggedInUser?.role === 'Host') navigate('/host');
        else navigate('/participant');
      }, 300);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-mount-fade container" style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="heading-md">Sign back in</h2>
          <p className="text-sm" style={{ marginTop: '0.25rem' }}>Welcome back to ContestHub</p>
        </div>

        {error && (
          <div style={{ 
            color: 'var(--error)', 
            backgroundColor: 'var(--error-bg)', 
            padding: '0.875rem', 
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: 'var(--text-sm)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="input-field" 
                placeholder="you@example.com"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
            <Link to="/forgot-password" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-brand" style={{ width: '100%', marginTop: '1rem' }}>
            Continue
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--text-primary)', fontWeight: '500', marginLeft: '0.25rem' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
