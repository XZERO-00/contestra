import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <svg width="24" height="24" viewBox="0 0 110 96" fill="none">
                        <circle cx="55" cy="48" r="8" fill="var(--accent)" />
                        <line x1="55" y1="8" x2="55" y2="40" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
                        <line x1="55" y1="56" x2="55" y2="88" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
                        <line x1="14" y1="48" x2="47" y2="48" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
                        <line x1="63" y1="48" x2="96" y2="48" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>ContestHub</span>
                </div>

                {/* Quick links */}
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/register" className="nav-link" style={{ fontSize: '0.875rem' }}>Register</Link>
                    <Link to="/login" className="nav-link" style={{ fontSize: '0.875rem' }}>Sign In</Link>
                </div>

                {/* Copyright */}
                <p className="text-sm text-muted" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', width: '100%', textAlign: 'center' }}>
                    © {new Date().getFullYear()} ContestHub. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
