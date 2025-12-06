import React from 'react';
import { Link } from 'react-router-dom';

export default function SubscriptionDashboard() {
  // Mock subscriptions with more details and image URLs
  const subscriptions = [
    {
      id: 9001,
      service: 'Homely Meals',
      status: 'Active',
      nextBilling: '2025-12-01',
      image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&q=80&w=300',
      plan: 'Monthly',
      amount: 3500,
      mealPreferences: 'Vegetarian',
      deliveryAddress: 'Room 304, Block B, Student Housing'
    },
    {
      id: 9002,
      service: 'NorthFlavors',
      status: 'Active',
      nextBilling: '2026-10-15',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300',
      plan: 'Yearly',
      amount: 45000,
      mealPreferences: 'Non-Vegetarian',
      deliveryAddress: 'Room 207, Block A, Student Housing'
    }
  ];

  return (
    <div className="page container" style={{ padding: 20 }}>
      <div className="page-header">
        <h2>My Subscriptions</h2>
        <Link to="/services" className="btn primary">Browse More Services</Link>
      </div>

      {subscriptions.length === 0 ? (
        <div className="empty-state service-card">
          <h3>No Active Subscriptions</h3>
          <p>You haven't subscribed to any meal services yet.</p>
          <Link to="/services" className="btn primary">Browse Services</Link>
        </div>
      ) : (
        <div className="subscriptions-grid">
          {subscriptions.map(sub => (
            <article key={sub.id} className="service-card subscription-card">
              <div className="subscription-image">
                <img src={sub.image} alt={sub.service} />
                <span className={`status-badge ${sub.status.toLowerCase()}`}>
                  {sub.status}
                </span>
              </div>

              <div className="subscription-content">
                <div className="subscription-header">
                  <h3>{sub.service}</h3>
                  <div className="price-badge alt">₹{sub.amount}</div>
                </div>

                <div className="subscription-details">
                  <div className="detail-row">
                    <span>Plan:</span>
                    <strong>{sub.plan}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Next Billing:</span>
                    <strong>{sub.nextBilling}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Preferences:</span>
                    <strong>{sub.mealPreferences}</strong>
                  </div>
                  <div className="detail-row address">
                    <span>Delivery:</span>
                    <strong>{sub.deliveryAddress}</strong>
                  </div>
                </div>

                <div className="subscription-actions">
                  <button className="btn secondary">Pause Subscription</button>
                  <button className="btn danger">Cancel</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
