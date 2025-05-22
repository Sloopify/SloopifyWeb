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
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const StepPhoneAndLocation = () => {
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState('male');

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

      {/* Phone Input */}
      <Box mb={3}>
        <Typography variant="body1" mb={1}
        sx={{
          fontFamily:'Plus Jakarta Sans',
          fontWeight:'500',
          fontSize:'16px',
          lineHeight:'24px',
          color:'#5D6778'
        }}
        >Enter your phone number</Typography>
        <PhoneInput
          country={'sy'}
          enableSearch={true}
          countryCodeEditable	={true}
          value={phone}
          onChange={(phone) => setPhone(phone)}
          inputStyle={{ 
            width: '100%',
           border:'1px solid #D4D4D4',
            borderRadius:'8px',
            color:'#5D6778',
             height:'48px'
           }}
           buttonStyle={{
            backgroundColor:'#F8FAFC',
            border:'1px  solid #D4D4D4',
            borderRadius:'8px 0px 0px 8px',
           }}
           containerStyle={{
            height:'48px'
           }}
           searchStyle={{
            width:'90%',
            padding:'10px',
            border:'1px solid #D4D4D4',

           }}
          specialLabel={''}
          containerClass="custom-phone-input"
         
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
            onChange={(newValue) => setDob(newValue)}
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
          onChange={(e) => setGender(e.target.value)}
        >
          <FormControlLabel 

          sx={{
            fontFamily:'Plus Jakarta Sans',
            color:'#5D6778',
            fontSize:'16px',
            fontWeight:'600',
            lineHeight:'22px',
            width:'50%'
          }}
          value="male" control={<Radio 
          sx={{
            color: '#5D6778', 
          
            '&.Mui-checked': {
              color: '#14B8A6', 
            },
          }}/>} label="Male" />
          <FormControlLabel
           sx={{
            fontFamily:'Plus Jakarta Sans',
            color:'#5D6778',
            fontSize:'16px',
            fontWeight:'600',
            lineHeight:'22px',
            width:'40%'
          }}
           value="female" control={<Radio 
           sx={{
            color: '#475569', 
            '&.Mui-checked': {
              color: '#14B8A6', 
            },
          }}/>} label="Female" />
        </RadioGroup>
      </Box>

      {/* Location Picker (Google Map Embed) */}
      <Box mb={3}>
        <Typography variant="body1" mb={1}
         sx={{
          fontFamily:'Plus Jakarta Sans',
          fontWeight:'500',
          fontSize:'16px',
          lineHeight:'24px',
          color:'#5D6778',
          marginBottom:'10px'
        }}>Select your location:</Typography>
        <Box
          component="iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19806.270823399105!2d-0.1300471!3d51.5073506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b333d8c3d47%3A0xdee57c34ae89955!2sLondon!5e0!3m2!1sen!2suk!4v1678724975042!5m2!1sen!2suk"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </Box>
    </Box>
  );
};

export default StepPhoneAndLocation;
