import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { ThemeProvider } from './context/ThemeContext';
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
import Footer from './components/Footer';
import {
  ArrowRight, Trophy, Shield, Users, Zap,
  ClipboardList, BarChart2, TicketCheck
} from 'lucide-react';

// ── Boot Loader ────────────────────────────────────────────
const BootLoader = ({ visible }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-primary)',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'all' : 'none',
    transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)',
    gap: '1.75rem',
  }}>
    <style>{`
      @keyframes spokeDraw {
        from { stroke-dashoffset: 40; opacity: 0; }
        to   { stroke-dashoffset: 0;  opacity: 1; }
      }
      @keyframes centerPulse {
        0%,100% { r: 8;  opacity: 1; }
        50%      { r: 11; opacity: 0.75; }
      }
      @keyframes centerFadeIn {
        from { opacity: 0; transform: scale(0.4); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes brandReveal {
        from { opacity: 0; letter-spacing: 0.55em; }
        to   { opacity: 1; letter-spacing: 0.3em;  }
      }
      @keyframes barSweep {
        0%   { width: 0%;   opacity: 1; }
        80%  { width: 100%; opacity: 1; }
        100% { width: 100%; opacity: 0; }
      }
      @keyframes taglineIn {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0);   }
      }
    `}</style>

    {/* Logo */}
    <svg width="72" height="72" viewBox="0 0 110 96" fill="none">
      {/* Spokes — each draws out from center, staggered */}
      {[
        { x1:55, y1:48, x2:55, y2:6  },
        { x1:55, y1:48, x2:97, y2:48 },
        { x1:55, y1:48, x2:55, y2:90 },
        { x1:55, y1:48, x2:13, y2:48 },
        { x1:55, y1:48, x2:85, y2:18 },
        { x1:55, y1:48, x2:85, y2:78 },
        { x1:55, y1:48, x2:25, y2:78 },
        { x1:55, y1:48, x2:25, y2:18 },
      ].map((s, i) => (
        <line key={i}
          x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke="var(--accent)"
          strokeWidth={i < 4 ? 7 : 4.5}
          strokeLinecap="round"
          strokeDasharray="40"
          strokeDashoffset="40"
          opacity={i >= 4 ? 0.55 : 1}
          style={{
            animation: `spokeDraw 0.35s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.1}s forwards`,
          }}
        />
      ))}

      {/* Center dot — fades in then pulses */}
      <circle cx="55" cy="48" r="8" fill="var(--accent)"
        style={{ animation: 'centerFadeIn 0.3s ease 0.95s both, centerPulse 2s ease-in-out 1.3s infinite' }}
      />
    </svg>

    {/* Brand name */}
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem',
    }}>
      <span style={{
        fontSize: '0.85rem', letterSpacing: '0.3em', fontWeight: 700,
        color: 'var(--text-secondary)', textTransform: 'uppercase',
        opacity: 0,
        animation: 'brandReveal 0.7s cubic-bezier(0.22,1,0.36,1) 0.9s forwards',
      }}>
        ContestHub
      </span>

      {/* Progress bar */}
      <div style={{ width: 100, height: 2, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--accent), var(--gold))',
          borderRadius: 2,
          width: 0,
          animation: 'barSweep 1.8s cubic-bezier(0.4,0,0.2,1) 0.4s forwards',
        }} />
      </div>

      {/* Tagline */}
      <span style={{
        fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.06em',
        opacity: 0,
        animation: 'taglineIn 0.5s ease 1.3s forwards',
      }}>
        Online Contest Registration
      </span>
    </div>
  </div>
);

// ── Features Data ──────────────────────────────────────────
const features = [
  { icon: <Trophy size={22} />, title: 'Run Contests', desc: 'Create and manage competitions with full control over rules, dates, teams, and entry fees.' },
  { icon: <Users size={22} />, title: 'Manage Participants', desc: 'Track registrations in real-time and export participant lists with a single click.' },
  { icon: <TicketCheck size={22} />, title: 'Digital Tickets', desc: 'Participants receive elegant digital tickets with QR codes for every event they join.' },
  { icon: <BarChart2 size={22} />, title: 'Analytics Dashboard', desc: 'Hosts get revenue insights, reach metrics, and event performance data at a glance.' },
  { icon: <Shield size={22} />, title: 'Secure Auth', desc: 'Firebase Authentication ensures safe sign-in, registration, and password recovery.' },
  { icon: <Zap size={22} />, title: 'Instant Updates', desc: 'All data syncs live via Cloud Firestore — no page reloads needed.' },
];

const steps = [
  { n: '1', title: 'Host Creates an Event', desc: 'Organizers build a contest with title, rules, date, venue, and pricing in minutes.' },
  { n: '2', title: 'Participants Register', desc: 'Users browse the event catalogue, register with one click, and receive a digital ticket.' },
  { n: '3', title: 'Manage & Export', desc: 'Hosts review enrollments, track analytics, and export participant data as CSV.' },
];

// ── App ────────────────────────────────────────────────────
function App() {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 60, easing: 'ease-out-quad' });

    const t1 = setTimeout(() => setLoading(false), 2200);
    const t2 = setTimeout(() => setShowLoader(false), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <ThemeProvider>
      {showLoader && <BootLoader visible={loading} />}
      <Router>
        <Navbar />
        <main>
          <Routes>

            {/* ── Home Page ── */}
            <Route path="/" element={
              <>
                {/* Hero */}
                <section className="hero">
                  <div className="container">
                    <div className="hero-badge" data-aos="fade-down">
                      <Zap size={13} /> Online Contest Registration Platform
                    </div>

                    <h1 className="heading-xl" data-aos="fade-up" data-aos-delay="100" style={{ maxWidth: 740, margin: '0 auto 1.25rem' }}>
                      The modern way to run<br />
                      <span className="hero-gradient">competitive events.</span>
                    </h1>

                    <p className="text-lg text-muted" data-aos="fade-up" data-aos-delay="200"
                      style={{ maxWidth: 560, margin: '0 auto' }}>
                      ContestHub makes it effortless for organizers to run contests and for participants to discover and register for events they love.
                    </p>

                    <div className="hero-ctas" data-aos="fade-up" data-aos-delay="300">
                      <Link to="/register" className="btn btn-primary btn-lg">
                        Get Started <ArrowRight size={18} />
                      </Link>
                      <Link to="/login" className="btn btn-outline btn-lg">
                        Sign In
                      </Link>
                    </div>
                  </div>
                </section>

                {/* Features */}
                <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="container">
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                      <div className="section-label" data-aos="fade-up">What We Offer</div>
                      <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
                        Everything you need to run events
                      </h2>
                      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">
                        Built for both organizers and participants with simple, powerful tools.
                      </p>
                    </div>

                    <div className="features-grid">
                      {features.map((f, i) => (
                        <div key={i} className="feature-card" data-aos="fade-up" data-aos-delay={i * 80}>
                          <div className="feature-icon">{f.icon}</div>
                          <h3 className="heading-md" style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
                          <p className="text-sm text-muted">{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* How It Works */}
                <section className="section">
                  <div className="container">
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                      <div className="section-label" data-aos="fade-up">Simple Process</div>
                      <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">How ContestHub Works</h2>
                      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="150">
                        From event creation to participation in three straightforward steps.
                      </p>
                    </div>

                    <div className="steps-grid">
                      {steps.map((s, i) => (
                        <div key={i} className="card text-center" data-aos="fade-up" data-aos-delay={i * 100}>
                          <div className="step-number">{s.n}</div>
                          <h3 className="heading-md" style={{ marginBottom: '0.625rem' }}>{s.title}</h3>
                          <p className="text-sm text-muted">{s.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Meet the Team */}
                <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="container">
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                      <div className="section-label" data-aos="fade-up">The Builders</div>
                      <h2 className="section-title" data-aos="fade-up" data-aos-delay="80">Meet the Creators</h2>
                      <p className="section-subtitle" data-aos="fade-up" data-aos-delay="140">
                        The team that designed and built ContestHub from the ground up.
                      </p>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '1.5rem',
                      maxWidth: '960px',
                      margin: '0 auto'
                    }}>
                      {[
                        { name: 'Atharva Pawar',  role: 'Lead Full-Stack',  initials: 'AP', link: 'https://www.linkedin.com/in/atharva-pawar02/' },
                        { name: 'Rajasvi Harane', role: 'UI/UX Designer',   initials: 'RH', link: 'https://www.linkedin.com/in/rajasvi-harane-ba3b012bb/' },
                        { name: 'Shivani Kanshetti', role: 'Frontend Dev', initials: 'SK', link: 'https://www.linkedin.com/in/shivani-kanshetti-a02972346/' },
                        { name: 'Srushti Patil',  role: 'Database Arch',    initials: 'SP', link: 'https://www.linkedin.com/in/srushti-patil-942169308/' },
                      ].map((c, i) => (
                        <div key={i} data-aos="fade-up" data-aos-delay={i * 80}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '2rem 1.5rem',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-card)',
                            transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            e.currentTarget.style.borderColor = 'var(--gold-border)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }}
                        >
                          {/* Avatar */}
                          <div style={{
                            width: 64, height: 64,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent), #8BAD3A)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.125rem',
                            fontSize: '1.25rem', fontWeight: 700, color: '#fff',
                            letterSpacing: '0.02em',
                          }}>
                            {c.initials}
                          </div>

                          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{c.name}</h3>
                          <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>{c.role}</p>

                          <a href={c.link} target="_blank" rel="noopener noreferrer"
                            style={{
                              fontSize: '0.8125rem', fontWeight: 600,
                              color: 'var(--accent)',
                              textDecoration: 'none',
                              transition: 'color 200ms ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}
                          >
                            LinkedIn →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="section-sm" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="container text-center" data-aos="zoom-in">
                    <ClipboardList size={36} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
                    <h2 className="heading-lg" style={{ marginBottom: '0.75rem' }}>Ready to get started?</h2>
                    <p className="text-muted" style={{ marginBottom: '1.75rem' }}>
                      Join as a participant and discover contests, or sign up as a host and create your first event today.
                    </p>
                    <div className="hero-ctas">
                      <Link to="/register" className="btn btn-primary btn-lg">Create an Account <ArrowRight size={18} /></Link>
                    </div>
                  </div>
                </section>

                <Footer />
              </>
            } />

            {/* ── Auth Pages ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* ── Protected Pages ── */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/host/*" element={
              <ProtectedRoute allowedRoles={['Host']}><HostDashboard /></ProtectedRoute>
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
