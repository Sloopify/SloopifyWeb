import React from "react";

import { FormControl,
        FormLabel,
        Link,
        Typography,
        Button,
        
} from '@mui/material';
import TextField from '@mui/material/TextField';
// router
import { Link as RouterLink } from 'react-router-dom';

// images

import emailIcone from '../assets/Signin/icons/email.svg';
import sendIcon from '../assets/LoginOtp/PaperPlaneTilt.svg'

const SendOtpCode = ({ onOtpSent }) => {

    const handleClick = () => {
     onOtpSent(); 
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

        </grid>
    )
}

export default SendOtpCode;