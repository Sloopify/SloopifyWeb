import React from "react";
import SocialLoginButtons from "../../../components/SocialLoginButtons";
import welcomeImage from '../../../assets/Signin/welcome.png';
import logoImage from '../../../assets/Signin/Logomark.png'; 
import emailIcone from '../../../assets/Signin/icons/email.svg';
import passwordIcone from '../../../assets/Signin/icons/password.svg';
import divider from '../../../assets/Signin/icons/divider.png';
import backgroundTexture from '../../../assets/Signin/bg/bg.png';
import signup from '../../../assets/Signin/icons/signup.svg';
import './Sign.css';
import { Grid } from "@mui/joy";
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';

import { FormControl,
        FormLabel,
        Link,
        Typography,
        Button,
        
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

const Signin = () =>{
    
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
                <h1 className="heading" >Sign In To Your Account.</h1>
                <img src={divider} alt="divider" className="divider"/>
                {/* Signin form */}
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>         
                    {/* email */}
                    <FormControl>
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
                         htmlFor="email">Email Address or Phone</FormLabel>
                        <TextField
                            required
                            fullWidth
                            id="email"
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
                                     marginBottom:'10px',
                                    '&.Mui-focused': {
                                        boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                                    },
                                    },
                                }}
                        
                        
                        />
                    </FormControl>
                    {/* password */}
                    <FormControl>
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
                         htmlFor="password">Password</FormLabel>
                        <TextField
                            required
                            fullWidth
                            className="field password-field"
                            name="password"
                            placeholder="*****************"
                            type="password"
                            id="password"
                            autoComplete="new-password"
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
                                    backgroundImage:`url(${passwordIcone})`,
                                    backgroundPosition:'15px',
                                    backgroundRepeat:'no-repeat',
                                    backgroundSize:'15px',
                                     marginBottom:'0px',
                                    '&.Mui-focused': {
                                        boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                                    },
                                    },
                                }}
                        />
                    </FormControl>
                    <Grid container 
                    sx={{
                        display:'flex',
                        alignItems:'center'
                    }}
                    >
                         <Grid item xs={12} sm={6}>
                              <FormControlLabel
                        control={<Checkbox value="allowExtraEmails" color="primary" 
                         sx={{
                            color: '#94a3b8', 
                            '&.Mui-checked': {
                            color: '#14B8A6', 
                           
                            },
                            '& .MuiSvgIcon-root': {
                            fontSize: 24, 
                            },
                        }}
                        />}
                        label="Remember For 30 Days"
                         sx={{
                            '& .MuiFormControlLabel-label': {
                            color: '#1E293B', // actual label text
                            fontWeight: '600',
                            lineHeight:'20px',
                            fontSize:'14px'
                            },
                        }}
                    />
                         </Grid>
                         <Grid item xs={12} sm={6}
                         sx={{
                              textAlign:'right'
                         }}
                         >
                            <Link 
                             component={RouterLink}
                            to="/forgot-password"
                           underline="none" sx={{ 
                                fontFamily:'Plus Jakarta Sans',
                                fontSize: '14px',
                                color: '#14B8A6',
                                fontWeight:'700',
                                lineHeight:'20px',
                              
                               
                            }}>
                            Forgot password?</Link>
                         </Grid>
                    </Grid>
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
                        >
                        Sign in
                        <img src={signup} alt="signup" className="signup-img"/>

                        </Button>
                     <Typography sx={{
                         textAlign: 'center' ,
                         fontFamily:'Plus Jakarta Sans',
                         fontWeight:'700',
                         fontSize:'14px',
                         letterSpacing:'-0.6%',
                         lineHeight:'20px',
                         color:'#1E293B',
                         marginTop:'10px'
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
                    <SocialLoginButtons />
                    

                </Box>
            </Grid>
            {/* Right column */}
            <Grid item xs={12} sm={6}  sx={{
                 backgroundImage:`url(${backgroundTexture})`,
                 backgroundPosition:'center',
                 backgroundSize:'cover',
                 backgroundRepeat:'no-repeat',
                 padding:'80px 40px',
                
            }}>
             <Box
            component="img"
            src={welcomeImage}
            alt="Welcome"
            sx={{
                width: {
                xs: '250px',
                md: '500px',
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


export default Signin;