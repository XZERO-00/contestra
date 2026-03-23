import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import HostDashboard from './pages/HostDashboard';
import ParticipantDashboard from './pages/ParticipantDashboard';
import EventDetails from './pages/EventDetails';
import EventRegistration from './pages/EventRegistration';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import { CreatorGallery } from './pages/CreatorDemos';
import { TechShowcase } from './components/TechShowcase';
import Footer from './components/Footer';
import GenericPage from './pages/GenericPage';
import { ArrowRight, Trophy, Zap, Shield, Bot, Code2, Database, Palette } from 'lucide-react';

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Cinematic app simulation boot-up delay
    const loadTimer = setTimeout(() => setIsAppLoading(false), 2600);
    // Graceful unmount after fade-out transition
    const unmountTimer = setTimeout(() => setShowLoader(false), 3200);

    // Advanced step timers
    const t1 = setTimeout(() => setActiveStep(1), 500);
    const t2 = setTimeout(() => setActiveStep(2), 1100);
    const t3 = setTimeout(() => setActiveStep(3), 1700);
    const t4 = setTimeout(() => setActiveStep(4), 2200);

    return () => { 
        clearTimeout(loadTimer); clearTimeout(unmountTimer); 
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    if (showLoader) return;

    // Global Scroll Reveal Observer - fixed for large containers
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '50px 0px 0px 0px' });

    const observeNewElements = () => {
        document.querySelectorAll('.reveal-element:not(.is-revealed)').forEach((el) => {
            observer.observe(el);
        });
    };

    // Initial setup
    observeNewElements();

    // Robust watcher for React DOM shifts and route switching
    const mutationObserver = new MutationObserver(() => observeNewElements());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Bento Card Mouse Tracker for dynamic glow
    const handleMouseMove = (e) => {
        document.querySelectorAll('.bento-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
        observer.disconnect();
        mutationObserver.disconnect();
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [showLoader]);

  const loadingSteps = [
    "Authenticating Secure Session...",
    "Fetching Live Events Data...",
    "Syncing User Dashboard...",
    "System Ready"
  ];

  return (
    <>
      {showLoader && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 9999,
          width: '100vw', height: '100vh', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          background: 'var(--bg-primary)',
          opacity: isAppLoading ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: showLoader ? 'all' : 'none'
        }}>
          {/* SVG Animated 'Building C' Loader */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', animation: 'fade-in-up-fast 1s ease-out' }}>
             
             <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                     <path 
                         d="M 75 25 A 35 35 0 1 0 75 75" 
                         stroke="var(--accent-primary)" 
                         strokeWidth="10" 
                         strokeLinecap="round" 
                         className="draw-c-logo"
                     />
                     <circle cx="50" cy="50" r="8" fill="var(--accent-primary)" className="draw-c-dot" />
                 </svg>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <h1 className="loader-brand-text" style={{ fontSize: '0.9rem', letterSpacing: '0.4em', fontWeight: 600, margin: 0, textTransform: 'uppercase', color: 'var(--text-secondary)', paddingLeft: '0.4em' }}>
                    Contestra
                </h1>
                <div className="loader-progress-track" style={{ width: '120px', height: '1px', background: 'var(--border-light)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '40%', background: 'var(--accent-primary)', animation: 'elite-progress 2s cubic-bezier(0.8, 0, 0.2, 1) infinite' }} />
                </div>
             </div>
          </div>

          <style>{`
              .draw-c-logo {
                  stroke-dasharray: 200;
                  stroke-dashoffset: 200;
                  animation: drawC 1.8s cubic-bezier(0.8, 0, 0.2, 1) forwards;
              }
              .draw-c-dot {
                  opacity: 0;
                  transform: scale(0);
                  transform-origin: 50px 50px;
                  animation: popDot 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.5s forwards;
              }
              .loader-brand-text, .loader-progress-track {
                  opacity: 0;
                  animation: fade-in-subtle 1s ease-out 1.2s forwards;
              }
              @keyframes drawC {
                  from { stroke-dashoffset: 200; }
                  to { stroke-dashoffset: 0; }
              }
              @keyframes popDot {
                  from { transform: scale(0); opacity: 0; }
                  to { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 15px rgba(87,76,0,0.3)); }
              }
              @keyframes fade-in-subtle { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes elite-progress { 0% { transform: translateX(-150%); } 100% { transform: translateX(250%); } }
          `}</style>
        </div>
      )}

    <Router>
      <div className="app-container">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
              <div className="container" style={{ position: 'relative', padding: '4rem 0 8rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                
                {/* Background Ambient Glows */}
                <div className="ambient-glow ambient-glow-1"></div>
                <div className="ambient-glow ambient-glow-2"></div>

                {/* Logo & Name added to top of Hero */}
                <div className="reveal-element reveal-up" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-subtle)' }}>
                        <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                            <path d="M 75 25 A 35 35 0 1 0 75 75" stroke="var(--accent-primary)" strokeWidth="10" strokeLinecap="round" />
                            <circle cx="50" cy="50" r="8" fill="var(--accent-primary)" />
                        </svg>
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>Contestra</span>
                </div>

                <div className="reveal-element reveal-up delay-100" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={16} /> Welcome to the future of events
                </div>
                
                <h1 className="heading-xl reveal-element reveal-up delay-300" style={{ maxWidth: '800px', marginBottom: '1.5rem' }}>
                  The modern platform for <br />
                  <span className="text-gradient">contest registration.</span>
                </h1>
                
                <p className="text-lg text-muted reveal-element reveal-up delay-400" style={{ maxWidth: '600px', marginBottom: '3rem' }}>
                  Contestra provides a seamless, clutter-free experience for event hosts to manage contests and for participants to seamlessly get involved.
                </p>
                
                <div className="reveal-element reveal-scale delay-500" style={{ display: 'flex', gap: '1rem', marginBottom: '6rem' }}>
                  <Link to="/register" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                    Create Account <ArrowRight size={18} />
                  </Link>
                  <Link to="/login" className="btn btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                    Sign in
                  </Link>
                </div>

                {/* Tech Stack Spotlight Animation */}
                <div className="reveal-element reveal-blur" style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '4rem 0 8rem 0', textAlign: 'center', zIndex: 1 }}>
                    <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Powered by Modern Tech</h2>
                    <p className="text-muted" style={{ marginBottom: '4rem' }}>Languages & frameworks seamlessly orchestrated to form Contestra</p>
                    
                    <TechShowcase />
                </div>

                {/* Bento Features Grid */}
                <div className="reveal-element reveal-up" style={{ width: '100%', maxWidth: '1000px', marginBottom: '8rem' }}>
                    <h2 className="heading-lg" style={{ marginBottom: '3rem', textAlign: 'center' }}>Unrivaled Capabilities</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', width: '100%', textAlign: 'left' }}>
                        
                        {/* Featured Large Card */}
                        <div className="bento-card" style={{ gridColumn: '1 / -1' }}>
                            <div className="bento-content">
                                <Trophy size={40} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
                                <h3 className="heading-lg" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Architected for Scale</h3>
                                <p className="text-lg text-muted" style={{ maxWidth: '600px' }}>Effortlessly manage thousands of registrations and highly complex event structures through our minimalist, lightning-fast dashboard.</p>
                            </div>
                        </div>

                        {/* Standard Card */}
                        <div className="bento-card">
                            <div className="bento-content">
                                <Shield size={40} color="var(--accent-secondary)" style={{ marginBottom: '1.5rem' }} />
                                <h3 className="heading-md" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ironclad Security</h3>
                                <p className="text-sm text-muted">Advanced role-based access control and encrypted real-time data flow protects everything.</p>
                            </div>
                        </div>

                        {/* Standard Card */}
                        <div className="bento-card">
                            <div className="bento-content">
                                <Database size={40} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
                                <h3 className="heading-md" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Intelligent Data</h3>
                                <p className="text-sm text-muted">Access deep insights and export your custom participant metrics instantly.</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* How It Works Section */}
                <div className="reveal-element reveal-up" style={{ width: '100%', maxWidth: '1000px', marginBottom: '8rem' }}>
                    <h2 className="heading-lg" style={{ marginBottom: '1rem', textAlign: 'center' }}>How Contestra Works</h2>
                    <p className="text-muted" style={{ marginBottom: '4rem', textAlign: 'center' }}>From event creation to participation in three simple steps</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%' }}>
                        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem', fontWeight: 'bold' }}>1</div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Host an Event</h3>
                            <p className="text-sm text-muted">Organizers create customized events specifying team sizes, requirements, and dates utilizing our lightning-fast dashboard.</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem', fontWeight: 'bold' }}>2</div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Participants Register</h3>
                            <p className="text-sm text-muted">Students and professionals browse the seamless event catalogue, form teams, and securely submit their entries.</p>
                        </div>
                        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem', fontWeight: 'bold' }}>3</div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Manage & Export</h3>
                            <p className="text-sm text-muted">Hosts seamlessly review participants, manage approvals, and export verified data right from their control panel.</p>
                        </div>
                    </div>
                </div>

                {/* Team Section (Moved to Bottom) */}
                <div className="reveal-element reveal-up" style={{ width: '100%', maxWidth: '1000px', marginBottom: '4rem', textAlign: 'center' }}>
                    <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Meet the Creators</h2>
                    <p className="text-muted" style={{ marginBottom: '3rem' }}>The visionary development team behind Contestra</p>
                    
                    <div style={{ margin: '2rem 0 4rem 0' }}>
                        <CreatorGallery />
                    </div>
                </div>
              </div>
              <Footer />
              </>
            } />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<GenericPage />} />
            <Route path="/terms-of-service" element={<GenericPage />} />
            <Route path="/privacy-policy" element={<GenericPage />} />
            
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/host/*" element={
              <ProtectedRoute allowedRoles={['Host']}>
                <HostDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/participant/*" element={
              <ProtectedRoute allowedRoles={['Participant']}>
                <Routes>
                  <Route path="/" element={<ParticipantDashboard />} />
                  <Route path="/event/:id" element={<EventDetails />} />
                  <Route path="/register-event/:id" element={<EventRegistration />} />
                </Routes>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  </>
  );
}

export default App;
