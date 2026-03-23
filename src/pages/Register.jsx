import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Building } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Participant',
    organization: ''
  });
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Password Validation: At least 8 characters, 1 letter, 1 number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
        setError('Password must be at least 8 characters long and contain both letters and numbers.');
        return;
    }

    if (formData.role === 'Host' && !formData.organization.trim()) {
       setError('Organization name is required for Hosts.');
       return;
    }

    setIsVerifying(true);
    try {
      await register(formData);
      setTimeout(() => {
        if (formData.role === 'Admin') navigate('/admin');
        else if (formData.role === 'Host') navigate('/host');
        else navigate('/participant');
      }, 300);
    } catch (err) {
      setError(err.message);
      setIsVerifying(false);
    }
  };

  return (
    <div className="page-mount-fade container" style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="heading-md">Create an account</h2>
          <p className="text-sm" style={{ marginTop: '0.25rem' }}>
            Start your journey with ContestHub
          </p>
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

        {/* Role Selection Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--bg-tertiary)', padding: '0.375rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'Participant'})}
                style={{ 
                    flex: 1, 
                    padding: '0.5rem', 
                    borderRadius: 'var(--radius-sm)',
                    background: formData.role === 'Participant' ? 'var(--bg-hover)' : 'transparent',
                    color: formData.role === 'Participant' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: formData.role === 'Participant' ? '500' : '400',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s',
                    boxShadow: formData.role === 'Participant' ? 'var(--shadow-sm)' : 'none'
                }}
            >
                Participant
            </button>
            <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'Host'})}
                style={{ 
                    flex: 1, 
                    padding: '0.5rem', 
                    borderRadius: 'var(--radius-sm)',
                    background: formData.role === 'Host' ? 'var(--bg-hover)' : 'transparent',
                    color: formData.role === 'Host' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: formData.role === 'Host' ? '500' : '400',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s',
                    boxShadow: formData.role === 'Host' ? 'var(--shadow-sm)' : 'none'
                }}
            >
                Host
            </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                name="name"
                className="input-field" 
                placeholder="John Doe"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                name="email"
                className="input-field" 
                placeholder="you@example.com"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {(formData.role === 'Host' || formData.role === 'Participant') && (
             <div className="input-group">
               <label className="input-label">{formData.role === 'Host' ? 'Organization Name' : 'School / College (Optional)'}</label>
               <div style={{ position: 'relative' }}>
                 <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                 <input 
                   type="text" 
                   name="organization"
                   className="input-field" 
                   placeholder={formData.role === 'Host' ? "Contest University" : "Your College or School Name"}
                   style={{ paddingLeft: '2.5rem' }}
                   value={formData.organization}
                   onChange={handleChange}
                   required={formData.role === 'Host'}
                 />
               </div>
             </div>
          )}

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                name="password"
                className="input-field" 
                placeholder="••••••••"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-brand" style={{ width: '100%', marginTop: '1rem' }} disabled={isVerifying}>
            {isVerifying ? 'Creating Account...' : 'Continue'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: '500', marginLeft: '0.25rem' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
