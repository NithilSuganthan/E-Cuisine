import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AppStyles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccess('');
    const newFieldErrors = {};

    // Validate all fields
    if (!formData.username.trim()) {
      newFieldErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newFieldErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newFieldErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newFieldErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newFieldErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newFieldErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newFieldErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newFieldErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setError('Please fix the errors below');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1>Create Your Account</h1>
          <p className="register-subtitle">Join E-Cuisine for delicious home-cooked meals</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <div className="form-group">
            <label htmlFor="username">
              <span className="label-text">Username</span>
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a unique username"
              className={fieldErrors.username ? 'input-error' : ''}
              disabled={loading}
            />
            {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <span className="label-text">Email Address</span>
              <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={fieldErrors.email ? 'input-error' : ''}
              disabled={loading}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-text">Password</span>
              <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className={fieldErrors.password ? 'input-error' : ''}
              disabled={loading}
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            <span className="password-hint">Use a mix of letters, numbers, and symbols for security</span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <span className="label-text">Confirm Password</span>
              <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={fieldErrors.confirmPassword ? 'input-error' : ''}
              disabled={loading}
            />
            {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <span className="label-text">Account Type</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="role-select"
            >
              <option value="user">Regular User (order meals)</option>
              <option value="admin">Admin (manage services)</option>
            </select>
            <span className="role-hint">
              {formData.role === 'admin' 
                ? 'Admin accounts can create and manage catering services'
                : 'Regular users can browse and subscribe to catering services'}
            </span>
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="register-divider">or</div>

          <p className="login-link">
            Already have an account? 
            <button 
              type="button" 
              onClick={() => navigate('/login')} 
              className="link-button"
              disabled={loading}
            >
              Sign in here
            </button>
          </p>
        </form>

        <div className="register-footer">
          <p className="footer-text">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;