import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  
} from '@mui/material';
import { Grid } from "@mui/joy";

import SearchIcon from '@mui/icons-material/Search';
import feelingsData from '../../../../data/feelingsData';

const FeelingsView = ({ onSelectFeeling }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFeelings = feelingsData.filter(feeling =>
    feeling.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{marginTop:'20px'}}>
      <TextField
        fullWidth
        placeholder="Search feelings..."
        variant="outlined"
        size="small"

        value={searchTerm}
        onClick={(e)=> onSelectFeeling()}
        onChange={(e) => setSearchTerm(e.target.value)}
           sx={{
                input: { color: '#475569', 
                        padding:'12px',
                        border:'0px',
                        borderRadius: '123px',
                        backgroundColor:'#fff'
                        },
                        '& .MuiOutlinedInput-root': {
                        borderRadius: '123px',
                        border: '0px solid #CBD5E1',
                                  
                        Height:'48px',
                        backgroundColor:'#fff',
                        marginBottom:'0px',
                        '&.Mui-focused': {
                         boxShadow: 'none',
                        },
                    },
                    }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Grid container  sx={{marginTop:'20px'}}>
        {filteredFeelings.map((feeling) => (
          <Grid item xs={12} sm={12} key={feeling.label}>
            <Box
              onClick={() => onSelectFeeling(feeling)}
              sx={{
                cursor: 'pointer',
                textAlign: 'left',
                display:'flex',
                alignItems:'center',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  borderRadius: '12px',
                },
                p: 2,
                borderBottom:'1px solid #E2E8F0'

              }}
            >
              <Box
                component="img"
                src={feeling.icon}
                alt={feeling.label}
                width={48}
                height={48}
              />
              <Typography variant="body2"
              sx={{
                color:'#475569',
                fontSize:'14px',
                fontWeight:'700',
                fontFamily:'Plus Jakarta Sans',
                marginLeft:'10px'
              }}>{feeling.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeelingsView;
