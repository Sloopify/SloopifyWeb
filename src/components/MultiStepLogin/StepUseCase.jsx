// components/StepUseCase.jsx
import React, { useState,useEffect, useRef  } from 'react';
import API from '../../axios/axios';
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
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const INTEREST_LIST_OPTION='/api/v1/auth/register/get-interests-by-category-name';
const CATEGORY_API='/api/v1/auth/register/get-interest-category';


//   {
//     title: 'Work Stuff',
//     description: 'Just the usual boring work stuff I guess',
//     icon: <WorkIcon />,
//     category: 'Marketing',
//   },
//    {
//     title: 'Work Stuff2',
//     description: 'Just2 the usual boring work stuff I guess',
//     icon: <WorkIcon />,
//     category: 'Marketing',
//   },
//     {
//     title: 'Work Stuff3',
//     description: 'Just3 the usual boring work stuff I guess',
//     icon: <WorkIcon />,
//     category: 'Marketing',
//   },
  
//   {

//     title: 'UI/UX Design',
//     description: 'Design apps and prototypes and things.',
//     icon: <DesignServicesIcon />,
//     category: 'Product',
//   },
//   {

//     title: 'UI/UX Design2',
//     description: 'Design2 apps and prototypes and things.',
//     icon: <DesignServicesIcon />,
//     category: 'Product',
//   },
//   {
//     title: 'Finance',
//     description: 'Because I need money to live my life?',
//     icon: <PaidIcon />,
//     category: 'Marketing',
//   },
//   {
//     title: 'Productivity',
//     description: 'Sometimes we need to be productive.',
//     icon: <AccessTimeIcon />,
//     category: 'Product',
//   },
//   {
//     title: 'Engineering',
//     description: 'Build web apps with engineering power',
//     icon: <EngineeringIcon />,
//     category: 'Engineering',
//   },
//   {
//     title: 'Engineering2',
//     description: 'Build 2web apps with engineering power',
//     icon: <EngineeringIcon />,
//     category: 'Engineering',
//   },
//   {
//     title: 'Machine Learning',
//     description: 'To do machine learning and other stuff.',
//     icon: <MemoryIcon />,
//     category: 'Engineering',
//   },
// ];
const StepUseCase = ({ formData, setFormData, onSelectionChange }) => {
  const [allUseCases, setAllUseCases] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const selectedUseCases = formData.useCase || [];
  const scrollRef = useRef();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };
  const scrollRight = () => {
  scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };


  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get(CATEGORY_API);
        const categoryList = res.data?.data || [];
        console.log('Category API response:', res.data);

        setCategories(categoryList);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Set default selectedCategory when categories load
  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Fetch use cases when selectedCategory changes
  useEffect(() => {
    const fetchUseCases = async () => {
      if (!selectedCategory) return;
      try {
        const res = await API.post(INTEREST_LIST_OPTION, {
          category_name: selectedCategory,
          perPage: '6',
          page: '1',
        });
        const interestGroups = res.data.data.interests;
        const flattened = interestGroups.flatMap(group =>
          group.interests.map(item => ({
            id: item.id,
            title: item.name,
            description: '',
            iconUrl: item.web_icon,
            category: group.category,
          }))
        );
        setAllUseCases(flattened);
      } catch (err) {
        console.error("Failed to fetch use cases:", err);
      }
    };
    fetchUseCases();
  }, [selectedCategory]);


const handleCategoryChange = (_, newCategory) => {
  if (newCategory !== null) {
    const index = categories.indexOf(newCategory);
    setSelectedIndex(index);
    setSelectedCategory(newCategory);
  }
};
const scrollToCategory = (index) => {
  const btn = scrollRef.current?.children?.[0]?.children?.[index];
  if (btn) {
    btn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }
  setSelectedCategory(categories[index]);
  setSelectedIndex(index);
};


const handleNextCategory = () => {
  const next = selectedIndex + 1;
  if (next < categories.length) scrollToCategory(next);
};

const handlePrevCategory = () => {
  const prev = selectedIndex - 1;
  if (prev >= 0) scrollToCategory(prev);
};

 const handleToggleUseCase = (id) => {
  const updated = selectedUseCases.includes(id)
    ? selectedUseCases.filter((item) => item !== id)
    : [...selectedUseCases, id];

  setFormData((prev) => ({ ...prev, useCase: updated }));

  if (onSelectionChange) onSelectionChange(updated); // Optional callback
};

  const filteredUseCases = allUseCases.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <Box>
      <Typography
        variant="h5"
        mb={3}
        sx={{
          fontFamily: 'Plus Jakarta Sans',
          fontSize:{
            xs:'26px',
            md:'36px'
          },
          lineHeight: '44px',
          color: '#1E293B',
          fontWeight: '800',
        }}
      >
        What are you planning to use our app for?
      </Typography>

      {/* Category Filter */}
     <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
  <IconButton onClick={handlePrevCategory} disabled={selectedIndex === 0}>
    <ArrowBackIosNewIcon />
  </IconButton>

  <Box
    ref={scrollRef}
    sx={{
      overflowX: 'auto',
      display: 'flex',
      scrollBehavior: 'smooth',
      gap: '10px',
   
      padding:'10px',
      '&::-webkit-scrollbar': { display: 'none' },
    }}
  >
    <ToggleButtonGroup
      value={selectedCategory}
      exclusive
      onChange={handleCategoryChange}
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'nowrap',
         borderRadius: '1234px',
            padding: '5px',
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
            fontWeight: '700',
            fontSize: {
              xs: '12px',
              md: '15px',
            },
            padding: '10px 20px',
            border: 'none',
            '&.Mui-selected': {
              backgroundColor: '#fff',
              borderRadius: '120px',
              color: '#1E293B',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: '700',
            },
          }}
        >
          {cat}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </Box>

  <IconButton onClick={handleNextCategory} disabled={selectedIndex === categories.length - 1}>
    <ArrowForwardIosIcon />
  </IconButton>
</Box>

      {/* Use Case Cards */}
      <Grid container spacing={2}>
        {filteredUseCases.map((item) => (
          <Grid item xs={12} sm={6} md={6} key={item.title}>
            <Card
              variant="outlined"
              sx={{
                width: '100%',
                borderRadius: '24px',
                height: '100%',
                border: '2px solid',
                borderColor: selectedUseCases.includes(item.id)
                  ? '#14B8A6'
                  : '#E2E8F0',
              }}
              onClick={() => handleToggleUseCase(item.id)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1} sx={{ position: 'relative' }}>
                  <Checkbox
                    icon={<RadioButtonUncheckedIcon sx={{ opacity: '0' }} />}
                    checkedIcon={<CheckCircleIcon sx={{ color: '#14B8A6', opacity: '1' }} />}
                    sx={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-10px',
                      '& .MuiSvgIcon-root': {
                        fontSize: 24,
                      },
                    }}
                    checked={selectedUseCases.includes(item.id)}
                    onChange={() => handleToggleUseCase(item.id)}
                  />
                  <Box
                    ml={1}
                    fontSize="1.5rem"
                    sx={{
                      backgroundColor: selectedUseCases.includes(item.id) ? '#ECFDF5' : '#F8FAFC',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: selectedUseCases.includes(item.id) ? '#14B8A6' : '#475569',
                    }}
                  >
                    <img src={item.iconUrl} alt={item.title} style={{ width: 24, height: 24 }} />
                  </Box>
                </Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{
                    color: '#1E293B',
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '16px',
                    lineHeight: '22px',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#475569',
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '14px',
                    lineHeight: '14px',
                    fontWeight: '400',
                    marginTop: '10px',
                  }}
                >
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
