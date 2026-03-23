import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { Compass, CheckCircle, Search, Calendar, MapPin, Users, Ticket, Activity, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ParticipantDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const { events, registerForEvent, getMyRegisteredEvents } = useEvents();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ name: user?.name || '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  React.useEffect(() => {
     if (user) setProfileForm({ name: user.name || '' });
  }, [user]);

  const handleProfileUpdate = async (e) => {
     e.preventDefault();
     setIsUpdatingProfile(true);
     setProfileMessage({ type: '', text: '' });
     try {
       await updateUserProfile({ name: profileForm.name });
       setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
       setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
     } catch (err) {
       setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
     }
     setIsUpdatingProfile(false);
  };

  const registeredEvents = getMyRegisteredEvents();
  const registeredEventIds = registeredEvents.map(e => e.id);

  const discoverableEvents = events.filter(e => {
    const notRegistered = !registeredEventIds.includes(e.id);
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (e.organization && e.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return notRegistered && matchesSearch;
  });

  const handleRegister = async (eventId) => {
    try {
        const success = await registerForEvent(eventId);
        if (success) {
          setNotification({ type: 'success', message: 'Successfully registered for the event!' });
        } else {
          setNotification({ type: 'error', message: 'Registration failed. Event may be full.' });
        }
    } catch (error) {
        setNotification({ type: 'error', message: 'An error occurred during registration.' });
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const renderDiscover = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: 'var(--radius-full)' }}>
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search by contest name or keywords..." 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.9375rem' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {notification && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          background: notification.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
          color: notification.type === 'success' ? 'var(--success)' : 'var(--error)',
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: 500
        }}>
          {notification.message}
        </div>
      )}

      {/* Event Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {discoverableEvents.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            No upcoming events found.
          </div>
        ) : (
          discoverableEvents.map(event => (
            <div key={event.id} className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>{event.name}</h3>
                    {event.feeType === 'Free' ? (
                        <span className="badge badge-success">Free</span>
                    ) : (
                        <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-secondary)' }}>₹{event.feeAmount}</span>
                    )}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{event.category || 'Event'}</span>
                    <span className="badge badge-info">{event.difficulty || 'Open'}</span>
                    {(event.status === 'Paused' || event.status === 'Closed') && (
                        <span className="badge badge-error" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Activity size={12} /> {event.status}
                        </span>
                    )}
                </div>

                <p className="text-muted" style={{ fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {event.description}
                </p>
                {event.prizes && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', marginTop: '0.5rem', fontWeight: 500 }}>
                        🏆 Prizes: {event.prizes}
                    </p>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Calendar size={15} /> {new Date(event.date).toLocaleDateString()}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={15} /> {event.venue}</div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <button 
                  className="btn btn-brand" 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                  onClick={() => handleRegister(event.id)}
                  disabled={event.status === 'Paused' || event.status === 'Closed'}
                >
                  {event.status === 'Paused' || event.status === 'Closed' ? 'Registration Closed' : 'Quick Register'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem 1rem' }}
                  onClick={() => navigate(`/participant/event/${event.id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );

  const renderMyEvents = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {registeredEvents.length === 0 ? (
        <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', background: 'transparent', borderStyle: 'dashed' }}>
          You haven't registered for any events yet.
        </div>
      ) : (
        registeredEvents.map(event => (
          <div key={event.id} className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>{event.name}</h3>
                {event.feeType === 'Free' ? (
                    <span className="badge badge-success">Free</span>
                ) : (
                    <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-secondary)' }}>₹{event.feeAmount}</span>
                )}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{event.category || 'Event'}</span>
                <span className="badge badge-info">{event.difficulty || 'Open'}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Calendar size={15} /> 
                 {new Date(event.date).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={15} /> {event.venue}</div>
              
              {event.eligibility && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Users size={15} /> <span className="badge badge-info">{event.eligibility}</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem', color: 'var(--success)' }}>
              <CheckCircle size={16} />
              <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Registered</span>
              <button 
                className="btn btn-secondary" 
                style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                onClick={() => navigate(`/participant/event/${event.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // --------------------------------------------------------------------------
  // NEW VIEW STUBS: Tickets & Profile
  // --------------------------------------------------------------------------
  const renderTickets = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
      {registeredEvents.length === 0 ? (
        <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', background: 'transparent', borderStyle: 'dashed' }}>
          You haven't registered for any events yet.
        </div>
      ) : (
        registeredEvents.map(event => (
          <div key={event.id} style={{ display: 'flex', background: 'var(--bg-primary)', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-subtle)', position: 'relative' }}>
            {/* Left side: Event Info */}
            <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '2px dashed var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>{event.name}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{event.category || 'Event'}</span>
                    <span className="badge badge-info">{event.difficulty || 'Open'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Calendar size={15} /> {new Date(event.date).toLocaleDateString()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={15} /> {event.venue}</div>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1rem', color: 'var(--success)' }}>
                  <CheckCircle size={16} />
                  <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Confirmed</span>
                </div>
            </div>
            
            {/* Right side: Ticket Stub / Mock QR */}
            <div style={{ width: '120px', background: 'var(--bg-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', gap: '1rem' }}>
                <div style={{
                    width: '64px', height: '64px',
                    background: 'url("data:image/svg+xml,%3Csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 100 100\\\'%3E%3Crect width=\\\'100\\\' height=\\\'100\\\' fill=\\\'white\\\'/%3E%3Cpath d=\\\'M10 10h30v30H10zM60 10h30v30H60zM10 60h30v30H10zM20 20h10v10H20zM70 20h10v10H70zM20 70h10v10H20zM50 50h10v10H50zM70 60h20v10H70zM80 80h10v10H80zM50 80h20v10H50z\\\' fill=\\\'%23574C00\\\'/%3E%3C/svg%3E")',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                }} />
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem', fontSize: '0.75rem', width: '100%' }}
                  onClick={() => navigate(`/participant/event/${event.id}`)}
                >
                  View Pass
                </button>
            </div>
            
            {/* Ticket Notches */}
            <div style={{ position: 'absolute', top: '-10px', right: '110px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }} />
            <div style={{ position: 'absolute', bottom: '-10px', right: '110px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }} />
          </div>
        ))
      )}
    </div>
  );

  const renderProfile = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem', borderRadius: '24px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700 }}>
                {user?.name?.[0] || 'U'}
            </div>
            <div>
                <h3 className="heading-lg" style={{ marginBottom: '0.5rem' }}>{user?.name || 'Participant'}</h3>
                <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Mail size={16} /> {user?.email}
                </p>
                <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    Participant Account
                </div>
            </div>
        </div>

        <form className="glass-panel" style={{ padding: '2.5rem' }} onSubmit={handleProfileUpdate}>
            <h3 className="heading-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} color="var(--text-secondary)" /> Account Settings
            </h3>

            {profileMessage.text && (
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: profileMessage.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)', color: profileMessage.type === 'success' ? 'var(--success)' : 'var(--error)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                {profileMessage.text}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Display Name</label>
                    <input type="text" className="input-field" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} required />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Email Address (Locked)</label>
                    <input type="email" className="input-field" value={user?.email || ''} readOnly disabled style={{ opacity: 0.7 }} />
                </div>
            </div>
            
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="submit" className="btn btn-brand" disabled={isUpdatingProfile || profileForm.name === user?.name}>
                   {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel card-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
                <Ticket size={32} color="var(--accent-primary)" />
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{registeredEvents.length}</div>
                    <div className="text-muted text-sm">Active Tickets</div>
                </div>
            </div>
            <div className="glass-panel card-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
                <Activity size={32} color="var(--accent-secondary)" />
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Level 1</div>
                    <div className="text-muted text-sm">Participant Tier</div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="page-mount-fade container" style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Elegant Top Navigation Bar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ display: 'inline-flex', padding: '0.5rem', gap: '0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <button 
            onClick={() => setActiveTab('discover')}
            style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-full)', background: activeTab === 'discover' ? 'var(--bg-hover)' : 'transparent', color: activeTab === 'discover' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'discover' ? 600 : 500, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}
          >
            <Compass size={18} /> Discover
          </button>
          
          <button 
            onClick={() => setActiveTab('tickets')}
            style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-full)', background: activeTab === 'tickets' ? 'var(--bg-hover)' : 'transparent', color: activeTab === 'tickets' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'tickets' ? 600 : 500, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}
          >
            <Ticket size={18} /> My Tickets
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-full)', background: activeTab === 'profile' ? 'var(--bg-hover)' : 'transparent', color: activeTab === 'profile' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'profile' ? 600 : 500, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}
          >
            <User size={18} /> Profile
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        {activeTab === 'discover' && renderDiscover()}
        {activeTab === 'tickets' && renderTickets()}
        {activeTab === 'profile' && renderProfile()}
      </div>

    </div>
  );
};

export default ParticipantDashboard;
