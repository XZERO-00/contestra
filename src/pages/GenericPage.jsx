import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const contentMap = {
    'about': {
        title: 'About Us',
        content: (
            <>
                <h3 className="heading-md" style={{ marginBottom: '1rem', marginTop: '1rem' }}>Our Mission</h3>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    Contestra is a modern, unified platform designed to streamline the event and registration process for hosts and participants alike. Built by an elite team of developers, designers, and database architects, our mission is to eradicate the friction of legacy event management systems. 
                </p>
                <h3 className="heading-md" style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>What We Do</h3>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    We provide an incredibly fast, premium glassmorphic dashboard that empowers Organizers to create, manage, and scale events flawlessly. Simultaneously, we equip Students and Professionals with a beautiful discoverability catalogue for seamless 1-click event enrollments.
                </p>
                <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', marginTop: '3rem', borderLeft: '4px solid var(--accent-primary)' }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>Crafted with passion using React, Vite, and Firebase.</p>
                </div>
            </>
        )
    },
    'privacy-policy': {
        title: 'Privacy Policy',
        content: (
            <>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '2.5rem' }}>Last updated: November {new Date().getFullYear()}</p>
                
                <h3 className="heading-md" style={{ marginBottom: '1rem' }}>1. Information We Collect</h3>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    When you use Contestra, we securely collect information you provide directly to us through forms and registrations. This includes your name, email address, school or organization, and role preferences.
                </p>
                
                <h3 className="heading-md" style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>2. Data Security</h3>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    All personal data is encrypted and securely stored using Google Cloud Firestore backend architectures. We rely on industry-standard security measures and natively secure Firebase Authentication endpoints to protect against unauthorized access.
                </p>
                
                <h3 className="heading-md" style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>3. How We Use Your Information</h3>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    Your information is exclusively used to:
                </p>
                <ul className="text-muted" style={{ lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li>Facilitate instant event registrations and dashboard tracking.</li>
                    <li>Allow Hosts to safely verify and contact participants enrolled in their individual contests.</li>
                    <li>Improve our internal platform services and debugging.</li>
                </ul>
            </>
        )
    },
    'terms-of-service': {
        title: 'Terms of Service',
        content: (
            <>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '2.5rem' }}>Effective Date: January 1, {new Date().getFullYear()}</p>
                
                <h3 className="heading-md" style={{ marginBottom: '1rem' }}>1. Acceptance of Terms</h3>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    By accessing or using the Contestra platform, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions of this agreement, you may not access our services.
                </p>
                
                <h3 className="heading-md" style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>2. Host Responsibilities</h3>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    Users adopting the "Host" role agree to use the platform solely for organizing legitimate educational, competitive, or commercial events. Hosts are fully responsible for the validity of the events they publish and managing the data of participants ethically.
                </p>

                <h3 className="heading-md" style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>3. Participant Conduct</h3>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    Users adopting the "Participant" role agree to provide accurate, honest information upon registration. Any abuse of the registration system, spamming, or fraudulent entries may result in immediate account termination.
                </p>

                <h3 className="heading-md" style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>4. Limitation of Liability</h3>
                <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    Contestra is not liable for structural changes, cancellations, or disputes arising from individual events hosted on our unmanaged platform tier. All event-specific disputes must be handled directly between the Host and the Participant.
                </p>
            </>
        )
    }
};

const GenericPage = () => {
    const location = useLocation();
    const pagePath = location.pathname.substring(1);
    
    // Automatically jump to top of screen on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pagePath]);

    const pageData = contentMap[pagePath] || {
        title: pagePath.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        content: <p className="text-muted" style={{ padding: '2rem 0' }}>Content not available for this page route yet.</p>
    };

    return (
        <div className="page-mount-fade" style={{ 
            width: '100%', maxWidth: '800px', margin: '0 auto', padding: '6rem 2rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
            <div style={{ alignSelf: 'flex-start', marginBottom: '3rem' }}>
                <Link to="/" style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    color: 'var(--text-secondary)', textDecoration: 'none', 
                    fontWeight: 600, padding: '0.6rem 1.25rem', 
                    background: 'var(--bg-secondary)', borderRadius: '100px', 
                    border: '1px solid var(--border-light)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                }} onMouseOver={e=>e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-secondary)'}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>

            <h1 className="heading-xl text-gradient" style={{ marginBottom: '3rem' }}>
                {pageData.title}
            </h1>
            
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'left', width: '100%', borderTop: '4px solid var(--accent-primary)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                {pageData.content}
            </div>
        </div>
    );
};

export default GenericPage;
