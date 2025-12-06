import React, { useEffect, useState } from 'react';
import '../styles/AppStyles.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch('/api/admin/users', {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to fetch users');
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-users">
      <div className="admin-section-header">
        <h3>Manage Users</h3>
        <p className="section-description">View all registered users and their roles</p>
      </div>

      {loading && (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      )}

      {error && (
        <div className="admin-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="admin-empty">
          <span className="empty-icon">👤</span>
          <p>No users found</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className={`user-row role-${u.role}`}>
                  <td className="user-cell">
                    <div className="user-avatar">{u.username.charAt(0).toUpperCase()}</div>
                    <span className="user-name">{u.username}</span>
                  </td>
                  <td className="email-cell">{u.email}</td>
                  <td className="role-cell">
                    <span className={`role-badge role-${u.role}`}>
                      {u.role === 'admin' ? '👨‍💼 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(u.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <p>Total Users: <strong>{users.length}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
