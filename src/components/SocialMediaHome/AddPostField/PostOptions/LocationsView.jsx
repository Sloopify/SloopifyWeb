import React, { useState, useEffect, useRef, useCallback } from 'react';
import API from '../../../../axios/axios';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Grid } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationImage from '../../../../assets/Home/icons/HomeLocation.png';
import MapComponent from './MapComponent'; 

const location_Data_URL = '/api/v1/post/get-user-places';
const create_location_Data_URL = '/api/v1/post/create-user-place';
const search_location_Data_URL = '/api/v1/post/search-user-places';

const LocationsView = ({ onSelectLoocation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationsList, setLocationsList] = useState([]); 
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState({
    name: '',
    city: '',
    country: '',
    coordinates: null 
  });
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Initial fetch of locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await API.get(location_Data_URL);
        const locationsData = res.data?.data || [];
        setLocationsList(locationsData);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    fetchLocations();
  }, []); 

  // Search locations API call
  const searchLocations = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      // If search is empty, fetch initial locations
      try {
        const res = await API.get(location_Data_URL);
        setLocationsList(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
      return;
    }

    setIsSearching(true);
    try {
      const response = await API.post(
        search_location_Data_URL,
        { search: searchQuery },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setLocationsList(response.data?.data || []);
    } catch (err) {
      console.error("Failed to search locations:", err);
      // Optionally show error to user
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search handler
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(searchTerm);
    }, 500); // 500ms debounce delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, searchLocations]);

  const handleCustomLocationSubmit = async () => {
    if (!customLocation.name || !customLocation.city || !customLocation.country || !customLocation.coordinates) {
      alert('Please fill all fields and select a location on the map');
      return;
    }
    
    try {
      const locationData = {
        name: customLocation.name,
        city: customLocation.city,
        country: customLocation.country,
        latitude: customLocation.coordinates.lat.toString(),
        longitude: customLocation.coordinates.lng.toString(),
        status: "active"
      };

      const response = await API.post(create_location_Data_URL, locationData);
      
      const newLocation = {
        id: response.data.id || `custom-${Date.now()}`,
        name: customLocation.name,
        address: `${customLocation.city}, ${customLocation.country}`,
        coordinates: customLocation.coordinates,
        isCustom: true
      };
      
      onSelectLoocation(newLocation);
      setLocationsList(prev => [...prev, newLocation]);
      setShowCustomLocation(false);
      
      setCustomLocation({
        name: '',
        city: '',
        country: '',
        coordinates: null
      });
      
    } catch (err) {
      console.error("Failed to save location:", err);
      alert('Failed to save location. Please try again.');
    }
  };

  const handleMapClick = (coordinates) => {
    setCustomLocation(prev => ({
      ...prev,
      coordinates
    }));
  };

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <TextField
          placeholder="Search locations..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '70%',
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
              Height: '48px',
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
            endAdornment: isSearching ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null
          }}
        />
        <Button 
          sx={{
            width: '25%',
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: '700',
            fontSize: '16px',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid #CBD5E1',
            color: '#475569'
          }}
          onClick={() => setShowCustomLocation(true)}
        >
          Custom Place
        </Button>
      </Box>

      <Grid container sx={{
        marginTop: '20px', 
        padding: '20px 10px',
        border: '1px solid #E5E5E5',
        borderRadius: '12px'
      }}>
        <Typography sx={{
          color: '#000000',
          fontSize: '18px',
          fontFamily: 'Plus Jakarta Sans',
          fontWeight: '400',
          lineHeight: '28px',
          p: 2,
        }}> 
          {searchTerm ? 'Search Results' : 'Location suggestions'}
        </Typography>
        
        {locationsList.length === 0 ? (
          <Typography sx={{ p: 2, color: '#64748B' }}>
            {isSearching ? 'Searching...' : 'No locations found'}
          </Typography>
        ) : (
          locationsList.map((location) => (
            <Grid item xs={12} sm={12} key={location.id}>
              <Box
                onClick={() => onSelectLoocation(location)}
                sx={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                    borderRadius: '12px',
                  },
                  p: 2,
                  borderBottom: '1px solid #E2E8F0'
                }}
              >
                <Box
                  component="img"
                  src={LocationImage}
                  alt={location.name}
                  width={48}
                  height={48}
                />
                <Typography variant="body2"
                  sx={{
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Plus Jakarta Sans',
                    marginLeft: '10px'
                  }}>
                  {location.name}
                </Typography>
              </Box>
            </Grid>
          ))
        )}
      </Grid>

      {/* Custom Location Dialog */}
     {/* Custom Location Dialog */}
      <Dialog open={showCustomLocation} onClose={() => setShowCustomLocation(false)} maxWidth="md"  sx={{
        cursor: 'pointer',
    boxShadow: 'none',
    '& .MuiPaper-root': {
      border: '1px solid #E2E8F0',
      padding: '40px 60px',
      borderRadius: '39px'
    }
      }}>
  <DialogTitle   sx={{
                    textAlign:'center',
                    color: '#1E293B',
                    fontSize: '36px',
                    fontWeight: '800',
                    fontFamily: 'Plus Jakarta Sans',
                    marginLeft: '10px',
                 position:'relative'
                  }}>Add your location</DialogTitle>
                 
                   <IconButton onClick={() => setShowCustomLocation(false)}  sx={{
                                  backgroundColor:'#E5E5E5',
                                  color:'#1E1E1E',
                                  position:'absolute',
                                  right:'40px',
                                  top:'30px'
                                }}>
                                    <ArrowBackIcon color='#1E1E1E'/>
                                </IconButton>
  <DialogContent>
    <Box sx={{ mt: 2 }}>
      <Box sx={{
        padding:'20px',
        border:'1px solid #CBD5E1',
        borderRadius:'20px',
        marginBottom:'30px'
      }}>
        <TextField
          fullWidth
          placeholder='Place Name'
          value={customLocation.name}
          onChange={(e) => setCustomLocation({...customLocation, name: e.target.value})}
          sx={{
            marginBottom:'15px',
            input: {
              color: '#475569',
              padding: '12px 20px',
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
             '& .MuiInputBase-input::placeholder': {
              color: '#475569',
              opacity: '1',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: '500'
            }
          }}
        />
        <TextField
          fullWidth
          placeholder="City"
          sx={{
            marginBottom:'15px',
            input: {
              color: '#475569',
              padding: '12px 20px',
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
             '& .MuiInputBase-input::placeholder': {
              color: '#475569',
              opacity: '1',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: '500'
            }
          }}
          value={customLocation.city}
          onChange={(e) => setCustomLocation({...customLocation, city: e.target.value})}
        />
        <TextField
          fullWidth
          placeholder="Country"
          sx={{
            
            input: {
              color: '#475569',
              padding: '12px 20px',
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
             '& .MuiInputBase-input::placeholder': {
              color: '#475569',
              opacity: '1',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: '500'
            }
          }}
          value={customLocation.country}
          onChange={(e) => setCustomLocation({...customLocation, country: e.target.value})}
        />
      </Box>
      
      <Typography sx={{
                    textAlign:'center',
                    color: '#1E293B',
                    fontSize: '20px',
                    fontWeight: '600',
                    fontFamily: 'Plus Jakarta Sans',
                    marginBottom: '10px'
                  }}>
        Specify the target geographic location
      </Typography>
      
      <Box sx={{ height: '400px', border: '1px solid #CBD5E1', borderRadius: '20px' }}>
       <MapComponent 
        onLocationSelect={(coords) => setCustomLocation(prev => ({
          ...prev, 
          coordinates: coords,
          // Auto-fill coordinates as strings for API compatibility
          latitude: coords.lat.toString(),
          longitude: coords.lng.toString()
        }))}
        onAddressChange={(address) => setCustomLocation(prev => ({
          ...prev,
          name: address.place || prev.name,
          city: address.city || prev.city,
          country: address.country || prev.country,
          // Update place types if available
          placeTypes: address.placeTypes || prev.placeTypes
        }))}
        addressFields={{
          place: customLocation.name,
          city: customLocation.city,
          country: customLocation.country
        }}
        initialCoordinates={customLocation.coordinates}
        showSearchBox={true}
        placeTypes={[
          'restaurant',
          'cafe',
          'pharmacy',
          'store',
          'point_of_interest',
          'establishment'
        ]}
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          height: '400px'
        }}
      />
      </Box>
      
      {customLocation.coordinates && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected: {customLocation.coordinates.lat.toFixed(4)}, {customLocation.coordinates.lng.toFixed(4)}
        </Typography>
      )}
    </Box>
  </DialogContent>
  <DialogActions>
    
    <Button 
    fullWidth
      onClick={handleCustomLocationSubmit}
      variant="contained"
      disabled={!customLocation.name || !customLocation.city || !customLocation.country || !customLocation.coordinates}
      sx={{
        color:'#fff',
        fontFamily:'Plus Jakarta Sans',
        fontWeight:'700',
        fontSize:'20px',
        backgroundColor:'#14B8A6',
        padding:'12px',
        borderRadius:'12px'
      }}
    >
      Save custom place
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default LocationsView;