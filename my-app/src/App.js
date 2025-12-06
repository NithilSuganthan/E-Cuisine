import './styles/AppStyles.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header1';
import Home from './pages/Home';
import MyDashboard from './pages/MyDashboard';
import Services from './pages/Services';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import AddService from './pages/AddService';
import MyServices from './pages/MyServices';
import SubscriptionDashboard from './pages/SubscriptionDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import EditService from './pages/EditService';
import { useUser } from './contexts/UserContext';

// Protected Route Component
const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    // Redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin only wrapper
const RequireAdmin = ({ children }) => {
  const { isAuthenticated, isAdmin } = useUser();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/admin/services/:id/edit" element={<RequireAdmin><EditService /></RequireAdmin>} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <RequireAuth><MyDashboard /></RequireAuth>
          } />
          <Route path="/add-service" element={
            <RequireAuth><AddService /></RequireAuth>
          } />
          <Route path="/my-services" element={
            <RequireAuth><MyServices /></RequireAuth>
          } />
          <Route path="/subscriptions" element={
            <RequireAuth><SubscriptionDashboard /></RequireAuth>
          } />
        </Routes>
      </main>
      <footer style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6' }}>
        © {new Date().getFullYear()} E-APP — local home-cooked meal subscriptions
      </footer>
    </Router>
  );
}

export default App;
