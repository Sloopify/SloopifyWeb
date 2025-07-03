import React, { useState } from 'react';
import {
  Paper, Typography, RadioGroup, Radio,
  FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button,IconButton

} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import FriendsView from './FriendsView';
import  { audienceOptions } from '../../../../data/audienceData';

const PostAudiencePanel = ({audience, setAudience,  specificFriends = [], setSpecificFriends, exceptFriends = [],setExceptFriends }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showSpecificModal, setShowSpecificModal] = useState(false);
  const [showExceptModal, setShowExceptModal] = useState(false);


 const handleChange = (event) => {
  const selected = event.target.value;
  setAudience(selected);

  if (selected === 'specific_friends') {
    setShowSpecificModal(true);
  } else if (selected === 'friend_except') {
    setShowExceptModal(true);
  }
};


   const handleRemoveFriend = (id) => {
    setSelectedFriends((prev) => prev.filter(friend => friend.id !== id));
  };

  return (
    <>
    <Paper sx={
      {
        boxShadow:'none'
      }
    } >
      <Typography sx={{
        fontFamily:'Plus Jakarta Sans',
        fontSize:'14px',
        fontWeight:'700',
        lineHeight:'20px',
        color:'#1E293B',
        mt:3
      }} gutterBottom>
       Who can see your post?
      </Typography>
      <Typography 
       sx={{
        fontFamily:'Plus Jakarta Sans',
        fontSize:'14px',
        fontWeight:'400',
        lineHeight:'20px',
        color:'#475569',
        mb:3
      }}>
       Your post will appear in your feed, on your profile, and in search results.
      Your default audience is set to Public, but you can change the audience for this post.
      </Typography>

      <RadioGroup value={audience} onChange={handleChange} sx={{padding:'8px 20px',
        border:'1px solid #E5E5E5',
        borderRadius:'12px',
         '& .MuiSvgIcon-root': {
      fontSize: 24,          // Optional: change size
      color: '#14B8A6',      // Color of the radio circle
    },
    '&.Mui-checked .MuiSvgIcon-root': {
      color: '#14B8A6',  
    },
     fontFamily:'Plus Jakarta Sans',
        fontSize:'16px',
        fontWeight:'600',
        lineHeight:'20px',
        color:'#1E293B',
        mb:3
      }}>
        {audienceOptions.map((option) => {
          return (
                        <FormControlLabel
            key={option.value}
            value={option.value}  // Typically, `value` should match the option's value, not label
            control={<Radio />}
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src={option.icon} 
                  style={{ 
                    width: "20px", 
                    height: "20px",
                  }} 
                />
                <Typography variant="subtitle1">
                  {option.label}
                </Typography>
              </div>
            }
            sx={{ my: 1 }}  // Optional: Adjust spacing
          />
         
          );
        })}
      </RadioGroup>
    </Paper>
    <Dialog
      open={showSpecificModal}
      onClose={() => setShowSpecificModal(false)}
      maxWidth="md"
      fullWidth
        sx={{
         
          cursor: 'pointer',
          boxShadow: 'none',
          '& .MuiPaper-root': {
             width:'760px',
            border: '1px solid #E2E8F0',
            padding: '40px 60px',
            borderRadius: '39px'
          },
        }}
    >
      <DialogTitle
      sx={{
        fontFamily:'Plus Jakarta Sans',
        color:'rgba(30, 41, 59, 1)',
         fontSize:{
                    xs:'20px',
                   md:'36px'},
        fontWeight:'800'

      }}
      >Specific Friends
        <IconButton 
            onClick={() => setShowSpecificModal(false)}  
            sx={{
              backgroundColor:'#E5E5E5',
              color:'#1E1E1E',
              position:'absolute',
              right:'40px',
              top:'60px'
            }}
          >
            <ArrowBackIcon color='#1E1E1E'/>
          </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <FriendsView
          selected={specificFriends}
          setSelected={setSpecificFriends}
          handleRemove={(id) =>
            setSpecificFriends((prev) => prev.filter((f) => f.id !== id))
          }
        />
      </DialogContent>
    </Dialog>

    <Dialog
      open={showExceptModal}
      onClose={() => setShowExceptModal(false)}
      maxWidth="md"
      fullWidth
       sx={{
         
          cursor: 'pointer',
          boxShadow: 'none',
          '& .MuiPaper-root': {
             width:'760px',
            border: '1px solid #E2E8F0',
            padding: '40px 60px',
            borderRadius: '39px'
          },
        }}
    >
        <DialogTitle
      sx={{
        fontFamily:'Plus Jakarta Sans',
        color:'rgba(30, 41, 59, 1)',
         fontSize:{
                    xs:'20px',
                   md:'36px'},
        fontWeight:'800'

      }}
      >Friends except
        <IconButton 
            onClick={() => setShowExceptModal(false)}  
            sx={{
              backgroundColor:'#E5E5E5',
              color:'#1E1E1E',
              position:'absolute',
              right:'40px',
              top:'60px'
            }}
          >
            <ArrowBackIcon color='#1E1E1E'/>
          </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <FriendsView
          selected={exceptFriends}
          setSelected={setExceptFriends}
          handleRemove={(id) =>
            setExceptFriends((prev) => prev.filter((f) => f.id !== id))
          }
        />
      </DialogContent>
    </Dialog>


    </>
  );
};

export default PostAudiencePanel;
