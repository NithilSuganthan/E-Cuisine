import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AppStyles.css';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/services');
        if (!res.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await res.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleEdit = (serviceId) => {
    navigate(`/admin/services/${serviceId}/edit`);
  };

  return (
    <div className="admin-services">
      <div className="admin-section-header">
        <h3>Manage Services</h3>
        <p className="section-description">View and manage all catering services</p>
      </div>

      {loading && (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading services...</p>
        </div>
      )}

      {error && (
        <div className="admin-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="admin-empty">
          <span className="empty-icon">📭</span>
          <p>No services found</p>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id || service._id} className="service-card-admin">
              <div className="service-card-header">
                <h4 className="service-name">{service.servicename}</h4>
                <span className="service-badge">{service.cuisinetype}</span>
              </div>

              <div className="service-card-body">
                <div className="service-meta-row">
                  <span className="meta-label">City:</span>
                  <span className="meta-value">{service.city}</span>
                </div>

                <div className="service-meta-row">
                  <span className="meta-label">Rating:</span>
                  <span className="meta-value stars">
                    {'⭐'.repeat(Math.floor(service.rating || 0))}
                  </span>
                </div>

                <div className="service-meta-row">
                  <span className="meta-label">Pricing:</span>
                  <span className="meta-value price">
                    ₹{service.pricing?.monthly || 0}/mo • ₹{service.pricing?.yearly || 0}/yr
                  </span>
                </div>

                <p className="service-description">
                  {service.description.substring(0, 100)}
                  {service.description.length > 100 ? '...' : ''}
                </p>

                <div className="service-times">
                  <div className="time-item">
                    <span className="time-label">Morning:</span>
                    <span>{service.deliveryTimes?.morning || '--'}</span>
                  </div>
                  <div className="time-item">
                    <span className="time-label">Lunch:</span>
                    <span>{service.deliveryTimes?.lunch || '--'}</span>
                  </div>
                  <div className="time-item">
                    <span className="time-label">Dinner:</span>
                    <span>{service.deliveryTimes?.dinner || '--'}</span>
                  </div>
                </div>

                {service.contact && (
                  <div className="service-contact">
                    <p><strong>Contact:</strong></p>
                    <p>📞 {service.contact.phone}</p>
                    <p>📧 {service.contact.email}</p>
                  </div>
                )}
              </div>

              <div className="service-card-actions">
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(service.id || service._id)}
                  title="Edit service details"
                >
                  ✎ Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServices;
