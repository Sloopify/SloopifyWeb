import React, { useState } from 'react';
import {
  TextField,
  Avatar,
  Typography,
  Box,
  Chip,
  InputAdornment
} from '@mui/material';
import { Grid } from "@mui/joy";
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';


// friends data
import friends from '../../../../data/friendsData';

const FriendsView = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const handleSelect = (friend) => {
    if (!selected.find(f => f.id === friend.id)) {
      setSelected([...selected, friend]);
    }
  };

  const handleRemove = (id) => {
    setSelected(selected.filter(f => f.id !== id));
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(search.toLowerCase())
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
        label={friend.username}
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
        {filteredFriends.map(friend => (
          <Grid item xs={6} key={friend.id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: selected.find(f => f.id === friend.id)
                  ? 'grey.100'
                  : '#fff',
                '&:hover': {
                  backgroundColor: 'grey.200',
                },
              }}
              onClick={() => handleSelect(friend)}
            >
              <Avatar src={friend.avatar} />
              <Box>
                <Typography sx={{
                    color:'#475569',
                    fontFamily:'Plus Jakarta Sans',
                    fontSize:'14px',
                    lineHeight:'20px',
                    letterSpacing:'-0.6%',
                    fontWeight:'700'
                }}>{friend.name}</Typography>
                <Typography sx={{
                    color:'#475569',
                    fontFamily:'Plus Jakarta Sans',
                    fontSize:'14px',
                    lineHeight:'20px',
                    letterSpacing:'-0.6%',
                    fontWeight:'400'
                }}>{friend.username}</Typography>
              </Box>
             
            </Box>
          </Grid>
        ))}
        {filteredFriends.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" align="center">
              No friends found.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
    
    </Box>
  );
};

export default FriendsView;
