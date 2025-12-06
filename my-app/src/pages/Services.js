import React, { useEffect, useState } from 'react';
import { fetchServices } from '../services/api';
import { Link } from 'react-router-dom';

export default function Services() {
  const [services, setServices] = useState([]);
  useEffect(() => {
    async function load() {
      const data = await fetchServices();
      setServices(data);
    }
    load();
  }, []);

  return (
    <div className="page container services-page">
      <div className="page-header">
        <h2>Premium Meal Services</h2>
        <p className="page-description">Discover curated catering services that deliver fresh, delicious meals right to your doorstep</p>
      </div>

      <div className="services-grid">
        {services.map(s => (
          <article key={s.id} className="service-card">
            <div className="card-head">
              <div className="service-info">
                <h3 className="service-name">{s.servicename}</h3>
                <div className="service-meta">
                  <span className="location">{s.city}</span>
                  <span className="cuisine-type">{s.cuisinetype}</span>
                </div>
              </div>
              <div className="service-pricing">
                <div className="price-badge">₹{s.pricing.monthly}/mo</div>
                <div className="rating">
                  <span className="stars">{'★'.repeat(Math.floor(s.rating))}</span>
                  <span className="rating-value">{s.rating}</span>
                </div>
              </div>
            </div>

            <p className="service-description">{s.description}</p>

            <div className="delivery-times">
              <div className="time-slots">
                <div className="time-slot">
                  <span className="slot-label">Morning</span>
                  <span className="slot-time">{s.deliveryTimes.morning}</span>
                </div>
                <div className="time-slot">
                  <span className="slot-label">Lunch</span>
                  <span className="slot-time">{s.deliveryTimes.lunch}</span>
                </div>
                <div className="time-slot">
                  <span className="slot-label">Dinner</span>
                  <span className="slot-time">{s.deliveryTimes.dinner}</span>
                </div>
              </div>
              <div className="card-actions">
                <Link to={`/services/${s.id}`} className="btn-secondary">View Details</Link>
                <Link to="/subscriptions" className="btn-primary">Subscribe Now</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
