import React,{useState}  from "react";
import API from "../../../axios/axios";
import OtpCode from "../../../components/OtpCode";
import { useNavigate } from 'react-router-dom';

// ui
import Box from '@mui/material/Box';
import { Grid } from "@mui/joy";
import {
        TextField,
        FormControl,
        Link,
        Typography,
        Button,
        ToggleButton,
        ToggleButtonGroup,
        
} from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
// images
import backgroundTexture from '../../../assets/Signin/bg/bg.png';
import ForgotPasswordImge from '../../../assets/ForgotPassword/ForgotPassword.png';
import logoImage from '../../../assets/Signin/Logomark.png'; 
import mailIcon from '../../../assets/verifyAccount/mail-out.svg';
import PhoneIcon from '../../../assets/verifyAccount/phone-outcome.svg';
import LockScreen from '../../../assets/ForgotPassword/LockSimple.svg';
import goBackIicon from '../../../assets/ForgotPassword/CaretLeft.svg'
import emailIcone from '../../../assets/Signin/icons/email.svg';

// router
import { Link as RouterLink } from 'react-router-dom';
import { useUser } from "../../../context/UserContext";

// APIs
const SEND_OTP_PASSWORD_EMAIL='/api/v1/auth/forgot-password/send-otp';
const VERIFY_OTP_PASSWORD_EMAIL='/api/v1/auth/forgot-password/verify-otp';

const ForgotPassword = () =>{
    const navigate = useNavigate();
    const { userData, setUserData } = useUser();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [passwordType, setPasswordType] = useState('emailPassword');
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

    const handlePasswordTypehange = (_, newType) => {
    if (newType !== null) setPasswordType(newType);
    };
    // Send otp to email
    const handleSendEmailCode = async (e) => {
    e.preventDefault();
 
    try {
        const payload = {
        type: 'email',
        email,
        };
        console.log("Sending forgot password email:", payload);

        await API.post(SEND_OTP_PASSWORD_EMAIL, payload); 
        setOtpSent(true); 
       
        alert("Code sent to your email.");
    } catch (err) {
        console.error("Error sending forgot password code:", err);
        alert("Failed to send reset code.");
    }
    };
    // Send otp to mobile 
    const handleSendPhoneCode = async (e) => {
        setOtpSent(true); 
        e.preventDefault();
    try {
        const payload = {
        type: 'phone',
        phone,
        };
        console.log("Sending forgot password phone:", payload);

        await API.post(SEND_OTP_PASSWORD_EMAIL, payload); 
       
        alert("Code sent to your phone.");
    } catch (err) {
        console.error("Error sending forgot password code:", err);
        alert("Failed to send reset code.");
    }
    };
    // Handle verify
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
          const res = await API.post(VERIFY_OTP_PASSWORD_EMAIL, payload);
    
          if (res.data?.success) {
            navigate('/Auth/change-password', { state: { email } });
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

    const handleResend =  async (e) => {
    console.log("Resending code...");
    try {
        const payload = {
        type: 'email',
        email,
        };
        console.log("Sending forgot password email:", payload);

        await API.post(SEND_OTP_PASSWORD_EMAIL, payload); 
        setOtpSent(true); 
       
        alert("Code sent to your email.");
    } catch (err) {
        console.error("Error sending forgot password code:", err);
        alert("Failed to send reset code.");
    }    setCounter(300);
    setCanResend(false);
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

                    {!otpSent && (
                    <>
                    {/* toggle buttons */}
                    <Box sx={{display:'fles',justifyContent:'center',marginTop:'20px'}}>
                        <ToggleButtonGroup
                        value={passwordType}
                        exclusive
                        onChange={handlePasswordTypehange}
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
                        }} value="emailPassword">Email</ToggleButton>
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
                        }} value="phonePassword">Phone</ToggleButton>
                        </ToggleButtonGroup>
                    </Box> 
                     {/* Email Signin  Form */}
                    {passwordType ==='emailPassword' && (
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2,mt:3 }} onSubmit={handleSendEmailCode}>         
                    {/* email */}
                    <FormControl>
                        
                        <TextField
                            required
                            fullWidth
                            id="email"
                            placeholder="elementary221b@gmail.com"
                            value={email}
                            onChange={(e) => {
                           setEmail( e.target.value);
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
                                    paddingLeft:'40px',
                                    Height:'48px',
                                    backgroundImage:`url(${emailIcone})`,
                                    backgroundPosition:'15px',
                                    backgroundRepeat:'no-repeat',
                                    backgroundSize:'20px',
                                     marginBottom:'10px',
                                    '&.Mui-focused': {
                                        boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                                    },
                                     '& input:-webkit-autofill': {
                                    WebkitBoxShadow: '0 0 0 1000px white inset',
                                    WebkitTextFillColor: '#1E293B', // Optional: sets text color
                                    transition: 'background-color 5000s ease-in-out 0s',
                                    
                                    },
                                    },
                                }}
                        
                        
                        />
                    </FormControl>

               
                     {error && (
                    <Typography sx={{ color: 'red', textAlign: 'center', mt: 1 }}>
                        {error}
                    </Typography>
                    )}
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
                    
                    

                    </Box>
                    )}
                    {/* Phone Signin Form */}
                    {passwordType ==='phonePassword' && (
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2,mt:3 }} onSubmit={handleSendPhoneCode}>         
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
                            }}
                            inputStyle={{ 
                                width: '100%',
                                border: '1px solid #D4D4D4',
                                borderRadius: '123px',
                                color: '#5D6778',
                                height: '48px',
                                marginBottom:'20px'
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
                    
                        {error && (
                        <Typography sx={{ color: 'red', textAlign: 'center', mt: 1 }}>
                            {error}
                        </Typography>
                        )}

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
                            marginTop:'19px',
                            
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
                    </Box>
                    )}
                    </>

                    )}

                    {otpSent && (
                        <>
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
                        </>
                    )}
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
                    display:{
                        xs:'none',
                        md:'block'
                    },
                    position:'fixed',
                    right:'0',
                    top:'0',
                    bottom:'0'
                    
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