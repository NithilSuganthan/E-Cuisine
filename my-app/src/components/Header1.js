import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function Header() {
  const { user, logout, isAuthenticated, isAdmin } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header>
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" className="brand">E-Cuisine</Link>
          <Link to="/services">Meal Services</Link>
          {isAuthenticated && isAdmin && <Link to="/add-service">Add Service</Link>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">My Dashboard</Link>
              {isAdmin && <Link to="/admin" style={{ marginLeft: 12 }}>Admin Panel</Link>}
              <Link to="/subscriptions">My Subscriptions</Link>
              <button onClick={handleLogout} className="logout-button">
                Logout {user?.name}
              </button>
            </>
          ) : (
            <Link to="/login" className="login-button">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
