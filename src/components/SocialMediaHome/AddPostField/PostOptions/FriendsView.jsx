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


// friends data
const friends_Data_URL='/api/v1/post/get-friends';


const FriendsView = ({ selected, setSelected, handleRemove }) => {


  const [friendsList, setFriendsList] = useState([]); 
  const [selectedFriends, setSelectedFriends] = useState([]); 
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState({
      friends: false,
  });

    // Pagiation view
  const [friendsPage,setFriendsPage] = useState(1);
  const [friendsTotalPage, setFriendsTotalPage] = useState(1);
  const perPage = 10;



   useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(prev => ({...prev, friends: true}));
        const res = await API.post(friends_Data_URL,{
          page: String(friendsPage),
          per_page: String(perPage)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
        const friends = res.data?.data?.friends || [];
        console.log('Friends API response:', res.data);
        setFriendsList(friends); // Store friends in state
        setFriendsTotalPage(res.data?.data?.pagination?.last_page || 1);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
       finally {
        setLoading(prev => ({...prev, friends: false}));
      }
    };
    fetchFriends(); 
  }, [friendsPage]);


 
  

  const handleSelect = (friend) => {
    if (!selected.find(f => f.id === friend.id)) {
      setSelected([...selected, friend]);
    };
    console.log('selectedfriends:',selected)
  };


const filteredFriends = friendsList.filter(friend =>
  friend?.first_name?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <Box mt={2}>


      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search friends"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
        }}
      />
    <Box  sx={{border:'1px solid #E5E5E5',
      borderRadius:'12px',
      padding:'8px 12px',
      mt:2,
      mb:2}}>
          {/* Selected Friends */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2,mt:2,
      
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
          // Show loader for both friends list + pagination
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress   sx={{
              color: '#14B8A6',
            }} 
/>
          </Grid>
        ) : (
          // Render content only when loading is false
          <>
            {/* Friends List */}
            {filteredFriends.map((friend) => (
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

            {/* Pagination (only visible when not loading) */}
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
                  '& .MuiButtonBase-root-MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: '#14B8A6',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#14B8A6',
                    },
                  },
                }}
                shape="rounded"
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
    
    </Box>
  );
};

export default FriendsView;
