import axios from 'axios';

const API = axios.create({
  baseURL: 'http://dev.sloopify.com/public',
});

// Set token on each request
API.interceptors.request.use((config) => {
  let tokenData = localStorage.getItem('authToken');
  let token = null;

  if (tokenData) {
    try {
      const parsed = JSON.parse(tokenData);
      token = parsed.token;
    } catch (e) {
      console.error('Invalid token format in localStorage');
    }
  } else {
    token = sessionStorage.getItem('authToken');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));


export default API;