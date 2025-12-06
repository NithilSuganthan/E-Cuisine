import React, { useState } from 'react';
import AdminUsers from './AdminUsers';
import AdminServices from './AdminServices';
import '../styles/AppStyles.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Manage users and catering services</p>
      </div>

      <div className="admin-tabs-container">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="tab-icon">👥</span>
            <span className="tab-label">Users</span>
          </button>
          <button
            className={`admin-tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <span className="tab-icon">🍽️</span>
            <span className="tab-label">Services</span>
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'services' && <AdminServices />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
