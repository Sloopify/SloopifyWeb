import React, { useState, useEffect } from 'react';
import API from '../../../../axios/axios';
import {
  TextField,
  Avatar,
  Typography,
  Box,
  Chip,
  InputAdornment,
  Pagination,
  CircularProgress
} from '@mui/material';
import { Grid } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

const FriendsView = ({ selected, setSelected, handleRemove, apiUrls }) => {
  const [friendsList, setFriendsList] = useState([]); 
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState({
    friends: false,
    search: false
  });

  // Pagination view
  const [friendsPage, setFriendsPage] = useState(1);
  const [friendsTotalPage, setFriendsTotalPage] = useState(1);
  const perPage = 10;

  // Fetch friends data
  const fetchFriends = async (searchQuery = '', page = friendsPage) => {
    try {
      setLoading(prev => ({...prev, friends: true}));
      
      let res;
      if (searchQuery.trim()) {
        // Search API call
        res = await API.post(apiUrls.search || apiUrls.get, {
          search: searchQuery,
          page: String(page),
          per_page: String(perPage)
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        // Regular get friends API call
        res = await API.post(apiUrls.get, {
          page: String(page),
          per_page: String(perPage)
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      
      const friends = res.data?.data?.friends || [];
      setFriendsList(friends);
      setFriendsTotalPage(res.data?.data?.pagination?.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    } finally {
      setLoading(prev => ({...prev, friends: false}));
    }
  };

  // Initial load and page change
  useEffect(() => {
    fetchFriends();
  }, [friendsPage]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        setLoading(prev => ({...prev, search: true}));
        fetchFriends(search, 1); // Reset to page 1 when searching
      } else {
        fetchFriends('', 1); // Reset to initial data when search is empty
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      setLoading(prev => ({...prev, search: false}));
    };
  }, [search]);

  const handleSelect = (friend) => {
    if (!selected.find(f => f.id === friend.id)) {
      setSelected([...selected, friend]);
    }
  };

  return (
    <Box mt={2}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search friends"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          input: { 
            color: '#475569', 
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
            '& .MuiInputBase-input::placeholder': {
              color: '#475569',
              opacity: '1',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: '500'
            }
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="#475569" />
            </InputAdornment>
          ),
          endAdornment: loading.search && (
            <InputAdornment position="end">
              <CircularProgress size={20} sx={{ color: '#14B8A6' }} />
            </InputAdornment>
          )
        }}
      />
      
      <Box sx={{
        border:'1px solid #E5E5E5',
        borderRadius:'12px',
        padding:'8px 12px',
        mt:2,
        mb:2
      }}>
        {/* Selected Friends */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1, 
          mb: 2,
          mt:2
        }}>
          {selected.map(friend => (
            <Chip
              key={friend.id}
              label={friend.first_name}
              onDelete={() => handleRemove(friend.id)}
              deleteIcon={<HighlightOffOutlinedIcon color='#14B8A6'/>}
              sx={{
                backgroundColor: '#EEF2FF',
                color: '#475569',
                fontFamily:'Plus Jakarta Sans',
                fontSize:'14px',
                fontWeight:'700',
                padding:'15px 5px',
                lineHeight:'20px',
                '& .MuiChip-deleteIcon': {
                  color: '#14B8A6',
                  fontSize:'18px'
                },
              }}
            />
          ))}
        </Box>

        <Grid container spacing={2}>
          {loading.friends ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: '#14B8A6' }} />
            </Grid>
          ) : friendsList.length > 0 ? (
            <>
              {/* Friends List */}
              {friendsList.map((friend) => (
                <Grid item xs={6} key={friend.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 2,
                      cursor: 'pointer',
                      backgroundColor: selected.find((f) => f.id === friend.id)
                        ? 'grey.100'
                        : '#fff',
                      '&:hover': {
                        backgroundColor: 'grey.200',
                      },
                    }}
                    onClick={() => handleSelect(friend)}
                  >
                    <Avatar src={friend.image} />
                    <Box>
                      <Typography
                        sx={{
                          color: '#475569',
                          fontFamily: 'Plus Jakarta Sans',
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '-0.6%',
                          fontWeight: '700',
                        }}
                      >
                        {friend.first_name} {friend.last_name}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#475569',
                          fontFamily: 'Plus Jakarta Sans',
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '-0.6%',
                          fontWeight: '400',
                        }}
                      >
                        @{friend.first_name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}

              {/* Pagination */}
              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={friendsTotalPage}
                  page={friendsPage}
                  onChange={(e, value) => setFriendsPage(value)}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: '700',
                      color: '#1E293B',
                      fontSize: '14px',
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#14B8A6',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#14B8A6',
                      },
                    },
                    '& .MuiPaginationItem-ellipsis': {
                      color: '#94a3b8',
                    },
                  }}
                  shape="rounded"
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12} sx={{ p: 2, textAlign: 'center' }}>
              <Typography sx={{ color: '#64748B' }}>
                {search ? 'No friends found' : 'No friends available'}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default FriendsView;