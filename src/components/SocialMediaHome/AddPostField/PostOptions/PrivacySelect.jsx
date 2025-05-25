import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock';

const privacyOptions = {
  public: { label: 'Public', icon: <PublicIcon fontSize="20px" /> },
  friends: { label: 'Friends', icon: <GroupIcon fontSize="20px" /> },
  private: { label: 'Only Me', icon: <LockIcon fontSize="20px" /> }
};

export default function PrivacySelect({ value, onChange }) {
  return (
    <FormControl fullWidth size="small" sx={{mt:1,ml:1, border:'none'}}>
      <Select
        value={value}
        onChange={onChange}
        sx={{
            backgroundColor:'#F1F5F9',
            border:'none',
            borderRadius:'1234px',
            padding:'0px',
            '&. MuiInputBase-root':{
                border:'0px'
            },
            '& .MuiSelect-select ':{
                padding:'5px 10px',
                border:'0px',
                marginLeft:'5px'
            }
            
        }}
        renderValue={(selected) => (
          <Box display="flex" alignItems="center" gap={1}>
            {privacyOptions[selected].icon}
            <Typography 
            sx={{
                fontSize:'12px',
                color:'#475569',
                fontFamily:'Plus Jakarta Sans',
                fontWeight:'700',
                lineHeight:'22px'
            }}
            >{privacyOptions[selected].label}</Typography>
          </Box>
        )}
      >
        {Object.entries(privacyOptions).map(([key, option]) => (
          <MenuItem key={key} value={key}>
            <Box display="flex" alignItems="center" gap={1}>
              {option.icon}
              <Typography>{option.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
