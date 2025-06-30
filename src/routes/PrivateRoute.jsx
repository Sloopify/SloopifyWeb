import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const getValidToken = () => {
  const localData = localStorage.getItem('authToken');

  if (localData) {
    try {
      const { token, expiry } = JSON.parse(localData);
      const now = Date.now();

      const expiryMs = expiry < 1e12 ? expiry * 1000 : expiry; // ensure ms
       
      if (now < expiryMs) {
         console.warn('Token here');
        return token;
        
      } else {
        console.warn('Token expired, clearing...');
        localStorage.removeItem('authToken');
      }
    } catch (e) {
      console.error('Failed to parse localStorage token:', e);
      localStorage.removeItem('authToken');
    }
  }

  const sessionToken = sessionStorage.getItem('authToken');
  if (sessionToken) {
    console.log('Using sessionStorage token');
  }

  return sessionToken;
};

const PrivateRoute = () => {
  const token = getValidToken();
   const { userData } = useUser();
  const location = useLocation();
  const verifyAccount = userData?.verifyAccount;
  const interests = userData?.interests;
   
  console.log('PrivateRoute: checking token...',userData);
  if (!token) {
    return <Navigate to="/Auth/login" replace />;
  }

  if (!verifyAccount) {
    return <Navigate to="/Auth/verify-account" replace />;
  }

  //  if (!interests) {
  //   return <Navigate to="/user-info" replace />;
  // }

  return <Outlet />;
};

export default PrivateRoute;
