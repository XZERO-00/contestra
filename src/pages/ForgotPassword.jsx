import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      await resetPassword(email);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError('Failed to send reset email. Ensure the email is registered.');
    }
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>
        
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft size={16} />
          Back to login
        </Link>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="heading-md">Reset Password</h2>
          <p className="text-sm" style={{ marginTop: '0.5rem' }}>Enter your email to receive a password reset link.</p>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
             <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', marginBottom: '1.5rem' }}>
                <CheckCircle size={32} />
             </div>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Email Sent!</h3>
             <p className="text-sm">We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.</p>
             <Link to="/login" className="btn btn-secondary" style={{ marginTop: '2rem', width: '100%' }}>
               Return to Login
             </Link>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ color: 'var(--error)', backgroundColor: 'var(--error-bg)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'center', fontSize: 'var(--text-sm)' }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

              <button type="submit" className="btn btn-brand" style={{ width: '100%', marginTop: '0.5rem' }} disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
