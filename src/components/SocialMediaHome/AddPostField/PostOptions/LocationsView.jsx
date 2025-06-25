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
  IconButton,
  Pagination
} from '@mui/material';
import { Grid } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationImage from '../../../../assets/Home/icons/RoadLocation.svg';
import LocationInfo from '../../../../assets/Home/icons/locationInfo.png'
import MapComponent from './MapComponent'; 

const location_Data_URL = '/api/v1/post/get-user-places';
const create_location_Data_URL = '/api/v1/post/create-user-place';
const search_location_Data_URL = '/api/v1/post/search-user-places';
const GET_location_BY_ID = '/api/v1/post/get-user-place-by-id';
const UPDATE_USER_LOCATION = '/api/v1/post/update-user-place';

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

  // Pagiation view
  const [locationPage, setLocationPage]= useState(1);
  const [locationTotalPage, setLocationTotalPage] = useState(1);
  const perPage = 10;

  // view/edit location 

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewLocationData, setViewLocationData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState({
      location: false,
    });


  // Initial fetch of locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(prev => ({...prev, location: true}));
        const res = await API.post(location_Data_URL,{
          page: String(locationPage),
          per_page: String(perPage)
        },
         {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
        const locationsData = res.data?.data?.user_places || [];
        setLocationsList(locationsData);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      } finally {
        setLoading(prev => ({...prev, location: false}));
      }
    };
    fetchLocations();
  }, [locationPage]); 

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
  // Handle Submit Location
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


  // handle View Location
  const handleViewLocation = async (locationId) => {
    try {
      const response = await API.post(
        GET_location_BY_ID,
        { place_id: locationId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data?.data;

      setViewLocationData({
        id: data.id,
        name: data.name,
        city: data.city,
        country: data.country,
        coordinates: {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude)
        }
      });

      setIsEditing(false);
      setViewDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch location by ID:", error);
      alert("Failed to load location.");
    }
  };



  // handle Update Location 
const handleUpdateLocation = async () => {
  if (
    !viewLocationData.name ||
    !viewLocationData.coordinates?.lat ||
    !viewLocationData.coordinates?.lng
  ) {
    alert("Please fill all required fields and select a location.");
    return;
  }

  try {
    const payload = {
      place_id: viewLocationData.id,
      name: viewLocationData.name,
      city: viewLocationData.city || '',
      country: viewLocationData.country || '',
      latitude: viewLocationData.coordinates.lat.toString(),
      longitude: viewLocationData.coordinates.lng.toString(),
      status: 'active'
    };

    await API.post(UPDATE_USER_LOCATION, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    // ✅ Update the list immediately without re-fetching
    setLocationsList((prevList) =>
      prevList.map((loc) =>
        loc.id === viewLocationData.id
          ? {
              ...loc,
              name: viewLocationData.name,
              city: viewLocationData.city,
              country: viewLocationData.country,
              coordinates: viewLocationData.coordinates
            }
          : loc
      )
    );

    alert("Location updated successfully.");
    setIsEditing(false); // optionally keep modal open in view mode
  } catch (error) {
    console.error("Failed to update location:", error);
    alert("Failed to update location.");
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

         {loading.location && (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Grid>
          )}
        
        {locationsList.length === 0 ? (
          <Typography sx={{ p: 2, color: '#64748B' }}>
            {isSearching ? 'Searching...' : ''}
          </Typography>
        ) : (
          <>
          { locationsList.map((location) => (
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
                <Box>
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
            
                     <Typography variant="body2"
                    sx={{
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: '400',
                      fontFamily: 'Plus Jakarta Sans',
                      marginLeft: '10px'
                    }}>
                    {location.city}, {location.country}
                  </Typography>

                </Box>
              
                <IconButton
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleViewLocation(location.id); 
                }}
                sx={{
                  position:'absolute',
                  right:'60px'
                }}>
                    <Box component='img'
                    src={LocationInfo}/>
                </IconButton>
               
              </Box>
            
            </Grid>
            
          ))}
           <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                          <Pagination
                            count={locationTotalPage}
                            page={locationPage}
                            onChange={(e, value) => setLocationPage(value)}
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
                              },
                              '& .MuiButtonBase-root-MuiPaginationItem-root.Mui-selected': {
                                backgroundColor: '#14B8A6', 
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: '#14B8A6',
                                }
                              },
                            }}
                            shape="rounded"
                          />
                        </Grid>
          </>
         
        )}
      </Grid>

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


      {/* edit / view location Dialog */}

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md"  sx={{
        cursor: 'pointer',
        boxShadow: 'none',
        '& .MuiPaper-root': {
          border: '1px solid #E2E8F0',
          padding: '40px 60px',
          borderRadius: '39px'
        }
      }}>
        <DialogTitle   
        sx={{
            textAlign:'center',
            color: '#1E293B',
            fontSize: '36px',
            fontWeight: '800',
            fontFamily: 'Plus Jakarta Sans',
            marginLeft: '10px',
            position:'relative'
          }}>
          {isEditing ? 'Edit Location' : 'View Location'}
        </DialogTitle>
         <IconButton  onClick={() => setViewDialogOpen(false)}  sx={{
                                  backgroundColor:'#E5E5E5',
                                  color:'#1E1E1E',
                                  position:'absolute',
                                  right:'60px',
                                  top:'60px'
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
                    placeholder="Place Name"
                    value={viewLocationData?.name || ''}
                    onChange={(e) => setViewLocationData({ ...viewLocationData, name: e.target.value })}
                    InputProps={{ readOnly: !isEditing }}
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
                    value={viewLocationData?.city || ''}
                    onChange={(e) => setViewLocationData({ ...viewLocationData, city: e.target.value })}
                    InputProps={{ readOnly: !isEditing }}
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
                    placeholder="Country"
                    value={viewLocationData?.country || ''}
                    onChange={(e) => setViewLocationData({ ...viewLocationData, country: e.target.value })}
                    InputProps={{ readOnly: !isEditing }}
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
                </Box>
                  

                  <MapComponent
                    initialCoordinates={viewLocationData?.coordinates}
                    onLocationSelect={(coords) => {
                      if (!isEditing) return;
                      setViewLocationData((prev) => ({
                        ...prev,
                        coordinates: coords
                      }));
                    }}

                    onAddressChange={(address) => setCustomLocation(prev => ({
                      ...prev,
                      name: address.place || prev.name,
                      city: address.city || prev.city,
                      country: address.country || prev.country,
                      // Update place types if available
                      placeTypes: address.placeTypes || prev.placeTypes
                    }))}
                    editable={isEditing}
                    showSearchBox={isEditing}
                    style={{ height: '300px', borderRadius: '12px' }}
                  />

                  {viewLocationData?.coordinates && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Coordinates: {viewLocationData.coordinates.lat.toFixed(4)}, {viewLocationData.coordinates.lng.toFixed(4)}
                    </Typography>
                  )}
              </Box>
         
        </DialogContent>

        <DialogActions>
          {!isEditing ? (
            <>
              <Button fullWidth onClick={() => setIsEditing(true)} variant="contained" 
                  sx={{
                  color:'#fff',
                  fontFamily:'Plus Jakarta Sans',
                  fontWeight:'700',
                  fontSize:'20px',
                  backgroundColor:'#14B8A6',
                  padding:'12px',
                  borderRadius:'12px'
                }}>
                Edit
              </Button>
            
            </>
          ) : (
            <>
              <Button onClick={handleUpdateLocation} variant="contained" 
                sx={{
                  width:'70%',
                color:'#fff',
                fontFamily:'Plus Jakarta Sans',
                fontWeight:'700',
                fontSize:'20px',
                backgroundColor:'#14B8A6',
                padding:'12px',
                border:'1px solid #14B8A6',
                borderRadius:'12px'
              }}>
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} sx={{
                  width:'30%',
                color:'#475569',
                fontFamily:'Plus Jakarta Sans',
                fontWeight:'700',
                fontSize:'20px',
                backgroundColor:'#fff',
                padding:'12px',
                borderRadius:'12px',
                border:'1px solid #CBD5E1'
              }}>Cancel</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default LocationsView;