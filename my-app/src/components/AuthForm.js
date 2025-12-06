import React, { useState } from 'react';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
        if (data.token) {
          setToken(data.token);
          // Store token in localStorage for future use
          localStorage.setItem('authToken', data.token);
        }
      } else {
        setMessage(data.message || 'An error occurred');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const testAuthToken = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMessage(JSON.stringify(data, null, 2));
    } catch (error) {
      setMessage('Error testing token: ' + error.message);
    }
  };

  return (
    <div className="auth-form" style={{ maxWidth: '400px', margin: '20px auto', padding: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={{ padding: '8px' }}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ padding: '8px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ padding: '8px' }}
        />
        {!isLogin && (
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ padding: '8px' }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button 
          type="submit"
          style={{ 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        style={{ 
          marginTop: '10px',
          padding: '8px',
          backgroundColor: 'transparent',
          border: '1px solid #007bff',
          color: '#007bff',
          cursor: 'pointer'
        }}
      >
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>

      {token && (
        <button
          onClick={testAuthToken}
          style={{ 
            marginTop: '10px',
            padding: '8px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Test Auth Token
        </button>
      )}

      {message && (
        <div 
          style={{ 
            marginTop: '20px', 
            padding: '10px', 
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}
        >
          <pre>{message}</pre>
        </div>
      )}
    </div>
  );
};

export default AuthForm;