import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import API from "../../../axios/axios";
import { useUser } from '../../../context/UserContext'; // ✅

import StepUseCase from '../../../components/MultiStepLogin/StepUseCase';
import ProgressStepper from '../../../components/MultiStepLogin/ProgressStepper';
import StepPhoneAndLocation from '../../../components/MultiStepLogin/StepPhoneAndLocation';
import AlertMessage from '../../../components/Alert/alertMessage';


import { Box, Button } from '@mui/material';
import { Grid } from "@mui/joy";

import backgroundTexture from '../../../assets/Signin/bg/bg.png';
import TellUsImage from '../../../assets/StepForm/tell-about.png';
import ArrowLeft from '../../../assets/StepForm/arrow-left.svg';
import ArrowRight from '../../../assets/StepForm/arrow-right.svg';

// APIs
const Image_Api_URL = '/api/v1/auth/register/complete-image';
const Gender_Api_URL = '/api/v1/auth/register/complete-gender';
const Birthday_Api_URL = '/api/v1/auth/register/complete-birthday';
const Interest_Api_URL = '/api/v1/auth/register/complete-interests';


const steps = ['About You', 'Use Case'];

const MultiStepForm = () => {
  const { userData } = useUser(); // ✅ Access userData
  const navigate = useNavigate();

  const [redirectToHome, setRedirectToHome] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');


  const [formData, setFormData] = useState({
    phone: '',
    dob: null,
    gender: 'male',
    image: null,
    useCase: [],
  });

  // Prefill form + set step on mount
  useEffect(() => {
    if (!userData) return;

    console.log(userData);
    // Prefill fields if available
    setFormData(prev => ({
    ...prev,
    phone: userData.phone || '',
    gender: userData.userGender || 'male',            // use userGender string
    dob: userData.userBirthday ? new Date(userData.userBirthday) : null,
    image: userData.profileImage || null,              // use profileImage URL
    useCase: Array.isArray(userData.interests) ? userData.interests : [], // if interests is not array, default empty
  }));
    console.log('FormData',formData)

    // Determine which step to start on
    const onboarding = {
      gender: userData.gender !== '',
      birthday:userData.birthday,
      image: userData.image,
      interests: userData.interests ,
    };
console.log('onboarding',onboarding);
    // First incomplete step
    if (!onboarding.gender || !onboarding.birthday || !onboarding.image) {
      setActiveStep(0);
    } else if (!onboarding.interests) {
      setActiveStep(1);
    } else {
      // If everything is completed, go to home
      setRedirectToHome(true);
    }

  }, [userData]);

  
  

  const handleUseCaseChange = (selectedUseCases) => {
    setFormData((prev) => ({
      ...prev,
      useCase: selectedUseCases
    }));
  };

const handleNext = async () => {
  const token = localStorage.getItem('token');
  const errors = [];

  const minAllowedDate = new Date();
  minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 13);

if (activeStep === 0) {
  const errors = [];

  const minAllowedDate = new Date();
  minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 13);

  if (formData.dob && formData.dob > minAllowedDate) {
     setErrorMessage('You must be at least 13 years old.');
  }

  if (errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }

  try {
    setIsSubmitting(true);

    // ⬆️ Submit gender only if provided
    if (formData.gender) {
      await API.post(Gender_Api_URL, { gender: formData.gender }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // ⬆️ Submit birthday if provided
    if (formData.dob) {
      await API.post(Birthday_Api_URL, {
        birthday: formData.dob.toISOString().split('T')[0],
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // ⬆️ Submit image if it's a File object
    if (formData.image && typeof formData.image === 'object') {
      const imageForm = new FormData();
      imageForm.append('image', formData.image);

      await API.post(Image_Api_URL, imageForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
    }

    setActiveStep((prev) => prev + 1);
  } catch (error) {
    console.error('❌ Error submitting step 1:', error);
    const message = error?.response?.data?.message || error?.message || 'Something went wrong.';
    setErrorMessage(message);


  } finally {
    setIsSubmitting(false);
  }
}
 else if (activeStep === 1) {
    // Validate and submit Step 2: useCase (interests)
    if (!formData.useCase || formData.useCase.length === 0) {
      alert('At least one interest must be selected.');
      return;
    }

    try {
      setIsSubmitting(true);

      await API.post(Interest_Api_URL, {
        interests: formData.useCase.map(String),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  // console.log('✅ Fake API success!');

      // ✅ Done
      navigate('/referred', { replace: true });
       

    } catch (error) {
      console.error('❌ Error submitting interests:', error);
        const message = error?.response?.data?.message || error?.message || 'Something went wrong.';
  setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
      
    }
  }
};


  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <StepPhoneAndLocation formData={formData} setFormData={setFormData} />;
      case 1:
        return <StepUseCase formData={formData} setFormData={setFormData} onSelectionChange={handleUseCaseChange} />;
      default:
        return null;
    }
  };

  if (redirectToHome) {
    return <Navigate to="/referred" replace />;
  }

  return (
    <Grid container>
      <Grid item xs={12} sm={6} sx={{ position: 'relative' }}>
        <Box
          component="div"
          sx={{
            backgroundImage: `url(${backgroundTexture})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            padding: { xs: '40px 20px', md: '40px 100px' },
            display: { xs: 'none', md: 'block' },
            position: 'fixed',
            top: '0',
            left: '0',
            bottom: '0',
          }}
        >
          <Box
            component="img"
            src={TellUsImage}
            alt="TellUs Image"
            sx={{
              width: { xs: '250px', md: '500px' },
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              margin: 'auto',
            }}
          />
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          padding: { xs: '40px 20px', md: '80px 40px' },
        }}
      >
        {renderStep()}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button onClick={handleBack} disabled={activeStep === 0}
            sx={{
              fontFamily: 'Plus Jakarta Sans',
              color: '#475569',
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '22px',
            }}
          >
            <Box
              component="img"
              src={ArrowLeft}
              alt="ArrowLeft"
              sx={{ marginRight: '15px' }}
            />
            Back
          </Button>

          <ProgressStepper activeStep={activeStep} steps={steps} />

          <Button onClick={handleNext} disabled={isSubmitting}
            sx={{
              fontFamily: 'Plus Jakarta Sans',
              color: '#475569',
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '22px',
            }}
          >
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
        { errorMessage && (
           <AlertMessage severity="error" onClose={() => setErrorMessage(false)} title="Attention">
              {errorMessage}
            </AlertMessage>
        )
        }
       
      </Grid>
    </Grid>
  );
};

export default MultiStepForm;
