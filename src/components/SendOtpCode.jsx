import React, {useState} from "react";
import API from '../axios/axios';

import { FormControl,
        FormLabel,
        Link,
        Typography,
        Button,
        Box
        
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { Dialog, DialogContent } from '@mui/material';

// router
import { Link as RouterLink } from 'react-router-dom';

// images

import emailIcone from '../assets/Signin/icons/email.svg';
import CheckIcon from '../assets/notify-modal/check.png'
import sendIcon from '../assets/LoginOtp/PaperPlaneTilt.svg'

// api
const LOGIN_OTP_URL='/api/v1/auth/login-otp';

const SendOtpCode = ({ onOtpSent, email, setEmail }) => {

    const [openSuccessModal, setOpenSuccessModal] = useState(false);


  const handleClick = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post(
      LOGIN_OTP_URL,
      {
        type: 'email',
        email,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data?.success) {
      setOpenSuccessModal(true); // Show modal
      onOtpSent(); // Proceed to next step (like showing OTP input)
    } else {
      console.error("OTP request failed:", response.data);
      alert('Failed to send OTP. Please try again.');
    }

  } catch (err) {
    console.error("Error sending code:", err);
    alert('Network or server error occurred.');
  }
};

    return (
        <grid container>
            <grid item xs={12}>
                {/* email */}
                    <FormControl fullWidth>
                        <FormLabel 
                         sx={{
                            textAlign:'left',
                            fontSize:'14px',
                            fontWeight:'700',
                            color:'#1E293B',
                            fontFamily:'Plus Jakarta Sans',
                            letterSpacing:'-0.6%',
                            lineHeight:'20px',
                            marginBottom:'6px',
                         
                         }}
                         htmlFor="email-login">Email Address</FormLabel>
                        <TextField
                            required
                            fullWidth
                            id="email-login"
                            placeholder="elementary221b@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            autoComplete="email"
                            variant="outlined"
                              sx={{
                                    input: { color: '#475569',
                                        padding:'12px',
                                        border:'0px'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                    borderRadius: '123px',
                                    border: '0px solid #CBD5E1',
                                    paddingLeft:'30px',
                                    Height:'48px',
                                    backgroundImage:`url(${emailIcone})`,
                                    backgroundPosition:'15px',
                                    backgroundRepeat:'no-repeat',
                                    backgroundSize:'20px',
                                     marginBottom:'24px',
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
                            fontFamily:'Plus Jakarta Sans',
                            fontSize:'16px',
                            fontWeight:'700',
                            letterSpacing:'-0.7%',
                            lineHeight:'22px',
                            borderRadius:'12px',
                            textTransform:'capitalize',
                            boxShadow:'none'
                        }}
                        onClick={handleClick}
                        >
                        Send
                        <img src={sendIcon} alt="send Icon" className="signup-img"/>

                        </Button>
                        <Typography sx={{
                         textAlign: 'center' ,
                         fontFamily:'Plus Jakarta Sans',
                         fontWeight:'700',
                         fontSize:'14px',
                         letterSpacing:'-0.6%',
                         lineHeight:'20px',
                         color:'#1E293B',
                         marginTop:'24px'
                        }}>
                        Already have an account?{' '}
                        <Link
                            component={RouterLink}
                            to="/create-account"
                            variant="body2"
                            underline="none"
                            sx={{ 
                                alignSelf: 'center',
                                fontFamily:'Plus Jakarta Sans',
                                fontWeight:'700',
                                fontSize:'14px',
                                letterSpacing:'-0.6%',
                                lineHeight:'20px',
                                color:'#14B8A6'

                             }}
                        >
                            Sign up
                        </Link>
                    </Typography>
            </grid>

        {/* check your email modal */}
        <Dialog open={openSuccessModal} onClose={() => setOpenSuccessModal(false)} PaperProps={{
          sx: {
            width: '354px',
            maxWidth: '354px',
            margin: 'auto',
            borderRadius:'25px'
          }

        }}>
        <DialogContent>
          <Box
            component='img'
            src={CheckIcon}
            sx={{
              width:'50px',
              display:'block',
              margin:'20px auto'
            }}
          />
        <Typography sx={{
           textAlign: 'center',
          fontSize: '16px',
          fontWeight: '500',
          color: '#0C1024',
          fontFamily: 'Plus Jakarta Sans',
         letterSpacing: '-0.084px',
          lineHeight: '100%',
          marginBottom: '15px',
          marginTop:'10px'
        }}>
            Check your inbox! 
        </Typography>
        <Typography sx={{
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '400',
          color: '#5D6778',
          fontFamily: 'Plus Jakarta Sans',
         letterSpacing: '-0.084px',
          lineHeight: '25px',
          marginBottom: '15px',
          marginTop:'10px'
        }}>
          Your password changed successfully. You will be redirected to the log in page in a few seconds 
        </Typography>
          
        </DialogContent>
      
      </Dialog>

        </grid>
    )
}

export default SendOtpCode;