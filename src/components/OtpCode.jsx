import React from "react";
import { Grid } from "@mui/joy";
// ui
import { 
        Link,
        Typography,
        Button,
        
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


export default function  OtpCode  () {
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
        <Grid container>
            <Grid item xs={12}>
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
    )
}



