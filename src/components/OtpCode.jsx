import React from "react";
import { Grid, Box, TextField, Link, Typography, Button } from '@mui/material';
import API from "../axios/axios";

// API endpoint
const LOGIN_OTP_URL_VERIFY = '/api/v1/auth/verify-login-otp';

export default function OtpCode({ email }) {
  const inputRefs = React.useMemo(() => Array.from({ length: 6 }, () => React.createRef()), []);
  const [values, setValues] = React.useState(['', '', '', '', '', '']);
  const [loading, setLoading] = React.useState(false);
  const [counter, setCounter] = React.useState(300);
  const [canResend, setCanResend] = React.useState(false);

  // Auto-focus first input on mount
  React.useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  // Timer countdown for resend
  React.useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [counter]);

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  const handleChange = (index, event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 1) {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);

      if (value && index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(paste)) {
      const newValues = paste.split('');
      setValues(newValues);
      inputRefs[5].current.focus();
    }
  };

  const handleVerify = async () => {
    const otp = values.join('');
    if (otp.length < 6) {
      alert("Please enter the full 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type: 'email',
        email,
        otp,
      };
      console.log("Sending payload verify:", payload);
      const res = await API.post(LOGIN_OTP_URL_VERIFY, payload);

      if (res.data?.success) {
        alert('OTP verified successfully!');
        // Navigate or update state here if needed
      } else {
        alert('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    console.log("Resending code...");
    // Trigger resend API call if applicable
    setCounter(300);
    setCanResend(false);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Box display="flex" gap={2} justifyContent="center" mt={4}>
          {values.map((val, index) => (
            <TextField
              key={index}
              inputRef={inputRefs[index]}
              value={val}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: 'center',
                  fontSize: '20px',
                  width: '40px',
                  height: '40px',
                  color: '#5D6778'
                },
              }}
            />
          ))}
        </Box>

        {/* Resend code timer or button */}
        <Typography sx={{ textAlign: 'center', mt: 3, fontSize: '14px', fontWeight: 400, color: '#5D6778', fontFamily: 'Inter' }}>
          {canResend ? (
            <Link
              component="button"
              onClick={handleResend}
              sx={{ fontFamily: 'Inter', fontWeight: 'bold', color: '#14B8A6', textDecoration: 'none' }}
            >
              Resend Code
            </Link>
          ) : (
            <>Resend in <Typography component="span" sx={{ fontWeight: 600, display: 'inline' }}>{minutes}:{seconds.toString().padStart(2, '0')}</Typography></>
          )}
        </Typography>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: '#14B8A6',
            padding: '15px',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: '500',
            letterSpacing: '-0.7%',
            lineHeight: '175%',
            borderRadius: '12px',
            textTransform: 'capitalize',
            boxShadow: 'none',
            marginTop: '40px',
          }}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </Grid>
    </Grid>
  );
}
