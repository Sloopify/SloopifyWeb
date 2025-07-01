import React, {useState, useEffect} from "react";
import { useUser } from "../../../context/UserContext";
import API from "../../../axios/axios";
import Box from '@mui/material/Box';
import { Grid } from "@mui/joy";
import {
        TextField,
        Link,
        Typography,
        Button,
        Divider
        
} from '@mui/material';
import { useNavigate } from "react-router-dom";
// images
import  verifyAccountImg from '../../../assets/verifyAccount/verify-account.png';
import logoImage from '../../../assets/Signin/Logomark.png'; 
import mailIcon from '../../../assets/verifyAccount/mail-out.svg';
import PhoneIcon from '../../../assets/verifyAccount/phone-outcome.svg';
import CachedIcon from '@mui/icons-material/Cached';

const SEND_EMAIL_OTP_URL='/api/v1/auth/register/send-otp';
const VERIFY_OTP_URL='/api/v1/auth/register/verify-otp';


export default function  Verifyaccount  () {
    const navigate=useNavigate();
    // userData
    const { userData } = useUser();
    
    const [method, setMethod] = useState('email'); // or 'phone'
    const [showOTP, setShowOTP] = useState(false);
    const [message, setMessage] = useState('');
    const [sendingCode, setSendingCode] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const [otp, setOtp] = useState('');
    
    const [verifyMessage, setVerifyMessage] = useState('');

    const inputRefs = React.useMemo(() => Array.from({ length: 6 }, () => React.createRef()), []);
    const [values, setValues] = React.useState(['', '', '', '', '', '']);

    const handleChange = (index, event) => {
  const value = event.target.value.replace(/[^0-9]/g, '');
  if (value.length <= 1) {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    setOtp(newValues.join(''));

    // Focus next input
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
//  resend code 

const [counter, setCounter] = React.useState(300);
const minutes = Math.floor(counter / 60);
const seconds = counter % 60;
const [canResend, setCanResend] = React.useState(false);


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


const handleResend = () => {
  console.log("Resending code...");
  if (method) {
    handleSendCode(method); // use last selected method
    setCounter(300);
    setCanResend(false);
  } else {
    console.warn("No method selected yet.");
  }
};

const handleSendCode = async (type) => {
  try {
    setSendingCode(true);
    const payload = {
      type,
      ...(type === 'email' ? { email: userData.email } : { phone: userData.phone })
    };
    console.log("Sending payload:", payload);

    await API.post(SEND_EMAIL_OTP_URL, payload); 
    setShowOTP(true);
    setCanResend(false);
    setCounter(300); // start 30 sec timer again if needed
  } catch (err) {
    console.error("Error sending code:", err);
  } finally {
    setSendingCode(false);
  }
};


  // Handle Verify
 const handleVerify = async () => {
    try {
      setVerifying(true);
      const payload = {
        type: method,
        ...(method === 'email' ? { email: userData.email } : { phone: userData.phone }),
        otp,
      };
      console.log("Sending payload verify:", payload);


      const res = await API.post(VERIFY_OTP_URL, payload); 
      navigate("/");
      
     

    } catch (error) {
      console.error('Verification failed:', error);
      setVerifyMessage('❌ Invalid or expired OTP.');
    } finally {
    setVerifying(false);
    }
  };



    return (
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
                <h1 className="heading" >Verify account</h1>
                <Grid item xs={12} 
                sx={{
                    padding: {
                        xs:'60px 10px',
                        md:'60px 50px',
                    },
                    border:'1px solid #ECF0F5',
                    boxShadow:'2px 2px 10px 0px rgba(0, 0, 0, 0.01)',
                    marginTop:'40px'
                }}
                >
                  {/* send code */}
                  {!showOTP && (
                    <Box>
                      <Typography 
                        sx={{
                          fontFamily:'Plus Jakarta Sans',
                          fontSize:'18px',
                          fontWeight:'600',
                          color:'#0C1024',
                          textAlign:'left'
                        }}
                      >
                        Select which contact details should we use to verify your account
                      </Typography>

                      {/* Select Email */}
                      <Button
                        fullWidth
                        sx={{
                          padding:'12px 24px',
                          fontFamily:'Plus Jakarta Sans',
                          fontSize:{ xs:'10px', md:'16px' },
                          fontWeight:'700',
                          border: '1px solid',
                          borderColor: method === 'email' ? '#14B8A6' : '#ECF0F5',
                          color:'#5D6778' ,
                          backgroundColor: 'transparent',
                          margin:'30px 0px',
                          backgroundColor: 'transparent'
                        }}
                        onClick={() => setMethod('email')}
                      >
                        <Box component="img" src={mailIcon} alt="mail Icon" sx={{ marginRight:'10px' }} />
                        Send code to {userData.email}
                      </Button>

                      <Divider sx={{ '&::before, &::after': { borderTop: '1px solid #CBD5E1' } }}>
                        <Typography sx={{ color: '#94A3B8', fontWeight:'800', fontSize:'12px', fontFamily:'Plus Jakarta Sans' }}>OR</Typography>
                      </Divider>

                      {/* Select Phone */}
                      <Button
                        fullWidth
                        sx={{
                          padding:'12px 24px',
                          fontFamily:'Plus Jakarta Sans',
                          fontSize:{ xs:'10px', md:'16px' },
                          fontWeight:'700',
                           border: '1px solid',
                          borderColor: method === 'phone' ? '#14B8A6' : '#ECF0F5',
                          color:'#5D6778' ,
                          backgroundColor: 'transparent',
                          margin:'30px 0px',
                          backgroundColor: 'transparent'
                        }}
                        onClick={() => setMethod('phone')}
                      >
                        <Box component="img" src={PhoneIcon} alt="phone Icon" sx={{ marginRight:'10px' }} />
                        Send code to {userData.phone}
                      </Button>

                      {/* Send Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={sendingCode}
                        onClick={() => handleSendCode(method)}
                        sx={{
                          backgroundColor:'#14B8A6',
                          padding:'12px',
                          fontFamily:'Inter',
                          fontWeight:'600',
                          fontSize:'16px',
                          borderRadius:'8px',
                          boxShadow:'none',
                          textTransform:'capitalize',
                          marginTop: '20px'
                        }}
                      >
                        {sendingCode ? 'Sending code...' : 'Send Code'}
                      </Button>
                    </Box>

                 )}
                  
                    {/* code */}
                    {showOTP && (
                    <Box>
                      <Typography 
                    sx={{
                        fontFamily:'Plus Jakarta Sans',
                        fontSize:'18px',
                        fontWeight:'600',
                        color:'#0C1024',
                        textAlign:'left',
                      
                    }}
                    >
                       Enter verification code
                    </Typography>
                       <Typography
                    sx={{
                        fontFamily:'Plus Jakarta Sans',
                        fontSize:'18px',
                        fontWeight:'400',
                        color:'#0C1024',
                        textAlign:'left',
                        marginBottom:'40px'
                    }}
                    >
                          We just sent a code to your {method === 'email' ? 'email' : 'phone number'}: <strong>{method === 'email' ? userData.email : userData.phone}</strong>
                    </Typography>
                     <Box display="flex" gap={2} justifyContent="center" >
                        {values.map((val, index) => (
                            <TextField
                            key={index}
                            inputRef={inputRefs[index]}
                            value={val}
                            onChange={(e) => handleChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            inputProps={{
                                maxLength: 1,
                                style: { textAlign: 'center', fontSize: '20px', width: '24px', height:'24px', color:'#5D6778' },
                            }}
                            />
                        ))}
                        </Box>
                        {/* resend code */}
                        <Typography sx={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', fontWeight:'400' ,color:'#5D6778', fontFamily:'Inter'}}>
                        {canResend ? (
                            <Link
                            component="button"
                            onClick={handleResend}
                            sx={{ fontFamily:'Inter', fontWeight: 'bold', color: '#14B8A6', textDecoration: 'none',lineHeight:'24px',display:'flex',alignItems:'center',justifyContent:'center',width:'100%' }}
                            >
                            Resend Code <CachedIcon sx={{marginLeft:'10px',color:'#475569',fontSize:'18px',lineHeight:'24px'}}/>
                            </Link>
                        ) : (
                            <>Resend in <Typography component="span" sx={{ fontWeight: 600, display: 'inline' }}>{minutes}:{seconds.toString().padStart(2, '0')}</Typography></>
                        )}
                        </Typography>
                          <p sx={{fontFamily:'Plus Jakarta Sans',
                          textAlign:'center',
                          fontWeight: 'bold', color: '#14B8A6'

                          }}>{verifyMessage}</p>

                         <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={handleVerify} 
                        disabled={verifying}
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
                        {verifying ? 'Verifying...' : 'Verify'}

                        </Button>
                    </Box>)}

                </Grid>
            </Grid>


            {/* Right column */}
            <Grid item xs={12} sm={6}  sx={{
                    
                    padding:' 40px',
                     display: {
                    xs: 'none', 
                    sm: 'block' 
                    },
                     position:'fixed',
                 top:'0',
                 right:'0',
                
                }}>
                <Box
                component="img"
                src={verifyAccountImg}
                alt="verify Account Img"
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


