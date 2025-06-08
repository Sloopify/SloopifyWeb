import React, { useState } from "react";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import zxcvbn from 'zxcvbn';

// MUI components
import {
  FormControl,
  FormLabel,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  TextField,
  Box
} from '@mui/material';
import { Grid } from "@mui/joy";

// Assets
import passwordIcone from '../../../assets/Signin/icons/password.svg';
import logoImage from '../../../assets/Signin/Logomark.png'; 
import ResetPasswordImage from '../../../assets/ForgotPassword/ResetPassword.png'
// Helper
const getStrengthLabel = (score) => {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Strong'];
  return labels[score];
};

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleToggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordScore(zxcvbn(value).score);
  };

  const passwordsMatch = password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError('Passwords do not match');
    } else if (password.length < 8) {
      setError('Password must be at least 8 characters');
    } else {
      setError('');
      // Proceed with actual password reset logic (API call etc.)
      console.log('Password reset successful:', password);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        {/* Password */}
        <Grid item xs={12} sm={6}   sx={{
                padding:{
                     xs: '40px 20px',
                     md: '40px 100px'
                }
               
                }}>
        <img src={logoImage} alt="Welcome" className="logo"/>
                <h1 className="heading" >Create new password</h1>
                
          <FormControl sx={{ width: '100%',marginBottom:'20px' }}>
            <FormLabel
              htmlFor="create-password"
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
            >
              Password
            </FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="*****************"
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
              }}
            />
            {/* Strength Bar */}
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
            <Typography variant="body2" sx={{ color: '#475569', fontSize: '14px' }}>
              Password strength: {getStrengthLabel(passwordScore)}
            </Typography>
          </FormControl>
            <FormControl sx={{ width: '100%' }}>
            <FormLabel
              htmlFor="confirm-password"
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
            >
              Confirm Password
            </FormLabel>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              placeholder="*****************"
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
              }}
            />
          </FormControl>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor:'#14B8A6',
                            padding:'15px',
                            fontFamily:'Inter',
                            fontSize:'16px',
                            fontWeight:'500',
                            letterSpacing:'-0.7%',
                            lineHeight:'175%',
                            borderRadius:'12px',
                            textTransform:'capitalize',
                            boxShadow:'none',
                            marginTop:'10px',
                            
                        }}
                        >
                        Change Password
                         <Box
                        component="img"
                        src={LockScreen}
                        alt="Lock Icon"
                        sx={{
                            marginLeft:'10px'
                        }}
                        />

                    </Button>
        </Grid>

        {/* Confirm Password */}
         {/* Right column */}
            <Grid item xs={12} sm={6}  sx={{
                    padding:'140px 40px',
                    
                }}>
                <Box
                component="img"
                src={ResetPasswordImage}
                alt="Reset Password Imge "
                sx={{
                    display:'block',
                    margin:'auto',
                    width: {
                    xs: '250px',
                    md: '450px',
                    },
                    maxWidth: '100%',
                    height: 'auto',
                }}
                />
                </Grid>

        {/* Error Message */}
        {error && (
          <Grid item xs={12}>
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          </Grid>

        )}

        
   
      </Grid>
    </form>
  );
};

export default ChangePassword;
