import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoutes';
import { useNavigate } from 'react-router-dom';

import { clearToken, getTokenExpiryTime } from './utils/auth';
import TokenRedirect from './components/TokenRedirect';

// Auth Pages
import Signin from './pages/Auth/Signin/Signin';
import CreateAccount from './pages/Auth/CreatAccount/CreateAccount';
import Verifyaccount from './pages/Auth/VerifyAccount/VerifyAccount';
import LoginOtp from './pages/Auth/LoginOtp/LoginOtp';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import ChangePassword from './pages/Auth/ForgotPassword/ChangePassword';
import MultiStepForm from './pages/Auth/MultiStepForm/MultiStepForm';
import Referred from './pages/Auth/MultiStepForm/Reffer';

// Home 
import Layout from './pages/Home/AppHome';

function App() {
    
  const navigate = useNavigate();
  
useEffect(() => {
      
  const interval = setInterval(() => {
    const expiry = getTokenExpiryTime();
    if (expiry && Date.now() >= expiry) {
      clearToken();
      clearInterval(interval);
      navigate('/Auth/login');
    }
  }, 60000); 

  return () => clearInterval(interval);
}, []);



  return (
      <>
        {/* <TokenRedirect />  */}
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/Auth/login" element={<Signin />} />
            <Route path="/Auth/create-account" element={<CreateAccount />} />
            <Route path="/Auth/verify-account" element={<Verifyaccount />} />
            <Route path="/Auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/Auth/change-password" element={<ChangePassword />} />
            <Route path="/Auth/log-in-with-OTP" element={<LoginOtp />} />
          

          </Route>
        
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />} />
            <Route path="/referred" element={<Referred />} />
            <Route path="/user-info" element={<MultiStepForm />} />

          </Route>
          
          
        
        </Routes>
      </>

  );
}

export default App;
