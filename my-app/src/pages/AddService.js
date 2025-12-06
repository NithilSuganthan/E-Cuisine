import React, { useState } from 'react';
import { createService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddService() {
  const initialForm = {
    servicename: '',
    description: '',
    city: '',
    cuisinetype: '',
    monthlyprice: '',
    yearlyprice: '',
    deliveryTimes: {
      morning: '',
      lunch: '',
      dinner: ''
    },
    contact: {
      phone: '',
      email: ''
    }
  };

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      deliveryTimes: {
        ...prev.deliveryTimes,
        [name]: value
      }
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
        (async () => {
      // call mock API create
      try {
        const payload = {
          servicename: form.servicename,
          description: form.description,
          city: form.city,
          cuisinetype: form.cuisinetype,
          monthlyprice: form.monthlyprice,
          yearlyprice: form.yearlyprice,
          deliveryTimes: form.deliveryTimes,
          contact: form.contact
        };
        const created = await createService(payload);
        setMessage('Service created — redirecting to services list...');
        // small delay so user sees feedback
        setTimeout(() => navigate('/services'), 800);
      } catch (err) {
        setMessage('Failed to create service — try again.');
      }
    })();
  };

  const handleReset = () => {
    setForm(initialForm);
    setMessage('');
  };

  return (
    <div className="add-service-page">
      <div className="page-header">
        <h2>Add New Meal Service</h2>
        <p className="page-description">Create a new catering service to offer delicious meal subscriptions to students</p>
      </div>

      <div className="preview-and-form">
        <aside className="service-preview" aria-hidden={false}>
          <div className="preview-banner">
            <div className="preview-title">{form.servicename || 'Your service name'}</div>
            <div className="preview-badge">{form.monthlyprice ? `₹${form.monthlyprice}/mo` : 'Price'}</div>
          </div>
          <div className="preview-body">
            <div className="preview-meta">
              <span className="preview-city">{form.city || 'City'}</span>
              <span className="preview-cuisine">{form.cuisinetype || 'Cuisine'}</span>
            </div>
            <p className="preview-description">{form.description ? (form.description.length > 120 ? form.description.slice(0,120) + '…' : form.description) : 'A short description appears here as you type.'}</p>

            <div className="preview-times">
              <div><strong>Morning:</strong> {form.deliveryTimes.morning || '--'}</div>
              <div><strong>Lunch:</strong> {form.deliveryTimes.lunch || '--'}</div>
              <div><strong>Dinner:</strong> {form.deliveryTimes.dinner || '--'}</div>
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="add-service-form">
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
          <div className="form-grid">
          <div className="form-group">
              <label className="form-label">Service Name <span className="required">*</span></label>
            <input 
              name="servicename" 
              value={form.servicename} 
              onChange={handleChange}
              placeholder="e.g., Homely Meals"
              required 
              className="form-input"
            />
          </div>

          <div className="form-group">
              <label className="form-label">City <span className="required">*</span></label>
            <input 
              name="city" 
              value={form.city} 
              onChange={handleChange}
              placeholder="e.g., Chennai"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
              <label className="form-label">Cuisine Type <span className="required">*</span></label>
            <select 
              name="cuisinetype" 
              value={form.cuisinetype} 
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select cuisine...</option>
              <option value="South Indian">South Indian</option>
              <option value="North Indian">North Indian</option>
              <option value="Mixed">Mixed</option>
              <option value="Vegetarian">Vegetarian</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description <span className="required">*</span></label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange}
            placeholder="Describe your meal service, specialties, and what makes it perfect for students..."
            required
            className="form-input"
            rows={3}
          />
        </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Delivery Schedule</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Morning Delivery <span className="required">*</span></label>
              <input 
                type="text"
                name="morning" 
                value={form.deliveryTimes.morning} 
                onChange={handleDeliveryChange}
                placeholder="e.g., 7:00 - 8:30"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Lunch Delivery <span className="required">*</span></label>
              <input 
                type="text"
                name="lunch" 
                value={form.deliveryTimes.lunch} 
                onChange={handleDeliveryChange}
                placeholder="e.g., 12:00 - 13:30"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Dinner Delivery <span className="required">*</span></label>
              <input 
                type="text"
                name="dinner" 
                value={form.deliveryTimes.dinner} 
                onChange={handleDeliveryChange}
                placeholder="e.g., 19:00 - 20:30"
                required
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Pricing</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Monthly Price (₹) <span className="required">*</span></label>
              <input 
                type="number"
                name="monthlyprice" 
                value={form.monthlyprice} 
                onChange={handleChange}
                placeholder="e.g., 3500"
                required
                min="0"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Yearly Price (₹) <span className="required">*</span></label>
              <input 
                type="number"
                name="yearlyprice" 
                value={form.yearlyprice} 
                onChange={handleChange}
                placeholder="e.g., 38000"
                required
                min="0"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Contact Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Contact Phone <span className="required">*</span></label>
              <input
                type="tel"
                name="phone"
                value={form.contact.phone}
                onChange={handleContactChange}
                placeholder="+91-9876543210"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={form.contact.email}
                onChange={handleContactChange}
                placeholder="contact@example.com"
                required
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleReset}>Reset Form</button>
          <button type="submit" className="btn-primary">Create Service</button>
        </div>
        </form>
      </div>
      {message && (
        <div className="alert-success">
          {message}
        </div>
      )}
    </div>
  );
}