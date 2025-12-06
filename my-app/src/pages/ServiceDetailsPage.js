import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchServices } from '../services/api';
import ServiceDetails from './ServiceDetails';
import { useUser } from '../contexts/UserContext';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await fetchServices();
      const found = all.find(s => String(s.id) === String(id));
      setService(found || null);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!service) return <div style={{ padding: 20 }}>
    <h3>Service not found</h3>
    <Link to="/services">Back to services</Link>
  </div>;

  return (
    <div style={{ padding: 20 }}>
      <ServiceDetails service={service} />
    </div>
  );
}
