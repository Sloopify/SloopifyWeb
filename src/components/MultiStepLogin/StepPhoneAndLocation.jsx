// components/StepPhoneAndLocation.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// images
import MaleOption from '../../../src/assets/StepForm/male.png';
import FemaleOption from '../../../src/assets/StepForm/female.png';
import CameraImage from '../../../src/assets/StepForm/Camera.png'



const StepPhoneAndLocation = ({ formData, setFormData }) => {
  
  const { phone, dob, gender, image} = formData;


  const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    setFormData((prev) => ({
      ...prev,
      image: file, // store the actual File object
      gender: 'custom',
    }));
  }
};


  return (
    <Box>
      <Typography variant="h5" mb={3}
        sx={{
          fontFamily:'Plus Jakarta Sans',
          fontWeight:'800',
          fontSize:'36px',
          lineHeight:'44px',
          letterSpacing:'-1.4%'
        }}
      >
        Tell us about yourself
      </Typography>
         {/* Upload Image (separate) */}
        <Box
          component="label"
          htmlFor="upload-image"
          sx={{
            width: 130,
            height: 130,
            borderRadius: '24px',
            border: '2px solid #14B8A6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
            backgroundColor: '#fff',
            '&:hover': {
              borderColor: '#14B8A6',
            },
            margin:'10px auto 20px'
          }}
        >
         {formData.image && typeof formData.image === 'object' ? (
            <img src={URL.createObjectURL(formData.image)} alt="Preview"    
            style={{ width: '100%', height: '100%', objectFit: 'conatin' }}/>
          ) : (
            <Box component='img'
            src={CameraImage}/>

          )}
          <input
            id="upload-image"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </Box>
    

      {/* Date Picker */}
      <Box mb={3}>
        <Typography variant="body1" mb={1}
        sx={{
          fontFamily:'Plus Jakarta Sans',
          fontWeight:'500',
          fontSize:'16px',
          lineHeight:'24px',
          color:'#5D6778'
        }}
        >Date of Birth</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            fullWidth
            value={dob}
              sx={{
                width:'100%',
                borderRadius: '8px',
               outline:'0px',
                border:'0px',
                padding:'0px',

                  
                '& .MuiPickersInputBase-root.MuiPickersOutlinedInput-root ': {
                  height: '48px',
                  padding:'10px',
                 borderRadius:'8px',
                 color:'#5D6778',
                 opacity:'1',

                  border:'1px solid #D4D4D4'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#14B8A6',
                },
                '& .MuiPickersOutlinedInput-notchedOutline': {
                  borderWidth:'0px',
                   color:'#5D6778',
                },
              
              }}
             onChange={(newValue) => setFormData(prev => ({ ...prev, dob: newValue }))}
            renderInput={(params) => <TextField fullWidth
              
              {...params} 
              />}
          />
        </LocalizationProvider>
      </Box>

      {/* Gender Selection */}
      <Box mb={3}>
        <FormLabel component="legend" 
         sx={{
          fontFamily:'Plus Jakarta Sans',
          fontWeight:'500',
          fontSize:'16px',
          lineHeight:'24px',
          color:'#5D6778',
          marginBottom:'10px'
        }}>
          Select your gender:
        </FormLabel>
        <RadioGroup
          row
          value={gender}
          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
        >
           <FormControlLabel
        value="male"
        control={
          <Radio
            sx={{
              display: 'none',
            }}
          />
        }
        label={
          <img
            src={MaleOption} // female icon example
            alt="Female"
            style={{
             
              cursor: 'pointer',
              borderRadius: '24px',
              border: gender === 'male' ? '3px solid #14B8A6' : '3px solid transparent',
              transition: 'border-color 0.3s',
            }}
          />
        }
        sx={{ margin: 0 }}
      />
           <FormControlLabel
        value="female"
        control={
          <Radio
            sx={{
              display: 'none',
            }}
          />
        }
        label={
          <img
            src={FemaleOption}
            alt="Female"
            style={{
              marginLeft:'10px',
              cursor: 'pointer',
              borderRadius: '24px',
              border: gender === 'female' ? '3px solid #14B8A6' : '3px solid transparent',
              transition: 'border-color 0.3s',
            }}
          />
        }
        sx={{ margin: 0 }}
      />
        </RadioGroup>
      </Box>

     
    
    </Box>
  );
};

export default StepPhoneAndLocation;
