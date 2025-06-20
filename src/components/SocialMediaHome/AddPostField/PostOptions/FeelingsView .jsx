import React, { useState, useEffect } from 'react';
import API from '../../../../axios/axios';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress
} from '@mui/material';
import { Grid } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';

const feelings_Data_URL = '/api/v1/post/get-feeling';
const search_feelings_Data_URL = '/api/v1/post/search-feeling';
const activities_Data_URL = '/api/v1/post/get-activity-category';
const search_activities_Data_URL = '/api/v1/post/search-activity-by-category';

const FeelingsView = ({ onSelectFeeling, onSelectActivity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [feelingsList, setFeelingsList] = useState([]);
  const [activitiesList, setActivitiesList] = useState([]);
  const [postType, setPostType] = useState('feelings');
  const [loading, setLoading] = useState({
    feelings: false,
    activities: false
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(prev => ({...prev, feelings: true}));
        const feelingsRes = await API.get(feelings_Data_URL);
        setFeelingsList(feelingsRes.data?.data || []);
        
        setLoading(prev => ({...prev, activities: true}));
        const activitiesRes = await API.get(activities_Data_URL);
        // Convert string array to object array for consistent handling
        const formattedActivities = activitiesRes.data?.data?.map(activity => ({
          id: activity, // Using the string as ID
          name: activity,
          image: `https://dev.sloopify.com/public/storage/activities/${activity}.svg` // Example path
        })) || [];
        setActivitiesList(formattedActivities);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      } finally {
        setLoading(prev => ({...prev, feelings: false, activities: false}));
      }
    };
    fetchInitialData();
  }, []);

  // Search handler with debounce
  useEffect(() => {
    const searchData = async () => {
      if (!searchTerm.trim()) return;
      
      try {
        setLoading(prev => ({...prev, [postType]: true}));
        
        if (postType === 'feelings') {
          const res = await API.post(
            search_feelings_Data_URL,
            { search: searchTerm },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          setFeelingsList(res.data?.data || []);
        } else {
          const res = await API.post(
            search_activities_Data_URL,
            { search: searchTerm },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          // Convert string array to object array
          const formattedActivities = res.data?.data?.map(activity => ({
            id: activity,
            name: activity,
            image: `https://dev.sloopify.com/public/storage/activities/${activity}.svg`
          })) || [];
          setActivitiesList(formattedActivities);
        }
      } catch (err) {
        console.error(`Failed to search ${postType}:`, err);
      } finally {
        setLoading(prev => ({...prev, [postType]: false}));
      }
    };

    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        searchData();
      } else {
        // Reset to initial data when search is empty
        if (postType === 'feelings') {
          API.get(feelings_Data_URL)
            .then(res => setFeelingsList(res.data?.data || []))
            .catch(err => console.error("Failed to fetch feelings:", err));
        } else {
          API.get(activities_Data_URL)
            .then(res => {
              const formattedActivities = res.data?.data?.map(activity => ({
                id: activity,
                name: activity,
                image: `https://dev.sloopify.com/public/storage/activities/${activity}.svg`
              })) || [];
              setActivitiesList(formattedActivities);
            })
            .catch(err => console.error("Failed to fetch activities:", err));
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, postType]);

  const handlePostTypeChange = (_, newType) => {
    if (newType !== null) {
      setPostType(newType);
      setSearchTerm(''); // Reset search when switching types
    }
  };

  const renderFeelingsItem = (feeling) => (
    <Box
      onClick={() => onSelectFeeling(feeling)}
      sx={{
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        '&:hover': { backgroundColor: '#f1f5f9', borderRadius: '12px' },
        p: 2,
        borderBottom: '1px solid #E2E8F0'
      }}
    >
      <Box
        component="img"
        src={feeling.web_icon}
        alt={feeling.name}
        sx={{ width: 48, height: 48 }}
      />
      <Typography variant="body2" sx={{
        color: '#475569',
        fontSize: '14px',
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
        marginLeft: '10px'
      }}>
        {feeling.name}
      </Typography>
    </Box>
  );

  const renderActivityItem = (activity) => (
    <Box
      onClick={() => onSelectActivity(activity.name)}
      sx={{
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        '&:hover': { backgroundColor: '#f1f5f9', borderRadius: '12px' },
        p: 2,
        borderBottom: '1px solid #E2E8F0'
      }}
    >
      <Box
        component="img"
        src={activity.image}
        alt={activity.name}
        sx={{ width: 48, height: 48 }}
      />
      <Typography variant="body2" sx={{
        color: '#475569',
        fontSize: '14px',
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
        marginLeft: '10px'
      }}>
        {activity.name}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ marginTop: '20px' }}>
      <ToggleButtonGroup
        value={postType}
        exclusive
        onChange={handlePostTypeChange}
        sx={{
          opacity: 1,
          borderRadius: '1234px',
          padding: '3px',
          backgroundColor: '#F8FAFC',
        }}
      >
        <ToggleButton
          sx={{
            backgroundColor: '#F8FAFC',
            color: '#475569',
            textTransform: 'none',
            borderRadius: '123px',
            fontWeight: '700',
            padding: '10px 15px',
            border: 'none',
            margin: '0px 2px',
            '&.Mui-selected': {
              backgroundColor: '#fff',
              borderRadius: '120px',
              color: '#1E293B',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: '700',
            }
          }}
          value="feelings"
        >
          Feelings
        </ToggleButton>
        <ToggleButton
          sx={{
            backgroundColor: '#F8FAFC',
            color: '#475569',
            textTransform: 'none',
            borderRadius: '123px',
            fontWeight: '700',
            padding: '10px 15px',
            border: 'none',
            margin: '0px 2px',
            '&.Mui-selected': {
              backgroundColor: '#fff',
              borderRadius: '120px',
              color: '#1E293B',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: '700',
            }
          }}
          value="activity"
        >
          Activity
        </ToggleButton>
      </ToggleButtonGroup>

      <Grid container sx={{ marginTop: '20px' }}>
        <TextField
          fullWidth
          placeholder={`Search ${postType}...`}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            input: {
              color: '#475569',
              padding: '12px',
              border: '0px',
              borderRadius: '123px',
              backgroundColor: '#fff'
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '123px',
              border: '0px solid #CBD5E1',
              height: '48px',
              backgroundColor: '#fff',
              marginBottom: '0px',
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
            endAdornment: loading[postType] && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            )
          }}
        />

        {loading[postType] ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, width: '100%' }}>
            <CircularProgress />
          </Box>
        ) : postType === 'feelings' ? (
          feelingsList.length > 0 ? (
            feelingsList.map(feeling => (
              <Grid item xs={12} sm={12} key={feeling.id}>
                {renderFeelingsItem(feeling)}
              </Grid>
            ))
          ) : (
            <Typography sx={{ p: 2, color: '#64748B' }}>
              {searchTerm ? 'No feelings found' : 'No feelings available'}
            </Typography>
          )
        ) : activitiesList.length > 0 ? (
          activitiesList.map(activity => (
            <Grid item xs={12} sm={12} key={activity.id}>
              {renderActivityItem(activity)}
            </Grid>
          ))
        ) : (
          <Typography sx={{ p: 2, color: '#64748B' }}>
            {searchTerm ? 'No activities found' : 'No activities available'}
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default FeelingsView;