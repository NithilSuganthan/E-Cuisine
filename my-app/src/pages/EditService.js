import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getServiceById, updateService } from '../services/api';
import '../styles/AppStyles.css';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await getServiceById(id);
        if (mounted) setService(s);
      } catch (err) {
        setError('Failed to load service');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="page container"><p>Loading...</p></div>;
  if (!service) return <div className="page container"><p>Service not found</p></div>;

  const handleChange = (field, value) => {
    setService(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (path, value) => {
    const keys = path.split('.');
    setService(prev => {
      const copy = { ...prev };
      let cur = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        cur[k] = { ...(cur[k] || {}) };
        cur = cur[k];
      }
      cur[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const toArray = (str) => {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  const fromArray = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        servicename: service.servicename,
        description: service.description,
        city: service.city,
        cuisinetype: service.cuisinetype,
        rating: Number(service.rating) || 0,
        pricing: { monthly: Number(service.pricing?.monthly || 0), yearly: Number(service.pricing?.yearly || 0) },
        deliveryTimes: {
          morning: service.deliveryTimes?.morning || '',
          lunch: service.deliveryTimes?.lunch || '',
          dinner: service.deliveryTimes?.dinner || ''
        },
        menu: {
          morning: toArray(service.menu?.morningString || fromArray(service.menu?.morning)),
          lunch: toArray(service.menu?.lunchString || fromArray(service.menu?.lunch)),
          dinner: toArray(service.menu?.dinnerString || fromArray(service.menu?.dinner))
        },
        contact: {
          phone: service.contact?.phone || '',
          email: service.contact?.email || ''
        }
      };

      const res = await updateService(id, payload);
      if (!res || res.success === false) {
        throw new Error(res && res.message ? res.message : 'Update failed');
      }

      // Navigate back to service details
      navigate(`/services/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-service-page">
      <div className="page container">
        <h2>Edit Service: {service.servicename}</h2>
        {error && <div className="error-message">{error}</div>}
        <form className="edit-service-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Service name</label>
          <input value={service.servicename || ''} onChange={e => handleChange('servicename', e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={service.description || ''} onChange={e => handleChange('description', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input value={service.city || ''} onChange={e => handleChange('city', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Cuisine type</label>
            <input value={service.cuisinetype || ''} onChange={e => handleChange('cuisinetype', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Rating</label>
            <input type="number" step="0.1" value={service.rating || 0} onChange={e => handleChange('rating', e.target.value)} />
          </div>
        </div>

        <h4>Pricing</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Monthly</label>
            <input type="number" value={service.pricing?.monthly || 0} onChange={e => handleNestedChange('pricing.monthly', Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Yearly</label>
            <input type="number" value={service.pricing?.yearly || 0} onChange={e => handleNestedChange('pricing.yearly', Number(e.target.value))} />
          </div>
        </div>

        <h4>Delivery Times</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Morning</label>
            <input value={service.deliveryTimes?.morning || ''} onChange={e => handleNestedChange('deliveryTimes.morning', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Lunch</label>
            <input value={service.deliveryTimes?.lunch || ''} onChange={e => handleNestedChange('deliveryTimes.lunch', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Dinner</label>
            <input value={service.deliveryTimes?.dinner || ''} onChange={e => handleNestedChange('deliveryTimes.dinner', e.target.value)} />
          </div>
        </div>

        <h4>Menu (comma separated)</h4>
        <div className="form-group">
          <label>Morning</label>
          <input value={service.menu?.morningString ?? fromArray(service.menu?.morning)} onChange={e => setService(prev => ({ ...prev, menu: { ...prev.menu, morningString: e.target.value } }))} />
        </div>
        <div className="form-group">
          <label>Lunch</label>
          <input value={service.menu?.lunchString ?? fromArray(service.menu?.lunch)} onChange={e => setService(prev => ({ ...prev, menu: { ...prev.menu, lunchString: e.target.value } }))} />
        </div>
        <div className="form-group">
          <label>Dinner</label>
          <input value={service.menu?.dinnerString ?? fromArray(service.menu?.dinner)} onChange={e => setService(prev => ({ ...prev, menu: { ...prev.menu, dinnerString: e.target.value } }))} />
        </div>

        <h4>Contact</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Phone</label>
            <input value={service.contact?.phone || ''} onChange={e => handleNestedChange('contact.phone', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={service.contact?.email || ''} onChange={e => handleNestedChange('contact.email', e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
          <button className="btn" type="button" onClick={() => navigate(-1)} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </form>
      </div>
    </div>
  );
}
