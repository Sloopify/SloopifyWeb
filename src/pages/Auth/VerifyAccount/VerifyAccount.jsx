import React  from "react";
import Box from '@mui/material/Box';
import { Grid } from "@mui/joy";
import {
        TextField,
        Link,
        Typography,
        Button,
        Divider
        
} from '@mui/material';
// images
import  verifyAccountImg from '../../../assets/verifyAccount/verify-account.png';
import logoImage from '../../../assets/Signin/Logomark.png'; 
import mailIcon from '../../../assets/verifyAccount/mail-out.svg';
import PhoneIcon from '../../../assets/verifyAccount/phone-outcome.svg'

export default function  Verifyaccount  () {

    const inputRefs = React.useMemo(() => Array.from({ length: 4 }, () => React.createRef()), []);
    const [values, setValues] = React.useState(['', '', '', '']);

    const handleChange = (index, event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 1) {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);

      // Focus next input if value entered
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

const [counter, setCounter] = React.useState(45);
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
  // Send new code logic here
  console.log("Resending code...");
  setCounter(45);
  setCanResend(false);
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
                    <Typography 
                    sx={{
                        fontFamily:'Plus Jakarta Sans',
                        fontSize:'18px',
                        fontWeight:'600',
                        color:'#0C1024',
                        textAlign:'center'
                    }}
                    >
                        Enter verification code
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
                    >
                        <Box
                        component="img"
                        src={mailIcon}
                        alt="mail Icon"
                        sx={{
                           marginRight:'10px'
                        }}
                        />
                         Sent code to anorouzi.work@gmail.com
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
                        Sent code to 094 555 6808
                    </Button>
                    {/* code */}
                     <Box display="flex" gap={2} justifyContent="center">
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
                            sx={{ fontFamily:'Inter', fontWeight: 'bold', color: '#14B8A6', textDecoration: 'none' }}
                            >
                            Resend Code
                            </Link>
                        ) : (
                            <>Resend in <Typography component="span" sx={{ fontWeight: 600, display: 'inline' }}>0:{counter.toString().padStart(2, '0')}</Typography></>
                        )}
                        </Typography>

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
                        Verify

                        </Button>


                </Grid>
            </Grid>


            {/* Right column */}
            <Grid item xs={12} sm={6}  sx={{
                    
                    padding:'80px 40px',
                    
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


