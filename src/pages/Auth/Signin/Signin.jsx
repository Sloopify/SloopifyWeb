import React, {useState} from "react";
import API from "../../../axios/axios";
import { setToken } from "../../../utils/auth";
import SocialLoginButtons from "../../../components/SocialLoginButtons";
import welcomeImage from '../../../assets/Signin/welcome.png';
import logoImage from '../../../assets/Signin/Logomark.png'; 
import emailIcone from '../../../assets/Signin/icons/email.svg';
import passwordIcone from '../../../assets/Signin/icons/password.svg';
import divider from '../../../assets/Signin/icons/divider.png';
import backgroundTexture from '../../../assets/Signin/bg/bg.png';
import signup from '../../../assets/Signin/icons/signup.svg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Sign.css';
import { Grid } from "@mui/joy";
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../context/UserContext";

import { FormControl,
        FormLabel,
        Link,
        Typography,
        Button,
        InputAdornment,
        IconButton,
        
        ToggleButton,
        ToggleButtonGroup,
        
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const LOGIN_URL='/api/v1/auth/login-email';
const LOGIN_MOBILE_URL='/api/v1/auth/login-mobile';

const Signin = () =>{

    const { userData, setUserData } = useUser();
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState('emailLogin');
    // login credentials
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordPhone, setShowPasswordPhone] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };
     const handleTogglePasswordPhone = () => {
        setShowPasswordPhone((prev) => !prev);
    };

    const handleLoginTypeChange = (_, newType) => {
    if (newType !== null) setLoginType(newType);
    };

    // handle email login

    const handleLogin = async (e) => 
    {
        e.preventDefault();

        try {
            const response = await API.post(
                LOGIN_URL,
                { email, password },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
            }
                }
            );
            

            const token = response.headers['authorization'] || response.headers['Authorization'];

            if (token) {
                setToken(token, rememberMe);
                console.log('Session token after login:', sessionStorage.getItem('authToken'),Date.now());
                console.log('Local token after login:', localStorage.getItem('authToken'),Date.now());
           
             

                navigate('/');
            } else {
                console.error('No token found in response headers.');
            }
            } catch (err) {
                console.error('Login failed:', err);
                
            }
    };

    

    // handle mobile login
    const handleMobileLogin = async (e) => {
        e.preventDefault();
        console.log({ phone, password });
        try {
        const response = await API.post(LOGIN_MOBILE_URL, {
            phone,
            password,
        }, 
        { headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        });

    

        const token = response.headers['authorization'] || response.headers['Authorization'];

        if (token) {
                setToken(token, rememberMe);
                console.log('Session token after login:', sessionStorage.getItem('authToken'));
                console.log('Local token after login:', localStorage.getItem('authToken'));
                setUserData((prev) => ({
                ...prev,
                phone: phone,
                }));

                navigate('/');
            } else {
                console.error('No token found in response headers.');
            }
        } catch (err) {
        setError('Invalid email or password');
        console.error(err);
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
               
            }}>
                <img src={logoImage} alt="Welcome" className="logo"/>
                <h1 className="heading" >Sign In To Your Account.</h1>
                <img src={divider} alt="divider" className="divider"/>
                {/* toggle buttons */}
                <Box sx={{display:'fles',justifyContent:'center'}}>
                    <ToggleButtonGroup
                    value={loginType}
                    exclusive
                    onChange={handleLoginTypeChange}
                    sx={{
                    
                        opacity: 1,
                        borderRadius: '1234px',
                        padding: '3px',
                        backgroundColor: '#F8FAFC',
                        
                    }}
                    
                    >
                    <ToggleButton
                    sx={{
                        backgroundColor: '#F8FAFC',
                        color: '#475569',
                        textTransform: 'none',
                        borderRadius:'123px',
                        fontWeight:'700',
                        padding:'10px 15px',
                        border:'none',
                        margin:'0px 2px',
                    
                        '&.Mui-selected': {
                        backgroundColor: '#fff',
                        borderRadius:'120px',
                        color: '#1E293B',
                        fontFamily:'Plus Jakarta Sans',
                        fontWeight:'700',
                        
                        }
                    }} value="emailLogin">Email</ToggleButton>
                    <ToggleButton
                        sx={{
                        backgroundColor: '#F8FAFC',
                        color: '#475569',
                        textTransform: 'none',
                        borderRadius:'123px',
                        fontWeight:'700',
                        padding:'10px 15px',
                        border:'none',
                        margin:'0px 2px',
                    
                        '&.Mui-selected': {
                        backgroundColor: '#fff',
                        borderRadius:'120px',
                        color: '#1E293B',
                        fontFamily:'Plus Jakarta Sans',
                        fontWeight:'700',
                        
                        }
                    }} value="phoneLogin">Phone</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
               
                {/* Email Signin  Form */}
                {loginType ==='emailLogin' && (
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2,mt:3 }} onSubmit={handleLogin}>         
                    {/* email */}
                    <FormControl>
                        
                        <TextField
                            required
                            fullWidth
                            id="email"
                            placeholder="elementary221b@gmail.com"
                            value={email}
                            onChange={(e) => {
                            const newEmail = e.target.value;
                            setEmail(newEmail);
                            setUserData((prev) => ({
                                ...prev,
                                email: newEmail,
                            }));
                            }}
                            type="email"
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
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            autoComplete="current-password"
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
                                   InputProps={{
                                   endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                        />
                    </FormControl>
                     {error && (
                    <Typography sx={{ color: 'red', textAlign: 'center', mt: 1 }}>
                        {error}
                    </Typography>
                    )}
                    <Grid container 
                    sx={{
                        display:'flex',
                        alignItems:'center'
                    }}
                    >
                         <Grid item xs={12} sm={6}>
                              <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
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
                             to="/Auth/forgot-password"
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
                   
                    

                </Box>
                )}
                {/* Phone Signin Form */}
                {loginType ==='phoneLogin' && (
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2,mt:3 }} onSubmit={handleMobileLogin}>         
                    {/* phone */}
                    <FormControl>
                        <PhoneInput
                        country={'sy'}
                        enableSearch={true}
                        countryCodeEditable={true}
                        name="phone"
                       value={phone.replace('+', '')} // show value without "+" in input
  onChange={(value) => {
    const formattedPhone = '+' + value;
    setPhone(formattedPhone);
    setUserData((prev) => ({
      ...prev,
      phone: formattedPhone,
    }));
  }}
                        inputStyle={{ 
                            width: '100%',
                            border: '1px solid #D4D4D4',
                            borderRadius: '123px',
                            color: '#5D6778',
                            height: '48px'
                        }}
                        buttonStyle={{
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #D4D4D4',
                            borderRadius: '123px 0px 0px 123px',
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
                             type={showPasswordPhone ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
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
                                 InputProps={{
                                   endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePasswordPhone} edge="end">
                                            {showPasswordPhone ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                        />
                    </FormControl>
                     {error && (
                    <Typography sx={{ color: 'red', textAlign: 'center', mt: 1 }}>
                        {error}
                    </Typography>
                    )}
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
                            to="/Auth/forgot-password"
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
                    

                </Box>
                )}
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
                        Don’t have an account?{' '}
                        <Link
                            component={RouterLink}
                            to="/Auth/create-account"
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
                    
            </Grid>
            {/* Right column */}
            <Grid item xs={12} sm={6}  sx={{
                display: {
                xs: 'none', 
                sm: 'block' 
                },
                 backgroundImage:`url(${backgroundTexture})`,
                 backgroundPosition:'center',
                 backgroundSize:'cover',
                 backgroundRepeat:'no-repeat',
                 padding:'80px 40px',
                 position:'fixed',
                 top:'0',
                 right:'0',
                 bottom:'0'
                
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