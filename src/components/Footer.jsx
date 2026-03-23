import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            width: '100%',
            padding: '4rem 2rem 2rem 2rem',
            background: 'var(--bg-tertiary)',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '0'
        }}>
            <div style={{ maxWidth: '1000px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                            <path d="M 75 25 A 35 35 0 1 0 75 75" stroke="var(--accent-primary)" strokeWidth="10" strokeLinecap="round" />
                            <circle cx="50" cy="50" r="8" fill="var(--accent-primary)" />
                        </svg>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Contestra</span>
                    </div>
                    <p className="text-sm text-muted">The definitive platform for modern event and contest registrations. Scalable, secure, and beautiful.</p>
                </div>
                
                <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Platform</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><Link to="/register" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Create Account</Link></li>
                        <li><Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Host Sign In</Link></li>
                        <li><Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Participant Dashboard</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Legal & Info</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>About Us</Link></li>
                        <li><Link to="/privacy-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Privacy Policy</Link></li>
                        <li><Link to="/terms-of-service" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            
            <div style={{ width: '100%', maxWidth: '1000px', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className="text-sm text-muted">© {new Date().getFullYear()} Contestra. All rights reserved.</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border-light)' }} />
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border-light)' }} />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
