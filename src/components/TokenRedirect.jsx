import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuthToken  } from '../utils/auth';

const TokenRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getAuthToken ();

  useEffect(() => {
    // If token exists and user is on an auth page, redirect to home
    if (token && location.pathname.startsWith('/Auth')) {
      navigate('/', { replace: true });
    }
  }, [token, location.pathname, navigate]);

  return null;
};

export default TokenRedirect;
