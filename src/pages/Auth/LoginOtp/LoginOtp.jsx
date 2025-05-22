import React, {useState}  from "react";
// component
import SocialLoginButtons from "../../../components/SocialLoginButtons";
import SendOtpCode from "../../../components/SendOtpCode";
import OtpCode from "../../../components/OtpCode";

import { Grid } from "@mui/joy";
import Box from '@mui/material/Box';

// images
import OtpImage from '../../../assets/LoginOtp/login-otp.png';
import logoImage from '../../../assets/Signin/Logomark.png'; 
import divider from '../../../assets/Signin/icons/divider.png';



export default function LoginOtp  () {
    
    const [otpSent, setOtpSent] = useState(false);


    return(
        <Grid container >
            <Grid item xs={12} sm={6}
                sx={{
                    padding:{
                         xs: '40px 20px',
                         md: '40px 100px'
                    }
                       
                }}>
                    <img src={logoImage} alt="Welcome" className="logo"/>
                    <h1 className="heading" >Log in with OTP</h1>
                    <img src={divider} alt="divider" className="divider"/>

                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop:'30px' }}>   
                    {/* email */}
                    {!otpSent && <SendOtpCode onOtpSent={() => setOtpSent(true)} />}
                    {otpSent && <OtpCode />}

                    <SocialLoginButtons />                          
                    </Box>

                </Grid>

                  {/* Right column */}
                <Grid item xs={12} sm={6}  sx={{
                   display:'flex',
                   alignItems:'center',
                    padding:'80px 40px',
                    
                }}>
                <Box
                component="img"
                src={OtpImage}
                alt="Otp Image"
                sx={{
                    width: {
                    xs: '250px',
                    md: '400px',
                    },
                    maxWidth: '100%',
                    height: 'auto',
                    display:'block',
                    margin:'auto'
                }}
                />
                </Grid>
        </Grid>

    )

}

