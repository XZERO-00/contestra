import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Users, User, CreditCard, CheckCircle, Smartphone } from 'lucide-react';

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, registerForEvent } = useEvents();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Registration Form State
  const [regType, setRegType] = useState('Individual'); // Individual | Team
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState('2');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Payment State
  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI | Card | NetBanking
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle | processing | success | failed

  useEffect(() => {
    const foundEvent = getEventById(id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
    setLoading(false);
  }, [id, getEventById]);

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (event.feeType === 'Free') {
        // Skip payment for free events
        completeRegistration();
    } else {
        setPaymentStep(true);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setPaymentStatus('processing');
    
    // Simulate payment gateway
    setTimeout(() => {
      // 90% success rate simulation
      if (Math.random() > 0.1) {
        setPaymentStatus('success');
        setTimeout(() => completeRegistration(), 1500);
      } else {
        setPaymentStatus('failed');
      }
    }, 2000);
  };

  const completeRegistration = async () => {
      const regData = {
          regType,
          teamName: regType === 'Team' ? teamName : null,
          teamSize: regType === 'Team' ? parseInt(teamSize, 10) : 1,
          additionalInfo
      };
      
      const success = await registerForEvent(id, regData);
      if (success) {
          navigate('/participant', { state: { message: 'Registration successful!' }});
      } else {
          setPaymentStatus('failed'); // Flag as failed if limits reached or db error
      }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;
  if (!event) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Event Not Found</div>;

  return (
    <div className="page-mount-fade container" style={{ padding: '3rem 0', maxWidth: '800px' }}>
      <Link to={`/participant/event/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Event
      </Link>

      <div className="glass-panel" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-light)' }}>
            <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Register for {event.name}</h1>
            <p className="text-muted">Complete your registration details below.</p>
        </div>

        {event.status === 'Paused' || event.status === 'Closed' ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--error-bg)', borderRadius: 'var(--radius-md)', color: 'var(--error)' }}>
                <h3 className="heading-md" style={{ marginBottom: '0.5rem' }}>Registration Closed</h3>
                <p>This event is not currently accepting new registrations.</p>
            </div>
        ) : !paymentStep ? (
            <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div 
                        onClick={() => setRegType('Individual')}
                        style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', border: regType === 'Individual' ? '2px solid var(--accent-primary)' : '2px solid var(--border-light)', background: regType === 'Individual' ? 'rgba(87, 76, 0, 0.05)' : 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                    >
                        <User size={24} color={regType === 'Individual' ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                        <span style={{ fontWeight: 500, color: regType === 'Individual' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Individual</span>
                    </div>
                    <div 
                        onClick={() => setRegType('Team')}
                        style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', border: regType === 'Team' ? '2px solid var(--accent-primary)' : '2px solid var(--border-light)', background: regType === 'Team' ? 'rgba(87, 76, 0, 0.05)' : 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                    >
                        <Users size={24} color={regType === 'Team' ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                        <span style={{ fontWeight: 500, color: regType === 'Team' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Team</span>
                    </div>
                </div>

                {regType === 'Team' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Team Name</label>
                            <input type="text" className="input-field" placeholder="Awesome Team" value={teamName} onChange={e => setTeamName(e.target.value)} required />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label className="input-label">Team Size</label>
                            <input type="number" className="input-field" min="2" max="10" value={teamSize} onChange={e => setTeamSize(e.target.value)} required />
                        </div>
                    </div>
                )}

                <div className="input-group">
                    <label className="input-label">Additional Information / Requirements</label>
                    <textarea className="input-field" rows="3" placeholder="Any dietary restrictions, accessibility needs, or comments?" value={additionalInfo} onChange={e => setAdditionalInfo(e.target.value)} />
                </div>

                <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p className="text-muted text-sm">Total Payable</p>
                        <p className="heading-md" style={{ color: event.feeType === 'Free' ? 'var(--success)' : 'var(--text-primary)' }}>
                            {event.feeType === 'Free' ? 'Free' : `₹${event.feeAmount}`}
                        </p>
                    </div>
                    <button type="submit" className="btn btn-brand" style={{ padding: '0.875rem 2rem' }}>
                        {event.feeType === 'Free' ? 'Complete Registration' : 'Proceed to Payment'}
                    </button>
                </div>
            </form>
        ) : (
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-secondary)', borderRadius: '50%', marginBottom: '1rem' }}>
                        <CreditCard size={32} />
                    </div>
                    <h2 className="heading-md">Payment Gateway</h2>
                    <p className="text-muted" style={{ marginTop: '0.5rem' }}>Total Amount: <strong>₹{event.feeAmount}</strong></p>
                </div>

                {paymentStatus === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
                        <CheckCircle size={48} style={{ margin: '0 auto 1rem auto' }} />
                        <h3 className="heading-md" style={{ color: 'var(--success)' }}>Payment Successful!</h3>
                        <p style={{ marginTop: '0.5rem' }}>Redirecting to dashboard...</p>
                    </div>
                ) : (
                    <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {paymentStatus === 'failed' && (
                            <div style={{ padding: '1rem', background: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '0.875rem' }}>
                                Payment failed. Please try again.
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="input-label">Select Payment Method</label>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: paymentMethod === 'UPI' ? 'var(--bg-tertiary)' : 'transparent' }}>
                                <input type="radio" name="payment" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                                <Smartphone size={18} /> UPI (GPay, PhonePe, Paytm)
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: paymentMethod === 'Card' ? 'var(--bg-tertiary)' : 'transparent' }}>
                                <input type="radio" name="payment" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} />
                                <CreditCard size={18} /> Credit / Debit Card
                            </label>
                        </div>

                        {paymentMethod === 'UPI' && (
                            <div className="input-group">
                                <input type="text" className="input-field" placeholder="Enter UPI ID (e.g. user@okhdfc)" required />
                            </div>
                        )}

                        {paymentMethod === 'Card' && (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <input type="text" className="input-field" placeholder="Card Number" required />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input type="text" className="input-field" placeholder="MM/YY" required />
                                    <input type="text" className="input-field" placeholder="CVV" required />
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-brand" 
                            style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
                            disabled={paymentStatus === 'processing'}
                        >
                            {paymentStatus === 'processing' ? 'Processing...' : `Pay ₹${event.feeAmount}`}
                        </button>
                        
                        <button type="button" onClick={() => setPaymentStep(false)} className="btn btn-secondary" style={{ width: '100%' }} disabled={paymentStatus === 'processing'}>
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistration;
