import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { clearToken } from '../utils/auth';
import API from '../axios/axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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
  const { userData, setUserData } = useUser();
  const [isValidToken, setIsValidToken] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        const response = await API.post(
          VERIFY_Token_URL,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { user, completed_on_boarding } = response.data.data;

        setUserData({
          ...userData,
          ...user,
          verifyAccount: user.email_verified,
          interests:  completed_on_boarding?.interests || false,
          userGender: user?.gender || "",
          userBirthday: user?.birthday || "",
          profileImage: user?.image || "",
        });

        setOnboardingStatus(completed_on_boarding || {});
        setIsValidToken(true);
           console.log('userdata on instanceof',userData)
      } catch (err) {
        console.warn('Invalid or expired token. Logging out...');
        clearToken();
        setUserData(null); // Clear userData from context and localStorage
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

if (isValidToken === null || onboardingStatus === null) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" > 
      <CircularProgress size={80} sx={{ color: '#14B8A6',}}/>
    </Box>
  );
}

  if (!token || !isValidToken) {
    return <Navigate to="/Auth/login" replace />;
  }

  if (!userData?.verifyAccount) {
    return <Navigate to="/Auth/verify-account" replace />;
  }

  const hasIncompleteStep =
    onboardingStatus &&
    Object.keys(onboardingStatus).length > 0 &&
    Object.values(onboardingStatus).some((step) => step === false);

  if (hasIncompleteStep && location.pathname !== '/user-info') {
    return <Navigate to="/user-info" replace />;
 
  }

  return <Outlet />;
};

export default PrivateRoute;
