import React from "react";
import AppleIcon from  '../assets/Signin/icons/Apple logo.svg';
import GoogleIcon from  '../assets/Signin/icons/Google.svg';
import Box from '@mui/material/Box';
import { Grid } from "@mui/joy";
import { Button, Divider, Typography } from '@mui/material';

const SocialLoginButtons = () =>{
    return (
            <Grid container >
                  <Grid item xs={12} >
                         <Divider
                        sx={{
                            '&::before, &::after': {
                            borderTop: '1px solid #CBD5E1', // customize the line
                            },
                         my: 3,
                        }}
                     >
                        <Typography sx={{ color: '#94A3B8',
                            fontWeight:'800',
                            fontSize:'12px',
                            fontFamily:'Plus Jakarta Sans',
                            lineHeight:'16px'
                         }}>OR</Typography>
                    </Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => alert('Sign up with Google')}
                        sx={{
                            border:'1px solid #ECF0F5',
                            padding:'10px',
                            fontSize:'14px',
                            fontWeight:'400',
                            color:'#5D6778',
                            textTransform:'inherit'
                        }}
                        >
                            <img src={GoogleIcon} alt="AppleIcon" className="icon-material"/> 
                        Log in with Google
                        </Button>
                        <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => alert('Sign up with Facebook')}
                        sx={{
                            border:'1px solid #ECF0F5',
                            padding:'10px',
                            fontSize:'14px',
                            fontWeight:'400',
                            color:'#5D6778',
                            textTransform:'inherit'
                        }}

                        >

                        <img src={AppleIcon} alt="AppleIcon" className="icon-material"/>

                        Log in with Email
                        </Button>
            
                    </Box>
                  </Grid>
            </Grid>
    )
}

export default SocialLoginButtons;