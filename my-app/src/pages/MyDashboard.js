import React, { useEffect, useState } from 'react';
import { getServiceById } from '../services/api';
import { Link } from 'react-router-dom';

export default function MyDashboard() {
  // Mock user bookings referencing service ids. In a real app pull from user API.
  const [bookings, setBookings] = useState([
    { id: 101, serviceId: '1', status: 'Active', start: '2025-11-01', subscriptionType: 'Monthly' },
    { id: 102, serviceId: '3', status: 'Active', start: '2025-10-15', subscriptionType: 'Yearly' }
  ]);
  const [detailed, setDetailed] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(null); // id of booking whose menu is open

  useEffect(() => {
    async function loadDetails() {
      // For each booking, fetch service details to show full information
      const result = await Promise.all(bookings.map(async (b) => {
        const svc = await getServiceById(b.serviceId);
        return { ...b, service: svc };
      }));
      setDetailed(result);
    }
    loadDetails();
  }, [bookings]);

  // Cancel a subscription (mock). Confirms with user and updates local state.
  async function handleCancel(bookingId) {
    const ok = window.confirm('Are you sure you want to cancel this subscription?');
    if (!ok) return;
    // Simulate server latency
    try {
      await new Promise(r => setTimeout(r, 350));
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      setDetailed(prev => prev.filter(d => d.id !== bookingId));
      if (menuOpen === bookingId) setMenuOpen(null);
    } catch (err) {
      // in a real app show an error toast
      console.error('Cancel failed', err);
      alert('Failed to cancel subscription. Please try again.');
    }
  }

  const cuisineImages = {
    'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300',
    'South Indian': 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300',
    'default': 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&q=80&w=300'
  };

  return (
    <div className="page container">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h2>Welcome Back!</h2>
          <p>Manage your meal subscriptions and track your deliveries</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/services" className="btn primary">Browse More Services</Link>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          Active Subscriptions
        </button>
      </div>

      {detailed.length === 0 ? (
        <div className="empty-state service-card">
          <h3>No Active Subscriptions</h3>
          <p>You haven't subscribed to any meal services yet. Browse our services to get started!</p>
          <Link to="/services" className="btn primary">Browse Services</Link>
        </div>
      ) : (
        <div className="dashboard-content">
          {activeTab === 'overview' ? (
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-value">{detailed.length}</div>
                <div className="stat-label">Active Subscriptions</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">₹{detailed.reduce((acc, curr) => 
                  acc + (curr.service?.pricing?.[curr.subscriptionType.toLowerCase()] || 0), 0)
                }</div>
                <div className="stat-label">Total Monthly Spend</div>
              </div>
            </div>
          ) : null}
          
          <div className="subscriptions-grid dashboard-subscriptions">
            {detailed.map(b => (
              <article key={b.id} className="service-card subscription-card">
                <div className="subscription-image">
                  <img 
                    src={cuisineImages[b.service?.cuisinetype] || cuisineImages.default}
                    alt={b.service?.servicename} 
                  />
                  <span className={`status-badge ${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </div>

                <div className="subscription-content">
                  <div className="subscription-header">
                    <h3>{b.service?.servicename}</h3>
                    <div className="price-badge">
                      ₹{b.service?.pricing?.[b.subscriptionType.toLowerCase()]}
                    </div>
                  </div>

                  <div className="subscription-details">
                    <div className="detail-row">
                      <span>Plan Type:</span>
                      <strong>{b.subscriptionType}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Cuisine:</span>
                      <strong>{b.service?.cuisinetype}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Started:</span>
                      <strong>{b.start}</strong>
                    </div>

                    <div className="delivery-schedule">
                      <h4>Delivery Schedule</h4>
                      <div className="schedule-grid">
                        <div className="schedule-item">
                          <span>Morning</span>
                          <strong>{b.service?.deliveryTimes?.morning}</strong>
                        </div>
                        <div className="schedule-item">
                          <span>Lunch</span>
                          <strong>{b.service?.deliveryTimes?.lunch}</strong>
                        </div>
                        <div className="schedule-item">
                          <span>Dinner</span>
                          <strong>{b.service?.deliveryTimes?.dinner}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="contact-info">
                      <h4>Contact</h4>
                      <p>{b.service?.contact?.phone} • {b.service?.contact?.email}</p>
                    </div>
                  </div>

                  <div className="subscription-actions">
                    <button className="btn secondary" onClick={() => setMenuOpen(b.id)}>View Menu</button>
                    <button className="btn danger" onClick={() => handleCancel(b.id)}>Cancel</button>
                  </div>
                  {/* Unique Menu Modal */}
                  {menuOpen === b.id && (() => {
                    const booking = detailed.find(bk => bk.id === menuOpen);
                    if (!booking) return null;
                    const menu = booking.service?.menu || {};
                    return (
                      <div className="menu-modal-overlay" onClick={() => setMenuOpen(null)}>
                        <div className="menu-modal-content" onClick={e => e.stopPropagation()}>
                          <div className="menu-modal-header">
                            <h3>🍽️ Weekly Menu for {booking.service?.servicename}</h3>
                            <button className="menu-modal-close" onClick={() => setMenuOpen(null)}>&times;</button>
                          </div>
                          <div className="menu-modal-section">
                            <div className="menu-meal-title">🥞 Breakfast</div>
                            <ul className="menu-meal-list">{(menu.morning || []).map((item, i) => <li key={i}>{item}</li>)}</ul>
                          </div>
                          <div className="menu-modal-section">
                            <div className="menu-meal-title">🍛 Lunch</div>
                            <ul className="menu-meal-list">{(menu.lunch || []).map((item, i) => <li key={i}>{item}</li>)}</ul>
                          </div>
                          <div className="menu-modal-section">
                            <div className="menu-meal-title">🍽️ Dinner</div>
                            <ul className="menu-meal-list">{(menu.dinner || []).map((item, i) => <li key={i}>{item}</li>)}</ul>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
