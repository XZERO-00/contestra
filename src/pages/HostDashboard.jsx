import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { CalendarPlus, Settings, Users, Calendar, MapPin, Trash2, Pause, Play, Activity, Search, Download, User, TrendingUp, Mail, Building2, Briefcase } from 'lucide-react';

const HostDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const { getMyHostedEvents, addEvent, deleteEvent, getEventParticipants } = useEvents();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [participantFilter, setParticipantFilter] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ 
     name: user?.name || '',
     organization: user?.organization || ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  React.useEffect(() => {
     if (user) setProfileForm({ name: user.name || '', organization: user.organization || '' });
  }, [user]);

  const handleProfileUpdate = async (e) => {
     e.preventDefault();
     setIsUpdatingProfile(true);
     setProfileMessage({ type: '', text: '' });
     try {
       await updateUserProfile({ name: profileForm.name, organization: profileForm.organization });
       setProfileMessage({ type: 'success', text: 'Workspace configuration updated successfully!' });
       setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
     } catch (err) {
       setProfileMessage({ type: 'error', text: 'Failed to update configuration.' });
     }
     setIsUpdatingProfile(false);
  };

  const initialFormState = {
    name: '',
    description: '',
    rules: '',
    category: 'Technology',
    difficulty: 'Beginner',
    date: '',
    venue: '',
    feeType: 'Free',
    feeAmount: '',
    prizes: '',
    eligibility: '',
    registrationDeadline: '',
    participantLimit: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const events = getMyHostedEvents();

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addEvent(formData);
    setIsSubmitting(false);
    setFormData(initialFormState);
    setActiveTab('overview');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedEventId(null);
    setParticipantFilter('');
  };

  const exportToCSV = (participantsList, eventName) => {
    if (participantsList.length === 0) return;

    const headers = ['Name', 'School/College', 'Email'];
    const csvRows = participantsList.map(p => {
      const name = `"${(p.name || '').replace(/"/g, '""')}"`;
      const org = `"${(p.organization || '').replace(/"/g, '""')}"`;
      const email = `"${(p.email || '').replace(/"/g, '""')}"`;
      return [name, org, email].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${eventName.replace(/\s+/g, '_')}_Participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderOverview = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {events.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>No events constructed yet.</p>
          <button className="btn btn-brand" onClick={() => handleTabChange('create')}>
            Create your first event
          </button>
        </div>
      ) : (
        events.map(event => (
          <div key={event.id} className="glass-panel card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--accent-primary)' }}>
            <div>
                <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>{event.name}</h3>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Calendar size={15} /> {new Date(event.date).toLocaleDateString()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={15} /> {event.venue}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Users size={15} /> <span className="badge badge-info">{getEventParticipants(event.id).length} / {event.participantLimit || '∞'} enrolled</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Activity size={15} /> 
                        <span className={`badge ${event.status === 'Paused' ? 'badge-error' : 'badge-success'}`}>
                            {event.status || 'Open'}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', paddingTop: '1.5rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
                onClick={() => { setSelectedEventId(event.id); setActiveTab('participants'); }}
              >
                Manage
              </button>
              
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem', color: event.status === 'Paused' ? 'var(--success)' : 'var(--accent-secondary)' }}
                onClick={() => updateEvent(event.id, { status: event.status === 'Paused' ? 'Open' : 'Paused' })}
                title={event.status === 'Paused' ? "Resume Registrations" : "Pause Registrations"}
              >
                {event.status === 'Paused' ? <Play size={16} /> : <Pause size={16} />}
              </button>
              
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem', color: 'var(--error)' }}
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
                    deleteEvent(event.id);
                  }
                }}
                title="Delete Event"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderCreateEvent = () => (
    <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h3 className="heading-md" style={{ marginBottom: '2rem' }}>Event Details</h3>
      <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div className="input-group">
          <label className="input-label">Event Name</label>
          <input className="input-field" type="text" required
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="input-label">Category</label>
            <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Arts">Arts</option>
              <option value="Sports">Sports</option>
              <option value="Academics">Academics</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Difficulty</label>
            <select className="input-field" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Open">Open for All</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea className="input-field" rows="3" required
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Rules & Guidelines</label>
          <textarea className="input-field" rows="3" placeholder="Enter contest rules..."
            value={formData.rules} onChange={e => setFormData({...formData, rules: e.target.value})}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="input-label">Event Date</label>
            <input className="input-field" type="date" required
              min={new Date().toISOString().split('T')[0]}
              value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Venue / Link</label>
            <input className="input-field" type="text" required
              value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Entry Fee</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select className="input-field" style={{ width: '40%' }} value={formData.feeType} onChange={e => setFormData({...formData, feeType: e.target.value})}>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
              {formData.feeType === 'Paid' && (
                 <input className="input-field" type="number" min="1" placeholder="Amount (INR)" style={{ width: '60%' }} required
                   value={formData.feeAmount} onChange={e => setFormData({...formData, feeAmount: e.target.value})} 
                 />
              )}
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Prize Details</label>
            <input className="input-field" type="text" placeholder="e.g. $500 Pool"
              value={formData.prizes} onChange={e => setFormData({...formData, prizes: e.target.value})} 
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Eligibility Criteria</label>
          <input className="input-field" type="text" placeholder="e.g. Undergraduates only"
            value={formData.eligibility} onChange={e => setFormData({...formData, eligibility: e.target.value})} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="input-label">Registration Deadline</label>
            <input className="input-field" type="date" required
              min={new Date().toISOString().split('T')[0]}
              max={formData.date || undefined}
              value={formData.registrationDeadline} onChange={e => setFormData({...formData, registrationDeadline: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Capacity Limit (Optional)</label>
            <input className="input-field" type="number" min="1" placeholder="Unlimited"
              value={formData.participantLimit} onChange={e => setFormData({...formData, participantLimit: e.target.value})} 
            />
          </div>
        </div>

        <button type="submit" className="btn btn-brand" style={{ alignSelf: 'flex-start', marginTop: '1.5rem' }} disabled={isSubmitting}>
          {isSubmitting ? 'Publishing Event...' : 'Publish Event'}
        </button>
      </form>
    </div>
  );

  const renderParticipants = () => {
    const event = events.find(e => e.id === selectedEventId);
    if (!event) return null;

    const allParticipants = getEventParticipants(event.id);
    const participants = allParticipants.filter(p => {
        if (!participantFilter) return true;
        const org = p.organization || '';
        return org.toLowerCase().includes(participantFilter.toLowerCase());
    });

    return (
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
              <h3 className="heading-md">{event.name}</h3>
              <p className="text-sm text-muted">Total Enrolled: {allParticipants.length} {event.participantLimit ? `/ ${event.participantLimit}` : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                  className="btn btn-primary" 
                  onClick={() => exportToCSV(participants, event.name)}
                  disabled={participants.length === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}
                  title="Download as CSV spreadsheet"
              >
                  <Download size={16} /> Export CSV
              </button>
              <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                      type="text"
                      className="input-field"
                      placeholder="Filter by School / College..."
                      value={participantFilter}
                      onChange={e => setParticipantFilter(e.target.value)}
                      style={{ paddingLeft: '2.5rem', minWidth: '240px', margin: 0 }}
                  />
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveTab('overview')}>Back</button>
          </div>
        </div>

        {participants.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <p className="text-muted">{allParticipants.length === 0 ? 'No registrations found.' : 'No participants match the filter.'}</p>
          </div>
        ) : (
          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>School / College</th>
                  <th>Email Address</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.organization || '-'}</td>
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>{p.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderAnalysis = () => {
    const totalEvents = events.length;
    const totalParticipants = events.reduce((acc, event) => acc + getEventParticipants(event.id).length, 0);
    const mockRevenue = events.reduce((acc, event) => acc + (event.feeType === 'Paid' ? (getEventParticipants(event.id).length * Number(event.feeAmount || 0)) : 0), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                        <Activity size={20} color="var(--accent-primary)" /> <span style={{ fontWeight: 600 }}>Active Contests</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalEvents}</div>
                    <div className="text-sm text-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <TrendingUp size={14} /> +2 this month
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                        <Users size={20} color="var(--accent-secondary)" /> <span style={{ fontWeight: 600 }}>Total Reach</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalParticipants}</div>
                    <div className="text-sm text-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <TrendingUp size={14} /> +12% growth
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                        <Briefcase size={20} color="var(--success)" /> <span style={{ fontWeight: 600 }}>Total Revenue</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{mockRevenue.toLocaleString()}</div>
                    <div className="text-sm text-muted">Estimated net earnings</div>
                </div>
            </div>

            {/* Mock Chart Area */}
            <div className="glass-panel" style={{ padding: '2.5rem', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem', border: '1px dashed var(--border-light)' }}>
                <TrendingUp size={48} color="var(--border-light)" />
                <h3 className="heading-md text-muted">Engagement Velocity Chart</h3>
                <p className="text-sm text-muted" style={{ maxWidth: '400px', textAlign: 'center' }}>
                    Complex timeseries charting of registration velocity over time will render here upon sufficient dataset volume.
                </p>
            </div>
        </div>
    );
  };

  const renderProfile = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem', borderRadius: '24px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700 }}>
                {user?.organization?.[0] || user?.name?.[0] || 'H'}
            </div>
            <div>
                <h3 className="heading-lg" style={{ marginBottom: '0.5rem' }}>{user?.organization || 'Host Workspace'}</h3>
                <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <User size={16} /> Admin: {user?.name || 'Authorized Host'}
                </p>
                <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Mail size={16} /> {user?.email}
                </p>
                <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    Enterprise verified
                </div>
            </div>
        </div>
        
        <form className="glass-panel" style={{ padding: '2.5rem' }} onSubmit={handleProfileUpdate}>
            <h3 className="heading-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="var(--text-secondary)" /> Workspace Configuration
            </h3>

            {profileMessage.text && (
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: profileMessage.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)', color: profileMessage.type === 'success' ? 'var(--success)' : 'var(--error)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                {profileMessage.text}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Public Organization Name</label>
                    <input type="text" className="input-field" value={profileForm.organization} onChange={e => setProfileForm({...profileForm, organization: e.target.value})} required />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Admin Name</label>
                    <input type="text" className="input-field" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} required />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Support Email Contact (Locked)</label>
                    <input type="email" className="input-field" value={user?.email || ''} readOnly disabled style={{ opacity: 0.7 }} />
                </div>
            </div>
            
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="submit" className="btn btn-brand" disabled={isUpdatingProfile || (profileForm.name === user?.name && profileForm.organization === user?.organization)}>
                   {isUpdatingProfile ? 'Saving...' : 'Update Configuration'}
                </button>
            </div>
        </form>
    </div>
  );

  return (
    <div className="page-mount-fade container" style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Elegant Top Navigation Bar */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ display: 'inline-flex', padding: '0.5rem', gap: '0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
          
          <button 
            onClick={() => handleTabChange('overview')}
            style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-full)', background: (activeTab === 'overview' || activeTab === 'participants') ? 'var(--bg-hover)' : 'transparent', color: (activeTab === 'overview' || activeTab === 'participants') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: (activeTab === 'overview' || activeTab === 'participants') ? 600 : 500, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}
          >
            <Settings size={18} /> My Events
          </button>

          <button 
            onClick={() => handleTabChange('create')}
            style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-full)', background: activeTab === 'create' ? 'var(--bg-hover)' : 'transparent', color: activeTab === 'create' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'create' ? 600 : 500, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}
          >
            <CalendarPlus size={18} /> Create Draft
          </button>

          <button 
            onClick={() => handleTabChange('analysis')}
            style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-full)', background: activeTab === 'analysis' ? 'var(--bg-hover)' : 'transparent', color: activeTab === 'analysis' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'analysis' ? 600 : 500, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}
          >
            <Activity size={18} /> Analytics
          </button>

          <button 
            onClick={() => handleTabChange('profile')}
            style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-full)', background: activeTab === 'profile' ? 'var(--bg-hover)' : 'transparent', color: activeTab === 'profile' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'profile' ? 600 : 500, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}
          >
            <User size={18} /> Host Workspace
          </button>
          
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'create' && renderCreateEvent()}
        {activeTab === 'participants' && renderParticipants()}
        {activeTab === 'analysis' && renderAnalysis()}
        {activeTab === 'profile' && renderProfile()}
      </div>

    </div>
  );
};

export default HostDashboard;
