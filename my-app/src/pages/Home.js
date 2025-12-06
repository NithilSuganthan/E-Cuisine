import React, { useEffect, useState } from 'react';
import { fetchServices } from '../services/api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');

  useEffect(() => {
    async function load() {
      const data = await fetchServices();
      setServices(data);
    }
    load();
  }, []);

  const cities = ['all', ...new Set(services.map(s => s.city))];
  const cuisines = ['all', ...new Set(services.map(s => s.cuisinetype))];

  const filtered = services.filter(service => {
    const matchesSearch =
      service.servicename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || service.city === selectedCity;
    const matchesCuisine = selectedCuisine === 'all' || service.cuisinetype === selectedCuisine;
    return matchesSearch && matchesCity && matchesCuisine;
  });

  // Sample images for different cuisine types
  const getCuisineImage = (cuisineType) => {
    const images = {
      'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600',
      'South Indian': 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=600',
      'Chinese': 'https://images.unsplash.com/photo-1583577612013-4fecf7bf8f13?auto=format&fit=crop&q=80&w=600',
      'Continental': 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&q=80&w=600',
      'default': 'https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&q=80&w=600'
    };
    return images[cuisineType] || images.default;
  };

  return (
    <div className="page container">
      <div className="page-header">
        <h2>Fresh Home-Cooked Meals Delivered Daily</h2>
        <div className="search-filters">
          <input 
            type="text" 
            placeholder="Search services..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input"
          />
          <select 
            value={selectedCity} 
            onChange={e => setSelectedCity(e.target.value)}
            className="form-input"
          >
            {cities.map(city => (
              <option key={city} value={city}>
                {city === 'all' ? 'All Cities' : city}
              </option>
            ))}
          </select>
          <select 
            value={selectedCuisine} 
            onChange={e => setSelectedCuisine(e.target.value)}
            className="form-input"
          >
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>
                {cuisine === 'all' ? 'All Cuisines' : cuisine}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state service-card">
          <h3>No Services Found</h3>
          <p>Try adjusting your search filters or try a different cuisine type.</p>
        </div>
      ) : (
        <div className="services-grid">
          {filtered.map(service => (
            <article key={service.id} className="service-card">
              <div className="subscription-image">
                <img src={getCuisineImage(service.cuisinetype)} alt={service.servicename} />
                <span className="status-badge">
                  {service.cuisinetype}
                </span>
              </div>
              
              <div className="subscription-content">
                <div className="subscription-header">
                  <h3>{service.servicename}</h3>
                  <div className="price-badge">₹{service.pricing?.monthly ?? service.monthlyprice}</div>
                </div>

                <div className="subscription-details">
                  <div className="detail-row">
                    <span>Location:</span>
                    <strong>{service.city}</strong>
                  </div>
                  <div className="detail-row address">
                    <span>About:</span>
                    <strong>{service.description}</strong>
                  </div>
                </div>

                <div className="subscription-actions">
                  <Link to={`/services/${service.id}`} className="btn secondary">View Details</Link>
                  <Link to={`/services/${service.id}`} className="btn primary">Subscribe</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
