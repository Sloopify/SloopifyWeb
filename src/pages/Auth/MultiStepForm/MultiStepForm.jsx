// MultiStepForm.jsx
import React, { useState } from 'react';
import API from "../../../axios/axios";
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
import { Api } from '@mui/icons-material';
// APIs
const Image_Api_URL='/api/v1/auth/register/complete-image';
const Gender_Api_URL='/api/v1/auth/register/complete-gender';
const Birthday_Api_URL='/api/v1/auth/register/complete-birthday';
const Interest_Api_URL='/api/v1/auth/register/complete-interests';





const steps = ['About You', 'Use Case'];

const MultiStepForm = () => {
  // lift state for steps up
  const [formData, setFormData] = useState({
    phone: '',
    dob: null,
    gender: 'male',
    image: null,
    useCase: []
  });

  const handleUseCaseChange = (selectedUseCases) => {
  setFormData((prev) => ({
    ...prev,
    useCase: selectedUseCases
  }));
};
  const [activeStep, setActiveStep] = useState(0);

  // HANDLE NEXT AND SUBMIT DATA 

 const handleNext = async () => {
  const token = localStorage.getItem('token');

  const minAllowedDate = new Date();
  minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 13);

  if (formData.dob > minAllowedDate) {
    alert('You must be at least 13 years old.');
    return;
  }

  if (activeStep < steps.length - 1) {
    setActiveStep((prev) => prev + 1);
    return;
  }

  try {
    // 👇 Consolidate all data you're about to send
    const payload = {
      gender: formData.gender,
      birthday: formData.dob?.toISOString().split('T')[0],
      useCase: formData.useCase,
      image: formData.image,
    };

    // ✅ Log everything once before sending
    console.log('Submitting data:', payload);

    // Upload image (optional)
    if (payload.image && typeof payload.image === 'object') {
      const imageForm = new FormData();
      imageForm.append('image', payload.image);

      await API.post(Image_Api_URL, imageForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Gender
    await API.post(
      Gender_Api_URL,
      { gender: payload.gender },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Birthday
    await API.post(
      Birthday_Api_URL,
      { birthday: payload.birthday },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Use case
    await API.post(
      Interest_Api_URL,
      { useCase: payload.useCase },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('✅ All data submitted!');
  } catch (error) {
    console.error('❌ Error submitting form:', error);
  }
};

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <StepPhoneAndLocation formData={formData} setFormData={setFormData}/>;
      case 1:
        return <StepUseCase formData={formData} setFormData={setFormData} onSelectionChange={handleUseCaseChange}/>;
      default:
        return null;
    }
  };

  return (

    
          <Grid container >
            <Grid item xs={12}  sm={6}  sx={{position:'relative'}}>
              <Box component='div'  sx={{
                
                  backgroundImage:`url(${backgroundTexture})`,
                    backgroundPosition:'center',
                    backgroundSize:'cover',
                    backgroundRepeat:'no-repeat',     
                padding:{
                     xs: '40px 20px',
                     md: '40px 100px'
                },
                  position:'fixed',
                 top:'0',
                 left:'0',
                 bottom:'0',
              
               
            }}>
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
              </Box>
              
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
