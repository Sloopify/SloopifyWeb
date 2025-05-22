// components/StepUseCase.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Grid } from "@mui/joy";
import WorkIcon from '@mui/icons-material/Work';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import PaidIcon from '@mui/icons-material/Paid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EngineeringIcon from '@mui/icons-material/Engineering';
import MemoryIcon from '@mui/icons-material/Memory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const categories = ['Marketing', 'Product', 'Engineering'];

const allUseCases = [
  {
    title: 'Work Stuff',
    description: 'Just the usual boring work stuff I guess',
    icon: <WorkIcon />,
    category: 'Marketing',
  },
   {
    title: 'Work Stuff2',
    description: 'Just2 the usual boring work stuff I guess',
    icon: <WorkIcon />,
    category: 'Marketing',
  },
    {
    title: 'Work Stuff3',
    description: 'Just3 the usual boring work stuff I guess',
    icon: <WorkIcon />,
    category: 'Marketing',
  },
  
  {

    title: 'UI/UX Design',
    description: 'Design apps and prototypes and things.',
    icon: <DesignServicesIcon />,
    category: 'Product',
  },
  {

    title: 'UI/UX Design2',
    description: 'Design2 apps and prototypes and things.',
    icon: <DesignServicesIcon />,
    category: 'Product',
  },
  {
    title: 'Finance',
    description: 'Because I need money to live my life?',
    icon: <PaidIcon />,
    category: 'Marketing',
  },
  {
    title: 'Productivity',
    description: 'Sometimes we need to be productive.',
    icon: <AccessTimeIcon />,
    category: 'Product',
  },
  {
    title: 'Engineering',
    description: 'Build web apps with engineering power',
    icon: <EngineeringIcon />,
    category: 'Engineering',
  },
  {
    title: 'Engineering2',
    description: 'Build 2web apps with engineering power',
    icon: <EngineeringIcon />,
    category: 'Engineering',
  },
  {
    title: 'Machine Learning',
    description: 'To do machine learning and other stuff.',
    icon: <MemoryIcon />,
    category: 'Engineering',
  },
];

const StepUseCase = () => {
  const [selectedCategory, setSelectedCategory] = useState('Engineering');
  const [selectedUseCases, setSelectedUseCases] = useState([]);

  const handleCategoryChange = (_, newCategory) => {
    if (newCategory !== null) setSelectedCategory(newCategory);
  };

  const handleToggleUseCase = (title) => {
    setSelectedUseCases((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const filteredUseCases = allUseCases.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <Box>
      <Typography variant="h5" mb={3}
      sx={{
        fontFamily:'Plus Jakarta Sans',
        fontSize:'36px',
        lineHeight:'44px',
        color:'#1E293B',
        fontWeight:'800'
      }}>
        What are you planning to use our app for?
      </Typography>

      {/* Category Filter */}
      <Grid container sx={{display:'flex',
      justifyContent:'center'
      }}>
     <ToggleButtonGroup
  value={selectedCategory}
  exclusive
  onChange={handleCategoryChange}
  sx={{
    mb: 4,
    opacity: 1,
    borderRadius: '1234px',
    padding: '3px',
    backgroundColor: '#F8FAFC',
    
  }}
>
  {categories.map((cat) => (
    <ToggleButton
      key={cat}
      value={cat}
      sx={{
        backgroundColor: '#F8FAFC',
        borderRadius: '1234px',
        color: '#475569',
        textTransform: 'none',
        borderRadius:'123px',
        fontWeight:'700',
        padding:'15px',
        border:'none',
      
        '&.Mui-selected': {
          backgroundColor: '#fff',
          borderRadius:'120px',
          color: '#1E293B',
          fontFamily:'Plus Jakarta Sans',
          fontWeight:'700',
          
        }
      }}
    >
      {cat}
    </ToggleButton>
  ))}
</ToggleButtonGroup>


      </Grid>
   

      {/* Use Case Cards */}
      <Grid container spacing={2} >
        {filteredUseCases.map((item) => (
          <Grid item xs={12} sm={6} md={6}  key={item.title}>
            <Card
              variant="outlined"
              sx={{
               width:'100%',
                borderRadius: '24px',
                height: '100%',
                border:'2px solid',
                borderColor: selectedUseCases.includes(item.title)
                  ? '#14B8A6'
                  : '#E2E8F0',
              }}
              onClick={() => handleToggleUseCase(item.title)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1} sx={{position:'relative'}}>
                  
                <Checkbox
                  icon={<RadioButtonUncheckedIcon sx={{opacity:'0'}}/>}
                  checkedIcon={<CheckCircleIcon sx={{ color: '#14B8A6',opacity:'1' }} />}
                  sx={{
                  
                    position: 'absolute',
                    top: '-5px',
                    right: '-10px',
                    '& .MuiSvgIcon-root': {
                      fontSize: 24,
                    },
                  }}
                  checked={selectedUseCases.includes(item.title)}
                  onChange={() => handleToggleUseCase(item.title)}
                />
                  <Box ml={1} fontSize="1.5rem"
                  sx={{
                    backgroundColor:  selectedUseCases.includes(item.title)
                  ? '#ECFDF5'
                  : '#F8FAFC',
   
                    width:'48px',
                    height:'48px',
                    borderRadius:'50%',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    color: selectedUseCases.includes(item.title)
                  ? '#14B8A6'
                  : '#475569',
                  }}>
                    {item.icon}
                  </Box>
                </Box>
                <Typography variant="subtitle1" fontWeight={700}
                sx={{
                  color:'#1E293B',
                  fontFamily:'Plus Jakarta Sans',
                  fontSize:'16px',
                  lineHeight:'22px'

                }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{
                  color:'#475569',
                  fontFamily:'Plus Jakarta Sans',
                  fontSize:'14px',
                  lineHeight:'14px',
                  fontWeight:'400',
                  marginTop:'10px'

                }}>
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StepUseCase;
