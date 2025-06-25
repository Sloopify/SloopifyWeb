import React, { useState, useEffect } from 'react';
import API from '../../../../axios/axios';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Pagination 
} from '@mui/material';
import { Grid } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const feelings_Data_URL = '/api/v1/post/get-feeling';
const search_feelings_Data_URL = '/api/v1/post/search-feeling';
const activities_Data_URL = '/api/v1/post/get-activity-category';
const search_activities_Data_URL = '/api/v1/post/search-activity-by-category';
const activities_by_category_URL = '/api/v1/post/get-activity-by-category-name'; 

const FeelingsView = ({ onSelectFeeling, onSelectActivity,postType,onPostTypeChange,setPostType  }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [feelingsList, setFeelingsList] = useState([]);
  const [activitiesList, setActivitiesList] = useState([]);
  const [activitiesByCategory, setActivitiesByCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState({
    feelings: false,
    activities: false,
    activitiesByCategory: false
  });
  
  // pagination state
  const [feelingsPage, setFeelingsPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesByCategoryPage, setActivitiesByCategoryPage] = useState(1);
  const perPage = 10;

  const [feelingsTotalPages, setFeelingsTotalPages] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);
  const [activitiesByCategoryTotalPages, setActivitiesByCategoryTotalPages] = useState(1);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (postType === 'feelings') {
          setLoading(prev => ({...prev, feelings: true}));
          const feelingsRes = await API.post(feelings_Data_URL, {
            page: String(feelingsPage),
            per_page: String(perPage)
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setFeelingsList(feelingsRes.data?.data.feelings || []);
          setFeelingsTotalPages(feelingsRes.data?.data?.pagination?.last_page || 1);
        } else if (!selectedCategory) {
          setLoading(prev => ({...prev, activities: true}));
          const activitiesRes = await API.post(activities_Data_URL, {
            page: String(activitiesPage),
            per_page: String(perPage)
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          const formattedActivities = activitiesRes.data?.data?.categories.map(activity => ({
            id: activity,
            name: activity,
            image: `https://dev.sloopify.com/public/storage/activities/${activity}.svg`
          })) || [];
          setActivitiesList(formattedActivities);
          setActivitiesTotalPages(activitiesRes.data?.data?.pagination?.last_page || 1);
        }
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      } finally {
        setLoading(prev => ({...prev, feelings: false, activities: false}));
      }
    };
    fetchInitialData();
  }, [postType, feelingsPage, activitiesPage, selectedCategory]);

  // Fetch activities by category when a category is selected
  useEffect(() => {
    const fetchActivitiesByCategory = async () => {
      if (!selectedCategory) return;
      
      try {
        setLoading(prev => ({...prev, activitiesByCategory: true}));
        const res = await API.post(activities_by_category_URL, {
          category: selectedCategory,
          page: String(activitiesByCategoryPage),
          per_page: String(perPage)
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setActivitiesByCategory(res.data?.data?.activities || []);
        setActivitiesByCategoryTotalPages(res.data?.data?.pagination?.last_page || 1);
      } catch (err) {
        console.error("Failed to fetch activities by category:", err);
      } finally {
        setLoading(prev => ({...prev, activitiesByCategory: false}));
      }
    };
    fetchActivitiesByCategory();
  }, [selectedCategory, activitiesByCategoryPage]);

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
          setFeelingsList(res.data?.data?.feelings || []);
        } else if (!selectedCategory) {
          const res = await API.post(
            search_activities_Data_URL,
            { search: searchTerm },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          const formattedActivities = res.data?.data?.categories.map(activity => ({
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
          API.post(feelings_Data_URL, {
            page: String(feelingsPage),
            per_page: String(perPage)
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then(res => setFeelingsList(res.data?.data?.feelings || []))
            .catch(err => console.error("Failed to fetch feelings:", err));
        } else if (!selectedCategory) {
          API.post(activities_Data_URL, {
            page: String(activitiesPage),
            per_page: String(perPage)
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then(res => {
              const formattedActivities = res.data?.data?.categories.map(activity => ({
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
  }, [searchTerm, postType, selectedCategory]);

  const handlePostTypeChange = (_, newType) => {
    if (newType !== null) {
      setPostType(newType);
      setSelectedCategory(null); // Reset selected category when switching types
      setSearchTerm(''); 
      setFeelingsPage(1);
      setActivitiesPage(1);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchTerm(''); // Reset search term when selecting a category
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setActivitiesByCategoryPage(1);
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

  const renderActivityCategoryItem = (activity) => (
    <Box
      onClick={() => handleCategorySelect(activity.name)}
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
        src={activity.image || `https://dev.sloopify.com/public/storage/activities/${activity}.svg`}
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
        {selectedCategory && (
          <Grid item xs={12}>
            <Box 
              onClick={handleBackToCategories}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#475569',
                mb: 2,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <ArrowBackIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Back to categories
              </Typography>
            </Box>
          </Grid>
        )}
        
        <TextField
          fullWidth
          placeholder={
            selectedCategory 
              ? `Search in ${selectedCategory}...` 
              : `Search ${postType === 'feelings' ? 'feelings' : 'categories'}...`
          }
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
            endAdornment: (
              loading[postType] || 
              (postType === 'activity' && selectedCategory && loading.activitiesByCategory)
            ) && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            )
          }}
        />

        {loading[postType] || (postType === 'activity' && selectedCategory && loading.activitiesByCategory) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, width: '100%' }}>
            <CircularProgress />
          </Box>
        ) : postType === 'feelings' ? (
          feelingsList.length > 0 ? (
            <>
              {feelingsList.map(feeling => (
                <Grid item xs={12} sm={12} key={feeling.id}>
                  {renderFeelingsItem(feeling)}
                </Grid>
              ))}
              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={feelingsTotalPages}
                  page={feelingsPage}
                  onChange={(e, value) => setFeelingsPage(value)}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily:'Plus Jakarta Sans',
                      fontWeight:'700',
                      color: '#1E293B', // Text color
                      fontSize: '14px',
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#14B8A6', 
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#14B8A6',
                      }
                    },
                    '& .MuiPaginationItem-ellipsis': {
                      color: '#94a3b8',
                    }
                  }}
                  shape="rounded"
                />
              </Grid>
            </>
          ) : (
            <Typography sx={{ p: 2, color: '#64748B' }}>
              {searchTerm ? 'No feelings found' : 'No feelings available'}
            </Typography>
          )
        ) : selectedCategory ? (
          activitiesByCategory.length > 0 ? (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
                  {selectedCategory}
                </Typography>
              </Grid>
              {activitiesByCategory.map(activity => (
                <Grid item xs={12} sm={12} key={activity.id || activity.name}>
                  {renderActivityItem(activity)}
                </Grid>
              ))}
              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={activitiesByCategoryTotalPages}
                  page={activitiesByCategoryPage}
                  onChange={(e, value) => setActivitiesByCategoryPage(value)}
                    sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily:'Plus Jakarta Sans',
                      fontWeight:'700',
                      color: '#1E293B', // Text color
                      fontSize: '14px',
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#14B8A6', 
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#14B8A6',
                      }
                    },
                    '& .MuiPaginationItem-ellipsis': {
                      color: '#94a3b8',
                    }
                  }}
                  shape="rounded"
                />
              </Grid>
            </>
          ) : (
            <Typography sx={{ p: 2, color: '#64748B' }}>
              {searchTerm ? 'No activities found' : 'No activities available in this category'}
            </Typography>
          )
        ) : activitiesList.length > 0 ? (
          <>
            {activitiesList.map(activity => (
              <Grid item xs={12} sm={12} key={activity.id}>
                {renderActivityCategoryItem(activity)}
              </Grid>
            ))}
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              
            </Grid>
          </>
        ) : (
          <Typography sx={{ p: 2, color: '#64748B' }}>
            {searchTerm ? 'No categories found' : 'No categories available'}
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default FeelingsView;