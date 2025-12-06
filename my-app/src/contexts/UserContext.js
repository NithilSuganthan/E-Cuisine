import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, logoutUser } from '../services/auth';

export const UserContext = createContext();

// Custom hook for using the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (userData) => {
    if (!userData) {
      throw new Error('User data is required for login');
    }

    const userObj = {
      ...userData,
      isAuthenticated: true
    };
    setUser(userObj);
    return userObj;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const isAuthenticated = user?.isAuthenticated === true;
  const isAdmin = user?.role === 'admin';

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};
