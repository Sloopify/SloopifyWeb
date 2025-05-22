// MultiStepForm.jsx
import React, { useState } from 'react';
// components
import StepUseCase from '../../../components/MultiStepLogin/StepUseCase';
import ProgressStepper from '../../../components/MultiStepLogin/ProgressStepper';
import StepPhoneAndLocation from '../../../components/MultiStepLogin/StepPhoneAndLocation';
import { Box, Button } from '@mui/material';
import { Grid } from "@mui/joy";
// images
import backgroundTexture from '../../../assets/Signin/bg/bg.png';
import TellUsImage from '../../../assets/StepForm/tell-about.png';
import ArrowLeft from '../../../assets/StepForm/arrow-left.svg';
import ArrowRight from '../../../assets/StepForm/arrow-right.svg'


const steps = ['About You', 'Use Case'];

const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <StepPhoneAndLocation />;
      case 1:
        return <StepUseCase />;
      default:
        return null;
    }
  };

  return (
          <Grid container >
            <Grid item xs={12}  sm={6}  
             sx={{
                  backgroundImage:`url(${backgroundTexture})`,
                    backgroundPosition:'center',
                    backgroundSize:'cover',
                    backgroundRepeat:'no-repeat',     
                padding:{
                     xs: '40px 20px',
                     md: '40px 100px'
                }
               
            }}
            >
              <Box
                component="img"
                src={TellUsImage}
                alt="TellUs Image"
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
            <Grid item xs={12} sm={6}  
             sx={{
                padding:{
                     xs: '40px 20px',
                     md: '80px 40px'
                }
               
            }}
            >
            
              {renderStep()}
              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button onClick={handleBack} disabled={activeStep === 0}
                sx={{
                  fontFamily:'Plus Jakarta Sans',
                  color:'#475569',
                  fontSize:'16px',
                  fontWeight:'700',
                  lineHeight:'22px'
                  
                }}>

                <Box
                component="img"
                src={ArrowLeft}
                alt="ArrowLeft"
                sx={{
                  marginRight:'15px'
                }}
                />                     
                  Back
                </Button>
                 <ProgressStepper activeStep={activeStep} steps={steps} />
                <Button onClick={handleNext}
                 sx={{
                  fontFamily:'Plus Jakarta Sans',
                  color:'#475569',
                  fontSize:'16px',
                  fontWeight:'700',
                  lineHeight:'22px'
                  
                }}>
                  {activeStep === steps.length - 1 ? 'Submit' : 'Next'}

                <Box
                component="img"
                src={ArrowRight}
                alt="Arrow Right"
                sx={{
                  marginLeft:'15px'
                }}
                />     
                </Button>
                
              </Box>
            </Grid>
      </Grid>
     

  );
};

export default MultiStepForm;
