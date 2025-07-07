import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearToken } from '../utils/auth';
import { getAuthToken as getToken } from '../utils/auth';

import API from "../axios/axios";
// api url
const VERIFY_Token_URL='/api/v1/auth/verify-token';


const useVerifyToken = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const token = getToken();
      if (!token) return;

      try {
        await API.get(VERIFY_Token_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // token valid: do nothing
      } catch (error) {
        console.log('Invalid token or user deleted');
        clearToken();
        navigate('/Auth/login');
      }
    };

    verify();
  }, [location.pathname]); // Re-run on every route change
};

export default useVerifyToken;
