import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services/api';
import { useUser } from '../contexts/UserContext';
import PaymentQR from './PaymentQR';
import '../styles/AppStyles.css';

export default function ServiceDetails({ service }) {
  const navigate = useNavigate();
  const { isAdmin } = useUser();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [subscriptionType, setSubscriptionType] = useState('Monthly');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const getAmount = () => {
    return subscriptionType === 'Monthly' ? service.pricing.monthly : service.pricing.yearly;
  };

  const handleBook = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    const details = { name: 'PG Student', email: 'student@campus.example' };
    const result = await bookService(service.id, details, subscriptionType);
    setLoading(false);
    setShowPayment(false);
    if (result.success) {
      setFeedback(`Subscription successful! ID: ${result.bookingId}`);
    } else {
      setFeedback('Subscription failed. Please try again later.');
    }
  };

  const cuisineImages = {
    'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    'South Indian': 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=800',
    'Hyderabadi': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800',
    'Mixed': 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&q=80&w=800',
    'Vegetarian': 'https://images.unsplash.com/photo-1598449426314-8b02525e8733?auto=format&fit=crop&q=80&w=800',
  };

  return (
    <div className="page container">
      <div className="service-hero">
        <img 
          src={cuisineImages[service.cuisinetype] || cuisineImages.Mixed}
          alt={service.cuisinetype}
          className="service-banner"
        />
        <div className="service-hero-content">
          <div className="service-header">
            <div className="service-title-row">
              <h1>{service.servicename}</h1>
              {isAdmin && (
                <button 
                  className="edit-service-btn"
                  onClick={() => navigate(`/admin/services/${service.id}/edit`)}
                  title="Edit service details (admin)"
                >
                  <span className="edit-icon">✎</span>
                  <span className="edit-text">Edit Service</span>
                </button>
              )}
            </div>
            <div className="service-meta">
              <div className="rating">
                <span className="stars">{'★'.repeat(Math.floor(service.rating))}</span>
                <span className="rating-value">{service.rating}</span>
              </div>
              <div className="meta-details">
                <span className="city">{service.city}</span>
                <span className="divider">•</span>
                <span className="cuisine">{service.cuisinetype}</span>
              </div>
            </div>
          </div>
          <p className="service-description">{service.description}</p>
        </div>
      </div>

      <div className="service-content">
        <div className="content-grid">
          <div className="info-section delivery-info">
            <h3>Delivery Schedule</h3>
            <div className="schedule-grid">
              <div className="schedule-card">
                <span className="time-label">Morning</span>
                <strong className="time-value">{service.deliveryTimes.morning}</strong>
              </div>
              <div className="schedule-card">
                <span className="time-label">Lunch</span>
                <strong className="time-value">{service.deliveryTimes.lunch}</strong>
              </div>
              <div className="schedule-card">
                <span className="time-label">Dinner</span>
                <strong className="time-value">{service.deliveryTimes.dinner}</strong>
              </div>
            </div>
          </div>

          <div className="info-section pricing-info">
            <h3>Subscription Plans</h3>
            <div className="plan-options">
              <div className={`plan-card ${subscriptionType === 'Monthly' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="subtype" 
                  id="monthly"
                  value="Monthly" 
                  checked={subscriptionType === 'Monthly'} 
                  onChange={() => setSubscriptionType('Monthly')}
                />
                <label htmlFor="monthly">
                  <span className="plan-name">Monthly</span>
                  <span className="plan-price">₹{service.pricing.monthly}</span>
                  <span className="plan-period">/month</span>
                </label>
              </div>
              <div className={`plan-card ${subscriptionType === 'Yearly' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="subtype" 
                  id="yearly"
                  value="Yearly" 
                  checked={subscriptionType === 'Yearly'} 
                  onChange={() => setSubscriptionType('Yearly')}
                />
                <label htmlFor="yearly">
                  <span className="plan-name">Yearly</span>
                  <span className="plan-price">₹{service.pricing.yearly}</span>
                  <span className="plan-period">/year</span>
                  <span className="savings">Save ₹{(service.pricing.monthly * 12) - service.pricing.yearly}</span>
                </label>
              </div>
            </div>
            <button 
              className="btn primary subscribe-btn" 
              onClick={handleBook} 
              disabled={loading}
            >
              {loading ? 'Processing...' : `Subscribe Now`}
            </button>
            {feedback && (
              <div className="alert success">
                {feedback}
              </div>
            )}
          </div>
        </div>

        <div className="info-section menu-section">
          <h3>Weekly Menu</h3>
          <div className="menu-grid">
            <div className="menu-card">
              <div className="meal-time">Breakfast</div>
              <ul className="meal-list">
                {service.menu.morning.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="menu-card">
              <div className="meal-time">Lunch</div>
              <ul className="meal-list">
                {service.menu.lunch.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="menu-card">
              <div className="meal-time">Dinner</div>
              <ul className="meal-list">
                {service.menu.dinner.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="info-section contact-section">
          <h3>Contact Information</h3>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <span className="contact-value">{service.contact.phone}</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">{service.contact.email}</span>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentQR
          amount={getAmount()}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
          serviceDetails={service}
        />
      )}
    </div>
  );
}

