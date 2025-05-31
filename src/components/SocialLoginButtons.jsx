import React, {useState} from "react";
import AppleIcon from  '../assets/Signin/icons/Apple logo.svg';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; 

// import axios
import axios from "../axios/axios";

import Box from '@mui/material/Box';
import { Grid } from "@mui/joy";
import { Button, Divider, Typography } from '@mui/material';


const GOOGLE_LOGIN_URL='/api/v1/auth/login-google';

const SocialLoginButtons = () =>{
    const [googleuser, setGoogleuser] = useState(null);
   const handleLoginSuccess = async (credentialResponse) => {
  console.log("Google login response:", credentialResponse);

  try {
    const { credential } = credentialResponse;

    if (!credential) {
      console.error("No credential found in response.");
      return;
    }

    const decoded = jwtDecode(credential);
    console.log("Decoded Google User:", decoded);

    setGoogleuser(decoded);

    const payload = {
      token: credential,
      device_token: 'abcdef123456',
      device_type: 'web', 
       skip_verification: true, 
    };

    console.log("Sending payload to backend:", payload);

    const res = await axios.post(GOOGLE_LOGIN_URL, payload);

    console.log("Backend Response:", res.data);

    // Redirect after success
    window.location.href = '/';
  } catch (err) {
    console.error("Error caught in login:", err);

    if (err.response) {
      console.error("Server responded with error:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("Request made but no response received:", err.request);
    } else {
      console.error("Something went wrong:", err.message);
    }
  }
};


    return (
            <Grid container >
                  <Grid item xs={12} >
                         <Divider
                        sx={{
                            '&::before, &::after': {
                            borderTop: '1px solid #CBD5E1', // customize the line
                            },
                         my: 3,
                        }}
                     >
                        <Typography sx={{ color: '#94A3B8',
                            fontWeight:'800',
                            fontSize:'12px',
                            fontFamily:'Plus Jakarta Sans',
                            lineHeight:'16px'
                         }}>OR</Typography>
                    </Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* google login */}
                         <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Login Failed")} />
                       
                        <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => alert('Sign up with Facebook')}
                        sx={{
                            border:'1px solid #ECF0F5',
                            padding:'10px',
                            fontSize:'14px',
                            fontWeight:'400',
                            color:'#5D6778',
                            textTransform:'inherit'
                        }}

                        >

                        <img src={AppleIcon} alt="AppleIcon" className="icon-material"/>

                        Log in with Email
                        </Button>
            
                    </Box>
                  </Grid>
            </Grid>
    )
}

export default SocialLoginButtons;