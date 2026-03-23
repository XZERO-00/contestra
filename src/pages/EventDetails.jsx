import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Ticket, ArrowLeft, Trophy, Info, Banknote, HelpCircle, Activity } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, registerForEvent, getMyRegisteredEvents } = useEvents();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundEvent = getEventById(id);
    if (foundEvent) {
      setEvent(foundEvent);
      const userRegs = getMyRegisteredEvents();
      setIsRegistered(userRegs.some(e => e.id === foundEvent.id));
    }
    setLoading(false);
  }, [id, getEventById, getMyRegisteredEvents]);

  const handleRegisterClick = () => {
     navigate(`/participant/register-event/${id}`);
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;
  if (!event) return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 className="heading-lg">Event Not Found</h2>
        <Link to="/participant" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <Link to="/participant" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--text-primary)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-muted)'}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Header Section */}
        <div className="glass-panel" style={{ padding: '3rem 2.5rem', borderTop: '4px solid var(--accent-primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{event.category || 'Event'}</span>
              <span className="badge badge-info">{event.difficulty || 'Open'}</span>
              {(event.status === 'Paused' || event.status === 'Closed') && (
                  <span className="badge badge-error" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Activity size={12} /> {event.status}
                  </span>
              )}
          </div>
          
          <h1 className="heading-xl" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', maxWidth: '800px' }}>{event.name}</h1>
          <p className="text-lg text-muted" style={{ maxWidth: '800px', lineHeight: 1.6 }}>{event.description}</p>
        </div>

        {/* Action Panel (Sticky on Desktop potentially, inline for now) */}
        <div className="glass-panel" style={{ padding: '2rem 2.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">Date & Time</p>
                        <p style={{ fontWeight: 500 }}>{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">Venue</p>
                        <p style={{ fontWeight: 500 }}>{event.venue}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                        <Banknote size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">Entry Fee</p>
                        <p style={{ fontWeight: 500 }}>{event.feeType === 'Free' ? 'Free' : `₹${event.feeAmount}`}</p>
                    </div>
                </div>
            </div>

            <div>
                {isRegistered ? (
                    <button className="btn btn-secondary" disabled style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', opacity: 1, color: 'var(--success)', border: '1px solid var(--success-bg)' }}>
                        <Ticket size={18} /> Registered
                    </button>
                ) : event.status === 'Paused' || event.status === 'Closed' ? (
                    <button className="btn btn-secondary" disabled style={{ padding: '0.875rem 2.5rem', fontSize: '1.05rem', opacity: 0.7 }}>
                        Registration Closed
                    </button>
                ) : (
                    <button className="btn btn-brand" onClick={handleRegisterClick} style={{ padding: '0.875rem 2.5rem', fontSize: '1.05rem' }}>
                        Join Event
                    </button>
                )}
            </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {event.rules && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                        <Info size={20} /> <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>Rules & Guidelines</h3>
                    </div>
                    <div style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                        {event.rules}
                    </div>
                </div>
            )}

            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {event.prizes && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                            <Trophy size={20} /> <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>Prize Pool</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{event.prizes}</p>
                    </div>
                )}
                
                {event.eligibility && (
                    <div style={{ marginTop: event.prizes ? '1.5rem' : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            <Users size={20} /> <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>Eligibility</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{event.eligibility}</p>
                    </div>
                )}
                
                {event.registrationDeadline && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border-light)' }}>
                        <p className="text-sm text-muted">Registration closes on</p>
                        <p style={{ fontWeight: 500, marginTop: '0.25rem', color: 'var(--error)' }}>
                            {new Date(event.registrationDeadline).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default EventDetails;
