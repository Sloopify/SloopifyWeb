import React, { useState } from "react";
import API from "../../../axios/axios";
import { useNavigate } from "react-router-dom";
// MUI components
import {
  FormControl,
  FormLabel,
  Typography,
  Button,

  TextField,
  Box
} from '@mui/material';
import { Grid } from "@mui/joy";

// imagaes
import backgroundTexture from '../../../assets/Signin/bg/bg.png';
import ReferedByImage from '../../../assets/StepForm/ReferedBy.png';
import logoImage from '../../../assets/Signin/Logomark.png'; 

// api
const REFERED_URL='/api/v1/auth/register/complete-reffer';



const Referred = () => {
    const navigate = useNavigate();
    const [refered, setRefered] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

     const handleSubmit = async (e) => {
        const token = localStorage.getItem('token');

        e.preventDefault();
        setLoading(true);
        setError('');

    try {
      const response = await API.post(REFERED_URL, {
        referred_by_code: refered
      },
     {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Success:', response.data);
      // handle next step, e.g. navigate to next form step or show success message
    } catch (err) {
      console.error('API Error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


    return( 
<Grid container sx={{minHeight:'100vh'}}>
  <Grid item xs={12} sm={6}>
    <Box
      sx={{
        backgroundImage: `url(${backgroundTexture})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        padding: { xs: '40px 20px', md: '20px' },
        display: { xs: 'none', md: 'block' },
        minHeight:'100vh'
      }}
    >
      <Box
        component="img"
        src={ReferedByImage}
        alt="Referred By"
        sx={{
          display: 'block',
          margin: 'auto',
          width: { xs: '250px', md: '450px' },
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </Box>
  </Grid>

  <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding:'80px 30px' }}>
    <Box
      component="img"
      src={logoImage}
      alt="Welcome"
      sx={{ display: 'block', mb: 2, width: 80 }}
    />
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
      Referred by
    </Typography>
    <Typography sx={{ color: '#475569', fontSize: '16px', textAlign: 'center', maxWidth: 400 }}>
      lorem ipsum dolor anet slorem ipsum dolor anet lorem ipsum dolor anet (optional)
    </Typography>
        <Box fullWidth 
        sx={{
            '&.MuiBox-root':{
                width:'100%',
                marginTop:'15px'
            },
            mt:3
        }}
        component='form' onSubmit={handleSubmit}>
        <FormLabel
              htmlFor="confirm-password"
              sx={{
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '700',
                color: '#5D6778',
                fontFamily: 'Plus Jakarta Sans',
                letterSpacing: '-0.084px',
                lineHeight: '20px',
                marginBottom: '6px',
            
              }}
            >
              Referred by 
            </FormLabel>
            <FormControl fullWidth sx={{ mt: 0 }}>
                <TextField
                    required
                    id="referred"
                    placeholder="Referred by"
                    value={refered}
                    onChange={(e) => setRefered(e.target.value)}
                    variant="outlined"
                    sx={{
                    input: {
                        color: '#475569',
                        padding: '8px',
                        border:'0px'
                    },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        border: '0px solid #CBD5E1',
                        height: '48px',
                        '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(0, 188, 212, 0.3)',
                        },
                    },
                    }}
                />
            </FormControl>
                {error && (
            <Typography sx={{ color: 'red', mt: 2 }}>
              {error}
            </Typography>
          )}

            <Button
                        
                        fullWidth
                        variant="contained"
                        sx={{
                             '&.Mui-focused': {
                                boxShadow: 'none',
                            },
                            '&:hover': {
                                boxShadow: 'none',
                            },
                            backgroundColor:'#fff',
                            padding:'12px',
                            fontFamily:'Inter',
                            fontSize:'16px',
                            fontWeight:'500',
                            letterSpacing:'-0.7%',
                            lineHeight:'175%',
                            borderRadius:'12px',
                            textTransform:'capitalize',
                            boxShadow:'none',
                            marginTop:'40px',
                            border:'1px solid #14B8A6',
                            color:'#14B8A6',
                            width:'60%',
                            display:'block',
                            margin:'60px auto 20px'
                        }}
                       onClick={() => navigate('/')}
                        >
                        Skip 
                       

                    </Button>
             <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                             '&.Mui-focused': {
                                boxShadow: 'none',
                            },
                            '&:hover': {
                                boxShadow: 'none',
                            },
                            backgroundColor:'#14B8A6',
                            padding:'12px',
                            fontFamily:'Inter',
                            fontSize:'16px',
                            fontWeight:'500',
                            letterSpacing:'-0.7%',
                            lineHeight:'175%',
                            borderRadius:'12px',
                            textTransform:'capitalize',
                            boxShadow:'none',
                            marginTop:'40px',
                            border:'1px solid #14B8A6',
                            color:'#fff',
                            width:'60%',
                            display:'block',
                            margin:'0px auto 20px'
                        }}
                        >
                        {loading ? 'Submitting...' : 'Continue'} 
                       

                    </Button>
        </Box>
    
  </Grid>
</Grid>


    )
}

export default Referred;
