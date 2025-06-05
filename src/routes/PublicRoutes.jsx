// routes/PublicRoutes.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const getValidToken = () => {
  const stored = JSON.parse(localStorage.getItem("token"));
  if (stored) {
    try {
      const { token, expiry } = stored;
      const now = Date.now();
      const expiryMs = expiry < 1e12 ? expiry * 1000 : expiry;
      if (now < expiryMs) return token;
    } catch {}
  }
  return sessionStorage.getItem('authToken');
};

const PublicRoute = () => {
  const token = getValidToken();
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
