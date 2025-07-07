// routes/PublicRoutes.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

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
  const location = useLocation();
  const {userData} = useUser();
  const isVerifyPage = location.pathname === '/Auth/verify-account';

  if (token && userData?.verifyAccount && !isVerifyPage && userData?.interests && userData?.gender  && userData?.birthday && userData?.image) {
    return <Navigate to="/" replace />;
  }

  
  return <Outlet />;
};

export default PublicRoute;
