import React  from "react";
import API from "../../../axios/axios";
// ui
import Box from '@mui/material/Box';
import { Grid } from "@mui/joy";
import {
 
        Link,
        Typography,
        Button,
        Divider
        
} from '@mui/material';
// images
import backgroundTexture from '../../../assets/Signin/bg/bg.png';
import ForgotPasswordImge from '../../../assets/ForgotPassword/ForgotPassword.png';
import logoImage from '../../../assets/Signin/Logomark.png'; 
import mailIcon from '../../../assets/verifyAccount/mail-out.svg';
import PhoneIcon from '../../../assets/verifyAccount/phone-outcome.svg';
import LockScreen from '../../../assets/ForgotPassword/LockSimple.svg';
import goBackIicon from '../../../assets/ForgotPassword/CaretLeft.svg'
// router
import { Link as RouterLink } from 'react-router-dom';
import { useUser } from "../../../context/UserContext";


const SEND_OTP_PASSWORD_EMAIL='/api/v1/auth/forgot-password/send-otp';

const ForgotPassword = () =>{

    const { userData, setUserData } = useUser();

    const handleSendEmailCode = async () => {
    try {
        const payload = {
        type: 'email',
        email: userData.email
        };
        console.log("Sending forgot password email:", payload);

        await API.post(SEND_OTP_PASSWORD_EMAIL, payload); 
       
        alert("Code sent to your email.");
    } catch (err) {
        console.error("Error sending forgot password code:", err);
        alert("Failed to send reset code.");
    }
    };

    
    return(
        <Grid container >
            <Grid item xs={12} sm={6}
             sx={{
                padding:{
                     xs: '40px 20px',
                     md: '40px 100px'
                }
               
                }}
            >
                <img src={logoImage} alt="Welcome" className="logo"/>
                <h1 className="heading" >Forgot Password</h1>
                <Typography 
                    sx={{
                        fontFamily:'Plus Jakarta Sans',
                        fontSize:'16px',
                        fontWeight:'400',
                        color:'#475569',
                        textAlign:'center'
                    }}
                    >
                        Don’t worry, mate! We can restore it for you.
                    </Typography>
                    <Button
                        fullWidth
                        sx={{
                            padding:'12px 24px',
                            fontFamily:'Plus Jakarta Sans',
                            fontSize:{
                                xs:'10px',
                                md:'16px'
                            },
                            fontWeight:'700',
                            letterSpacing:'0%',
                            border:'1px solid #14B8A6',
                            color:'#5D6778',
                            margin:'30px 0px'
                        }}
                        onClick={handleSendEmailCode}
                    >
                        <Box
                        component="img"
                        src={mailIcon}
                        alt="mail Icon"
                        sx={{
                           marginRight:'10px'
                        }}
                        />
                         Sent code to {userData.email}
                    </Button>
                    <Divider
                        sx={{
                            '&::before, &::after': {
                            borderTop: '1px solid #CBD5E1', // customize the line
                            },
                        
                        }}
                     >
                        <Typography sx={{ color: '#94A3B8',
                            fontWeight:'800',
                            fontSize:'12px',
                            fontFamily:'Plus Jakarta Sans',
                            lineHeight:'16px'
                         }}>OR</Typography>
                    </Divider>
                    <Button
                        fullWidth
                        sx={{
                            padding:'12px 24px',
                            fontFamily:'Plus Jakarta Sans',
                            fontSize:{
                                xs:'10px',
                                md:'16px'
                            },
                            fontWeight:'700',
                            letterSpacing:'0%',
                            border:'1px solid #ECF0F5',
                            color:'#5D6778',
                            margin:'30px 0px'
                        }}
                         
                    >
                        <Box
                        component="img"
                        src={PhoneIcon}
                        alt="mail Icon"
                        sx={{
                           marginRight:'10px'
                        }}
                        />
                        Sent code to {userData.phone}
                    </Button>     
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
                            marginTop:'40px',
                            
                        }}
                        >
                        Reset Password
                         <Box
                        component="img"
                        src={LockScreen}
                        alt="Lock Icon"
                        sx={{
                            marginLeft:'10px'
                        }}
                        />

                    </Button>
                    <Link
                        fullWidth
                        component={RouterLink}
                        to="/"
                        variant="body2"
                        underline="none"
                        sx={{ 
                        fontFamily:'Plus Jakarta Sans',
                        fontWeight:'700',
                        fontSize:'16px',
                        letterSpacing:'-0.6%',
                        lineHeight:'40px',
                        color:'#14B8A6',
                        textAlign:'center',
                        marginTop:'20px',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center'
                        }}
                        >
                         <Box
                        component="img"
                        src={goBackIicon}
                        alt="Back Icon"
                        sx={{
                            marginRight:'10px',
                            
                        }}
                        />
                         Back to login screen
                        </Link>
          
            </Grid>
            {/* Right column */}
            <Grid item xs={12} sm={6}  sx={{
                    backgroundImage:`url(${backgroundTexture})`,
                    backgroundPosition:'center',
                    backgroundSize:'cover',
                    backgroundRepeat:'no-repeat',
                    padding:'140px 40px',
                    
                }}>
                <Box
                component="img"
                src={ForgotPasswordImge}
                alt="Forgot Password Imge "
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
        </Grid>

    )

}

export default ForgotPassword;