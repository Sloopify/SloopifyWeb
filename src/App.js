import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
// Auth Pages
import Signin from './pages/Auth/Signin/Signin';
import CreateAccount from './pages/Auth/CreatAccount/CreateAccount';
import Verifyaccount from './pages/Auth/VerifyAccount/VerifyAccount';
import LoginOtp from './pages/Auth/LoginOtp/LoginOtp';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import MultiStepForm from './pages/Auth/MultiStepForm/MultiStepForm';
// Home 
import Layout from './pages/Home/AppHome';

function App() {
  return (
  <Router>
      <Routes>
        <Route path="/Auth/login" element={<Signin />} />
        <Route path="/Auth/create-account" element={<CreateAccount />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />} />
        </Route>
        <Route path="/verify-account" element={<Verifyaccount />} />
        <Route path="/log-in-with-OTP" element={<LoginOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user-info" element={<MultiStepForm />} />
        
       
      </Routes>
    </Router>
  );
}

export default App;
