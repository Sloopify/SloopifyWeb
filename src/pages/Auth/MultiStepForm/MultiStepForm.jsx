// MultiStepForm.jsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
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
const [redirectToHome, setRedirectToHome] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);


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

  // 👉 If not on last step, go to next step without validating
  if (activeStep < steps.length - 1) {
    setActiveStep((prev) => prev + 1);
    return;
  }

  // ✅ Validation only for last step
  const errors = [];

  const minAllowedDate = new Date();
  minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 13);

  if (!formData.gender) errors.push('Gender is required.');
  if (!formData.dob) {
    errors.push('Birthday is required.');
  } else if (formData.dob > minAllowedDate) {
    errors.push('You must be at least 13 years old.');
  }
  if (!formData.image) errors.push('Profile image is required.');
  if (!formData.useCase || formData.useCase.length === 0)
    errors.push('At least one interest must be selected.');

  if (errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }

  try {
    setIsSubmitting(true);

    const payload = {
      gender: formData.gender,
      birthday: formData.dob?.toISOString().split('T')[0],
      interests: formData.useCase.map(String),
      image: formData.image,
    };

    console.log('Submitting data:', payload);

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

    await API.post(Gender_Api_URL, { gender: payload.gender }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await API.post(Birthday_Api_URL, { birthday: payload.birthday }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await API.post(Interest_Api_URL, { interests: payload.interests }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('✅ All data submitted!');
    setRedirectToHome(true);
  } catch (error) {
    console.error('❌ Error submitting form:', error);
  } finally {
    setIsSubmitting(false);
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

  if (redirectToHome) {
  return <Navigate to="/" replace />;
}

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
                display:{
                  xs: 'none',
                  md: 'block'
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
                disabled={isSubmitting}
                 sx={{
                  fontFamily:'Plus Jakarta Sans',
                  color:'#475569',
                  fontSize:'16px',
                  fontWeight:'700',
                  lineHeight:'22px'
                  
                }}>
                  {isSubmitting ? 'Submitting...' : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                  {!isSubmitting && (
                    <Box
                      component="img"
                      src={ArrowRight}
                      alt="Arrow Right"
                      sx={{ marginLeft: '15px' }}
                    />
                  )}
                    
                </Button>
                
              </Box>
            </Grid>
      </Grid>
     

  );
};

export default MultiStepForm;
