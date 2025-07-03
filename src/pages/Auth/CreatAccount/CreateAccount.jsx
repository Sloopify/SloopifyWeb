import React, { useState } from "react";
import API from "../../../axios/axios";
import { setToken } from "../../../utils/auth";
import SocialLoginButtons from "../../../components/SocialLoginButtons";
import { Grid } from "@mui/joy";
import backgroundTexture from '../../../assets/Signin/bg/bg.png';
import Box from '@mui/material/Box';
import createAccountImage from '../../../assets/createAccount/create-account.png';
import logoImage from '../../../assets/Signin/Logomark.png'; 
import passwordIcone from '../../../assets/Signin/icons/password.svg';
import signup from '../../../assets/Signin/icons/signup.svg';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";

import { 
  FormControl,
  FormLabel,
  Link,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  TextField
} from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import zxcvbn from 'zxcvbn';

const getStrengthLabel = (score) => {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  return labels[score];
};

const SIGNUP_URL = '/api/v1/auth/register/create-account';

const CreateAccount = () => {
  const navigate = useNavigate();
  const { setUserData } = useUser();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return {
      isValid: hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isLongEnough,
    };
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleToggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordScore(zxcvbn(value).score);
    setError(''); // Clear error when user types
  };

  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic front-end validations
    if (!phone || !/^\+[1-9]\d{1,14}$/.test(phone)) {
      setError('Phone must be in E.164 format (e.g. +963987654321).');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format.');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError('Password must contain at least: 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone,
    };

    try {
      setRegisterLoading(true);
      const res = await API.post(SIGNUP_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      console.log("Signup successful", res.data);
      setUserData({ email, phone });
      navigate('/Auth/verify-account');
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const errorMsg =
          errors?.email?.[0] ||
          errors?.phone?.[0] ||
          errors?.password?.[0] ||
          'Validation failed. Please check your input.';
        setError(errorMsg);
      } else {
        console.error("Signup error:", err);
        setError("Unexpected error occurred. Please try again.");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={6} sx={{
        padding: {
          xs: '40px 20px',
          md: '40px 100px'
        }
      }}>
        <img src={logoImage} alt="Welcome" className="logo"/>
        <h1 className="heading">Let's Create Your Account.</h1>
        <Typography
          sx={{
            color: '#475569',
            textAlign: 'center',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '16px',
            fontWeight: '400'
          }}
        >
          Sign up for free and get started quickly.
        </Typography>
        
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '64px' }} onSubmit={handleSubmit}>
          {/* Full Name */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: '100%' }}>
                <TextField
                  required
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  id="FirstName"
                  placeholder="First Name"
                  name="FirstName"
                  variant="outlined"
                  sx={{
                    input: { 
                      color: '#707988',
                      padding: '12px 24px',
                      border: '0px'
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      border: '0px solid #E2E8F0',
                      Height: '48px',
                      marginBottom: '10px',
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                      },
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: '100%' }}>
                <TextField
                  required
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  id="LastName"
                  placeholder="Last Name"
                  name="LastName"
                  variant="outlined"
                  sx={{
                    input: { 
                      color: '#707988',
                      padding: '12px 24px',
                      border: '0px'
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      border: '0px solid #E2E8F0',
                      Height: '48px',
                      marginBottom: '10px',
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                      },
                    },
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          {/* Email and Phone */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: '100%' }}>
                <TextField
                  required
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email-account"
                  placeholder="Email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  sx={{
                    input: { 
                      color: '#475569',
                      padding: '12px 24px',
                      border: '0px'
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      border: '0px solid #CBD5E1',
                      Height: '48px',
                      marginBottom: '10px',
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                      },
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: '100%' }}>
                <PhoneInput
                  country={'sy'}
                  enableSearch={true}
                  countryCodeEditable={true}
                  name="tel"
                  value={phone}
                  onChange={(value) => setPhone("+" + value)}
                  inputStyle={{ 
                    width: '100%',
                    border: '1px solid #D4D4D4',
                    borderRadius: '8px',
                    color: '#5D6778',
                    height: '48px'
                  }}
                  buttonStyle={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #D4D4D4',
                    borderRadius: '8px 0px 0px 8px',
                  }}
                  containerStyle={{
                    height: '48px'
                  }}
                  searchStyle={{
                    width: '90%',
                    padding: '10px',
                    border: '1px solid #D4D4D4',
                  }}
                  specialLabel={''}
                  containerClass="custom-phone-input"
                  inputProps={{
                    name: 'tel',  
                    required: true,
                    autoFocus: false,
                    autoComplete: 'tel'
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          {/* Password Fields */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: '100%' }}>
                <FormLabel
                  sx={{
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#5D6778',
                    fontFamily: 'Plus Jakarta Sans',
                    letterSpacing: '-0.084px',
                    lineHeight: '20px',
                    marginBottom: '6px',
                  }}
                  htmlFor="create-password"
                >
                  Password
                </FormLabel>
                <TextField
                  required
                  fullWidth
                  name="new-password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  id="create-password"
                  autoComplete="new-password"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    input: {
                      color: '#475569',
                      padding: '12px',
                      border: '0px',
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '123px',
                      border: '0px solid #CBD5E1',
                      paddingLeft: '30px',
                      height: '48px',
                      backgroundImage: `url(${passwordIcone})`,
                      backgroundPosition: '15px',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '15px',
                      marginBottom: '8px',
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                      },
                    },
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 1000px white inset',
                      WebkitTextFillColor: '#1E293B',
                      transition: 'background-color 5000s ease-in-out 0s',
                    },
                  }}
                />
                
                {/* Password Strength Meter */}
                <Box display="flex" gap={1} mb={1}>
                  {[0, 1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        height: 4,
                        flex: 1,
                        borderRadius: 5,
                        backgroundColor:
                          passwordScore >= i
                            ? passwordScore < 2
                              ? '#f44336'
                              : passwordScore === 2
                              ? '#ff9800'
                              : '#4caf50'
                            : '#e0e0e0',
                      }}
                    />
                  ))}
                </Box>
                
                {/* Password Requirements Checklist */}
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Password must contain:
                  </Typography>
                  <Box component="ul" sx={{ 
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    '& li': {
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      mb: 0.5
                    }
                  }}>
                    {[
                      { 
                        text: 'At least 8 characters', 
                        valid: password.length >= 8 
                      },
                      { 
                        text: 'At least one uppercase letter (A-Z)', 
                        valid: /[A-Z]/.test(password) 
                      },
                      { 
                        text: 'At least one lowercase letter (a-z)', 
                        valid: /[a-z]/.test(password) 
                      },
                      { 
                        text: 'At least one number (0-9)', 
                        valid: /[0-9]/.test(password) 
                      },
                      { 
                        text: 'At least one special character (!@#$%^&*)', 
                        valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) 
                      }
                    ].map((requirement, index) => (
                      <Box 
                        component="li"
                        key={index}
                        sx={{ 
                          color: requirement.valid ? '#4CAF50' : '#475569',
                          '&:before': {
                            content: '""',
                            display: 'inline-block',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: requirement.valid ? '#4CAF50' : '#E0E0E0',
                            mr: 1
                          }
                        }}
                      >
                        {requirement.text}
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ 
                  color: '#475569', 
                  fontSize: '14px',
                  mt: 1
                }}>
                  Password strength: {getStrengthLabel(passwordScore)}
                </Typography>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: '100%' }}>
                <FormLabel
                  sx={{
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#5D6778',
                    fontFamily: 'Plus Jakarta Sans',
                    letterSpacing: '-0.084px',
                    lineHeight: '20px',
                    marginBottom: '6px',
                  }}
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </FormLabel>
                <TextField
                  required
                  fullWidth
                  name="confirm-new-password"
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!passwordsMatch && confirmPassword.length > 0}
                  helperText={
                    !passwordsMatch && confirmPassword.length > 0
                      ? 'Passwords do not match'
                      : confirmPassword.length === 0
                      ? ''
                      : 'Passwords match'
                  }
                  variant="outlined"
                    autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleToggleConfirmPassword} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    input: {
                      color: '#475569',
                      padding: '12px',
                      border: '0px',
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '123px',
                      border: '0px solid #CBD5E1',
                      paddingLeft: '30px',
                      height: '48px',
                      backgroundImage: `url(${passwordIcone})`,
                      backgroundPosition: '15px',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '15px',
                      margin: '0px',
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                      },
                    },
                    '& input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 1000px white inset',
                      WebkitTextFillColor: '#1E293B',
                      transition: 'background-color 5000s ease-in-out 0s',
                    },
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={registerLoading}
            sx={{
              backgroundColor: '#14B8A6',
              padding: '15px',
              fontFamily: 'Plus Jakarta Sans',
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '-0.7%',
              lineHeight: '22px',
              borderRadius: '12px',
              textTransform: 'capitalize',
              boxShadow: 'none',
              marginTop: '50px',
              '&:hover': {
                backgroundColor: '#0D9488',
              },
              '&:disabled': {
                backgroundColor: '#E2E8F0',
                color: '#94A3B8'
              }
            }}
          >
            {registerLoading ? 'Sign Up....' : 'Sign Up'}
            <img src={signup} alt="signup" className="signup-img"/>
          </Button>
        </Box>
        
        <SocialLoginButtons />
        
        <Typography sx={{
          textAlign: 'left',
          fontFamily: 'Plus Jakarta Sans',
          fontWeight: '400',
          fontSize: '14px',
          letterSpacing: '-0.6%',
          lineHeight: '20px',
          color: '#27364B',
          marginTop: '20px'
        }}>
          Have an account? {' '}
          <Link
            component={RouterLink}
            to="/"
            variant="body2"
            underline="none"
            sx={{ 
              alignSelf: 'center',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: '500',
              fontSize: '14px',
              letterSpacing: '-0.6%',
              lineHeight: '20px',
              color: '#27364B'
            }}
          >
            Log In
          </Link>
        </Typography>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} sm={6} sx={{
        display: {
          xs: 'none', 
          sm: 'block' 
        },
        backgroundImage: `url(${backgroundTexture})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        padding: '80px 40px',
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0'
      }}>
        <Box
          component="img"
          src={createAccountImage}
          alt="Create Account"
          sx={{
            display: 'block',
            margin: 'auto',
            width: {
              xs: '250px',
              md: '600px',
            },
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </Grid>
    </Grid>
  );
};

export default CreateAccount;