import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('authToken');

  return token ? <Outlet /> : <Navigate to="/Auth/login" replace />;
};
const getValidToken = () => {
  const stored = localStorage.getItem('authToken');

  if (stored) {
    const { token, expiry } = JSON.parse(stored);
    if (new Date().getTime() < expiry) {
      return token;
    } else {
      localStorage.removeItem('authToken');
    }
  }

  return sessionStorage.getItem('authToken');
};

export default PrivateRoute;
