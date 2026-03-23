import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { ShieldAlert, Users, Calendar, CreditCard, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { events, registrations } = useEvents();
  const [activeTab, setActiveTab] = useState('overview');

  // Load all users from local storage
  const allUsers = JSON.parse(localStorage.getItem('contestra_users') || '[]');
  const participants = allUsers.filter(u => u.role === 'Participant');
  const hosts = allUsers.filter(u => u.role === 'Host');

  // Simple mock metrics
  const totalRevenue = registrations.length * 500; // Mock average fee

  const renderOverview = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '4px solid var(--accent-primary)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(87, 76, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
           <Users size={24} />
        </div>
        <div>
           <p className="text-muted text-sm">Total Users</p>
           <h3 className="heading-ld" style={{ fontSize: '1.5rem' }}>{allUsers.length}</h3>
        </div>
      </div>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '4px solid var(--accent-secondary)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
           <Calendar size={24} />
        </div>
        <div>
           <p className="text-muted text-sm">Active Events</p>
           <h3 className="heading-ld" style={{ fontSize: '1.5rem' }}>{events.length}</h3>
        </div>
      </div>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '4px solid var(--success)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
           <CreditCard size={24} />
        </div>
        <div>
           <p className="text-muted text-sm">Total Registrations</p>
           <h3 className="heading-ld" style={{ fontSize: '1.5rem' }}>{registrations.length}</h3>
        </div>
      </div>
    </div>
  );

  const renderUsersList = () => (
    <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>User Directory</h3>
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No users found</td></tr>
                ) : allUsers.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < allUsers.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}><span className={`badge ${u.role === 'Admin' ? 'badge-error' : (u.role === 'Host' ? 'badge-success' : 'badge-info')}`}>{u.role}</span></td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Mock Data</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    </div>
  );

  const renderEventsList = () => (
    <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>Platform Events</h3>
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Event Name</th>
                  <th style={{ padding: '1rem' }}>Host ID</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Fee Status</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No events found</td></tr>
                ) : events.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: i < events.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{e.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{e.hostId.substring(0,8)}...</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(e.date).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>{e.feeType === 'Free' ? <span className="badge badge-success">Free</span> : <span className="badge" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--accent-secondary)' }}>₹{e.feeAmount}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
      
      {/* Admin Sidebar */}
      <div style={{ width: '260px', position: 'sticky', top: '90px' }}>
        <div style={{ padding: '0 1rem 1.5rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--error)' }}>
             <ShieldAlert size={24} />
             <h2 className="heading-md" style={{ fontSize: '1.25rem' }}>Admin Center</h2>
          </div>
          <p className="text-sm text-muted">Superuser privileges</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button onClick={() => setActiveTab('overview')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', textAlign: 'left', fontSize: '0.9375rem', background: activeTab === 'overview' ? 'var(--bg-hover)' : 'transparent', color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            <ShieldAlert size={18} /> Overview
          </button>
          <button onClick={() => setActiveTab('users')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', textAlign: 'left', fontSize: '0.9375rem', background: activeTab === 'users' ? 'var(--bg-hover)' : 'transparent', color: activeTab === 'users' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            <Users size={18} /> User Management
          </button>
          <button onClick={() => setActiveTab('events')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', textAlign: 'left', fontSize: '0.9375rem', background: activeTab === 'events' ? 'var(--bg-hover)' : 'transparent', color: activeTab === 'events' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            <Calendar size={18} /> Platform Events
          </button>
          <button onClick={() => alert('Notification service coming soon.')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', textAlign: 'left', fontSize: '0.9375rem', background: 'transparent', color: 'var(--text-secondary)' }}>
            <Bell size={18} /> Global Notifications
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsersList()}
        {activeTab === 'events' && renderEventsList()}
        
        {activeTab === 'overview' && (
             <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', background: 'rgba(87, 76, 0, 0.05)', border: '1px dashed var(--accent-primary)' }}>
                <h3 className="heading-md" style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>System Status</h3>
                <p className="text-secondary text-sm">All backend services are operating nominally in Mock Mode. Payment Gateways are simulated. Authentication is using Local Storage JWT mocks.</p>
             </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
