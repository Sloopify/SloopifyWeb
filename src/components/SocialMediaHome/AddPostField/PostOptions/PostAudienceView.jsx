import React, { useState } from 'react';
import {
  Paper, Typography, RadioGroup, Radio,
  FormControlLabel, TextField, Divider
} from '@mui/material';

const audienceOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Friends', value: 'friends' },
  { label: 'Specific Friends', value: 'specific-friends' },
  { label: 'Only Me', value: 'only-me' },
  { label: 'Friends except', value: 'friends-except' }
];

const PostAudiencePanel = ({audience, setAudience}) => {

  const handleChange = (event) => {
    setAudience(event.target.value);
  };

  return (
    <Paper sx={
      {
        boxShadow:'none'
      }
    } >
      <Typography sx={{
        fontFamily:'Plus Jakarta Sans',
        fontSize:'14px',
        fontWeight:'700',
        lineHeight:'20px',
        color:'#1E293B',
        mt:3
      }} gutterBottom>
       Who can see your post?
      </Typography>
      <Typography 
       sx={{
        fontFamily:'Plus Jakarta Sans',
        fontSize:'14px',
        fontWeight:'400',
        lineHeight:'20px',
        color:'#475569',
        mb:3
      }}>
       Your post will appear in your feed, on your profile, and in search results.
      Your default audience is set to Public, but you can change the audience for this post.
      </Typography>

      <RadioGroup value={audience} onChange={handleChange} sx={{padding:'8px 20px',
        border:'1px solid #E5E5E5',
        borderRadius:'12px',
         '& .MuiSvgIcon-root': {
      fontSize: 24,          // Optional: change size
      color: '#14B8A6',      // Color of the radio circle
    },
    '&.Mui-checked .MuiSvgIcon-root': {
      color: '#14B8A6',  
    },
     fontFamily:'Plus Jakarta Sans',
        fontSize:'16px',
        fontWeight:'600',
        lineHeight:'20px',
        color:'#1E293B',
        mb:3
      }}>
        {audienceOptions.map((option) => {
          return (
            <FormControlLabel
             key={option.value}
            value={option.label}
            control={<Radio />}
            label={<Typography variant="subtitle1">{option.label}</Typography>}
              sx={{ alignItems: 'center', my: 1 }}
            />
          );
        })}
      </RadioGroup>
    </Paper>
  );
};

export default PostAudiencePanel;
