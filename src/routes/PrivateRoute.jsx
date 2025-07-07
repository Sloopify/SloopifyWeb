import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { clearToken } from '../utils/auth';
import API from '../axios/axios';

const VERIFY_Token_URL = '/api/v1/auth/verify-token';

const getValidToken = () => {
  const localData = localStorage.getItem('authToken');

  if (localData) {
    try {
      const { token, expiry } = JSON.parse(localData);
      const now = Date.now();
      const expiryMs = expiry < 1e12 ? expiry * 1000 : expiry;

      if (now < expiryMs) {
        return token;
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (e) {
      console.error('Failed to parse localStorage token:', e);
      localStorage.removeItem('authToken');
    }
  }

  return sessionStorage.getItem('authToken');
};

const PrivateRoute = () => {
  const token = getValidToken();
  const { userData } = useUser();
  const verifyAccount = userData?.verifyAccount;
  const interests = userData?.interests;
  const [isValidToken, setIsValidToken] = useState(null); // null = loading, true/false = result

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        await API.post(
          VERIFY_Token_URL,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsValidToken(true);
      } catch (err) {
        console.warn('Invalid or expired token. Logging out...');
        clearToken();
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  // Still verifying
  if (isValidToken === null) return null; // or loading spinner

  // Invalid token
  if (!token || !isValidToken) {
    return <Navigate to="/Auth/login" replace />;
  }

  // Not verified
  if (!verifyAccount) {
    return <Navigate to="/Auth/verify-account" replace />;
  }

  // Optional: enforce user to pick interests
  // if (!interests) {
  //   return <Navigate to="/user-info" replace />;
  // }

  return <Outlet />;
};

export default PrivateRoute;
