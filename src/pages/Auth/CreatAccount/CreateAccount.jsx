import React, { useState } from "react";
import axios from "../../../axios/axios";
import SocialLoginButtons from "../../../components/SocialLoginButtons";
import { Grid } from "@mui/joy";
import backgroundTexture from '../../../assets/Signin/bg/bg.png';
import Box from '@mui/material/Box';
import createAccountImage from '../../../assets/createAccount/create-account.png';
import logoImage from '../../../assets/Signin/Logomark.png'; 
import passwordIcone from '../../../assets/Signin/icons/password.svg';
import signup from '../../../assets/Signin/icons/signup.svg';
import { Link as RouterLink } from 'react-router-dom';


import { FormControl,
        FormLabel,
        Link,
        Typography,
        Button,
        InputAdornment,
        IconButton,
        
        
} from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import TextField from '@mui/material/TextField';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import zxcvbn from 'zxcvbn';
import { width } from "@mui/system";


const getStrengthLabel = (score) => {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Strong'];
  return labels[score];
};

const SIGNUP_URL='/api/v1/auth/register/create-account';

const CreateAccount = ()=>{

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordScore, setPasswordScore] = useState(0);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };
    const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
    };

    const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordScore(zxcvbn(value).score);
    };

    const passwordsMatch = password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            phone, 
            };


            console.log("Payload:", payload);

            const token = localStorage.getItem("authToken"); 


            const res = await axios.post(SIGNUP_URL, payload,
            { headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
            }}
            );
            console.log("Signup successful", res.data);
            // Redirect or show success message
            window.location.href = '/';
        }  catch (err) {
            if (err.response) {
            console.error("Server error:", err.response.data);
            alert(`Signup failed: ${err.response.data.message}`);
            } else {
            console.error("Request error:", err);
            alert("Network or unexpected error occurred.");
            }
        }
    };

    return (
        <Grid container >
             <Grid item xs={12} sm={6}
                sx={{
                    padding:{
                            xs: '40px 20px',
                            md: '40px 100px'
                     }}}>

                    <img src={logoImage} alt="Welcome" className="logo"/>
                    <h1 className="heading" >Let’s Create Your Account.</h1>
                    <Typography
                    sx={{
                        color:'  #475569',
                        textAlign: 'center',
                        fontFamily:'Plus Jakarta Sans',
                        fontSize:'16px',
                        fontWeight:'400'
                    }}
                    >Sign up for free and get started quickly.</Typography>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop:'64px' }} onSubmit={handleSubmit}>  
                        {/* full name */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                   <FormControl
                                        sx={{
                                        width:'100%'
                                        }}
                                   >
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
                                                input: { color: '#707988',
                                                        padding:'12px 24px',
                                                        border:'0px'
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                        borderRadius: '6px',
                                                        border: '0px solid #E2E8F0',
                                                        Height:'48px',
                                                        marginBottom:'10px',
                                                            '&.Mui-focused': {
                                                                boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                                                            },
                                                        },
                                                }}
                                                        
                                                        
                                                        />
                                    </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                 <FormControl
                                    sx={{
                                    width:'100%'
                                 }}
                                 >
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
                                                input: { color: '#707988',
                                                        padding:'12px 24px',
                                                        border:'0px'
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                        borderRadius: '6px',
                                                        border: '0px solid #E2E8F0',
                                                        Height:'48px',
                                                        marginBottom:'10px',
                                                            '&.Mui-focused': {
                                                                boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                                                            },
                                                        },
                                                }}
                                                        
                                                        
                                                        />
                                    </FormControl>
                            </Grid>
                        </Grid>
                        {/* end of full name */}
                        {/* email */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} >
                                <FormControl sx={{
                                    width:'100%'
                                }}>
                                <TextField
                                    required
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email-account"
                                    placeholder="Email"
                                    type="email"
                                    name="emailAccounnt"
                                    autoComplete="email"
                                    variant="outlined"
                                    sx={{
                                            input: { color: '#475569',
                                                padding:'12px 24px',
                                                border:'0px'
                                            },
                                            '& .MuiOutlinedInput-root': {
                                            borderRadius: '6px',
                                            border: '0px solid #CBD5E1',
                                            Height:'48px',
                                        
                                            marginBottom:'10px',
                                            '&.Mui-focused': {
                                                boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                                            },
                                            },
                                        }}
                                
                                
                                />
                                </FormControl>
                            </Grid>
                            {/* phone */}
                            <Grid item xs={12} sm={6} >
                                <FormControl sx={{width:'100%'}}>
                                <PhoneInput
                                country={'sy'}
                                enableSearch={true}
                                countryCodeEditable	={true}
                                name="phone"
                                value={phone}
                                onChange={(value) => setPhone("+" + value)}

                                inputStyle={{ 
                                    width: '100%',
                                border:'1px solid #D4D4D4',
                                    borderRadius:'8px',
                                    color:'#5D6778',
                                    height:'48px'
                                }}
                                buttonStyle={{
                                    backgroundColor:'#F8FAFC',
                                    border:'1px  solid #D4D4D4',
                                    borderRadius:'8px 0px 0px 8px',
                                }}
                                containerStyle={{
                                    height:'48px'
                                }}
                                searchStyle={{
                                    width:'90%',
                                    padding:'10px',
                                    border:'1px solid #D4D4D4',

                                }}
                                specialLabel={''}
                                containerClass="custom-phone-input"
                                required
                            />
                            </FormControl>
                            </Grid>
                         </Grid>
                        
                        {/* end of email */}
                        {/* password grid */}
                        <Grid container spacing={3}>
                            {/* Password */}
                            <Grid item xs={12} sm={6}>
                                 <FormControl 
                                 sx={{
                                    width:'100%'
                                 }}
                                 >
                                    <FormLabel
                                        sx={{
                                            textAlign:'left',
                                            fontSize:'14px',
                                            fontWeight:'700',
                                            color:'#5D6778',
                                            fontFamily:'Plus Jakarta Sans',
                                            letterSpacing:' -0.084px',
                                            lineHeight:'20px',
                                            marginBottom:'6px',
                                            }}
                                    htmlFor="create-password">Password</FormLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        className="field password-field"
                                        name="password"
                                        value={password}
                                        placeholder="*****************"
                                        type={showPassword ? 'text' : 'password'}
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
                                                marginBottom:'8px',
                                                '&.Mui-focused': {
                                                    boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                                                },
                                                },
                                            }}
                                    />
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
                                       <Typography variant="body2"
                                       sx={{ 
                                            color:'#475569',
                                            fontSize:'14px'
                                         }}>
                                            Password strength: {getStrengthLabel(passwordScore)}
                                        </Typography>
                                </FormControl>
                            </Grid>
                            {/* confirm password */}
                             <Grid item xs={12} sm={6}>
                                <FormControl
                                sx={{
                                    width:'100%'
                                 }}
                                >
                                    <FormLabel
                                        sx={{
                                            textAlign:'left',
                                            fontSize:'14px',
                                            fontWeight:'700',
                                            color:'#5D6778',
                                            fontFamily:'Plus Jakarta Sans',
                                            letterSpacing:' -0.084px',
                                            lineHeight:'20px',
                                            marginBottom:'6px',
                                            }}
                                    htmlFor="confirm-password">Confirm Password</FormLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        className="field password-field"
                                        name="ConfirmPassword"
                                        placeholder="*****************"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        
                                        id="confirm-password"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                          onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                          
                                            }}
                                      
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
                                                input: { color: '#475569', 
                                                    padding:'12px',
                                                    border:'0px',
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
                                                margin:'0px',
                                                '&.Mui-focused': {
                                                    boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                                                },
                                                },
                                            }}
                                    />
                                </FormControl>
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
                            boxShadow:'none',
                            marginTop:'50px'
                        }}
                          disabled={!passwordsMatch || password.length === 0 || confirmPassword.length === 0}
                        >
                        Sign Up
                        <img src={signup} alt="signup" className="signup-img"/>

                        </Button>
                         {/* end of password grid */}
                    </Box>
                    <SocialLoginButtons />
                    
                        <Typography sx={{
                                                 textAlign: 'left' ,
                                                 fontFamily:'Plus Jakarta Sans',
                                                 fontWeight:'400',
                                                 fontSize:'14px',
                                                 letterSpacing:'-0.6%',
                                                 lineHeight:'20px',
                                                 color:'#27364B',
                                                 marginTop:'20px'
                                                }}>
                                                Have an account? {' '}
                                                <Link
                                                    component={RouterLink}
                                                    to="/"
                                                    variant="body2"
                                                    underline="none"
                                                    sx={{ 
                                                        alignSelf: 'center',
                                                        fontFamily:'Plus Jakarta Sans',
                                                        fontWeight:'500',
                                                        fontSize:'14px',
                                                        letterSpacing:'-0.6%',
                                                        lineHeight:'20px',
                                                        color:'#27364B'
                        
                                                     }}
                                                >
                                                     Log In
                                                </Link>
                                            </Typography>
                </Grid>
                {/* Right column */}
                <Grid item xs={12} sm={6}  sx={{
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
                src={createAccountImage}
                alt="create Account"
                sx={{
                    display:'block',
                    margin:'auto',
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
    )


}

export default CreateAccount;
