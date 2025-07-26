import React, {useState} from 'react';
import { Box, LinearProgress, Avatar,Typography, IconButton, TextField } from '@mui/material';

// assests
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import sendIcon from '../../../../assets/Story/send.png'
// component
import StoryViewerOptionDialog from './StoryViewDialogOption';
import StoryProgress from './StoryProgress';


export default function StoryContent({ liked, setLiked, story, user, message, setMessage, progress, activeStoryIndex  }) {
    // states
  const [anchorEl, setAnchorEl] = useState(null);
  const openOptions = Boolean(anchorEl);


  // liked story
  const handleClickLike = () => {
    setLiked(!liked);
  };



  return (
    <Box sx={{ width: '100%', maxWidth: 540, position: 'relative', width:'380px', height:'90vh'}}>
      {story.type === 'image' && (
        <img
          src={story.url}
          alt=""
          style={{ width: '100%', borderRadius: '24px', height:'90vh', objectFit:'cover' }}
        />
      )}

      {story.type === 'video' && (
        <video src={story.url} autoPlay muted style={{ width: '100%' }} />
      )}

      {/* Progress bar */}
     <StoryProgress
        totalStories={user.stories.length}
        activeIndex={activeStoryIndex}
        progress={progress}
      />
      {/* Story Head */}
      <Box sx={{
        position: 'absolute',
        top: 50,
        left: 8,
        right: 8,
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
        {/* User Info */}
        <Box sx={{display:'flex', alignItems:'center'}}>
            {/* avatar */}
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar 
                src={user.img} 
                alt="Avatar Img"
                sx={{ 
                    width: {
                        md:35,
                        xl:40
                        }, 
                    height:  {
                        md:35,
                        xl:40
                    }, 
                    }}
                />
                        
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 8,
                        height: 8,
                        backgroundColor: '#4CAF50', // Green color
                        borderRadius: '50%',
                        border: '2px solid white', // White border to contrast with avatar
                        }}
                />
                        
            </Box>
            {/* name */}
            <Typography
            sx={{
                fontFamily:'Plus Jakarta Sans',
                fontSize:{
                    md:'14px',
                    xl:'16px'},
                fontWeight:'600',
                lineHeight:'28px',
                color:'#F8FAFC',
                marginLeft:'10px'
            }}
            >{user.name}</Typography>
            {/* time */}
            <Typography
            sx={{
                fontFamily:'Plus Jakarta Sans',
                fontSize:{
                    md:'14px',
                    xl:'16px'},
                fontWeight:'600',
                lineHeight:'28px',
                color:'#F8FAFC',
                marginLeft:'10px'
            }}
            >22 h</Typography>




        </Box>

         {/* More Options */}
        <IconButton
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{
                color: 'white',
            }}
        >
          <MoreVertIcon />
        </IconButton>
   
      </Box>

  
      <StoryViewerOptionDialog anchorEl={anchorEl} openOptions={openOptions} onClose={() => setAnchorEl(null)} story={story} user={user}/>


      {/* story footer */}
      <Box sx={{
        position: 'absolute',
        bottom: 20,
        left: 8,
        right: 8,
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'column'
      }}>
        {/* video story  */}
        <Box sx={{
          display:'flex',
          alignItems:'center',
          justifyContent:'flex-end',
          width:'100%'
        }}>
          {/* video duration */}
          <Typography 
          sx={{
            fontFamily:'Plus Jakarta Sans',
            fontSize:{
              md:'14px',
              xl:'14px'
            },
            fontWeight:'700',
            lineHeight:'28px',
            color:'#FFFFFF',
            padding:'5px'
          }}
          >22 S</Typography>

          {/* Mute Option */}
          <IconButton>
            <VolumeOffIcon sx={{color:'#fff'}}/>
          </IconButton>

          {/* Play Option */}
          <IconButton>
            <PlayArrowOutlinedIcon sx={{color:'#fff'}}/>
          </IconButton>

        </Box>

        {/* reply */}
        <Box sx={{
          display:'flex',
          alignItems:'center',
          width:'100%',
          justifyContent:'space-between'
        }}>

          <TextField 
            placeholder={`Reply to ${user.name}...`}
            onChange={(e) => setMessage(e.target.value)}
             sx={{
              width:'280px',
              '& .MuiInputBase-input': {
                padding: '0px',
                color:'#fff',
                fontFamily:'Plus Jakarta Sans',
                fontWeight:'500',
                fontSize:'14px',
             
                '&::placeholder': {  
                  color: '#fff',  
                  opacity: 1,     

                },
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '123px',
                padding: '8px 12px',
                '&:hover .MuiOutlinedInput-notchedOutline': {  
                  borderColor: '#fff',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {  // Focus state
                  borderColor: '#14B8A6',  // Your desired focus border color
                  borderWidth: '1px',      // You can adjust the border width if needed
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#CBD5E1',
              },
            }}
          />

          <IconButton  onClick={handleClickLike}>

            {liked ? (
              <FavoriteIcon sx={{ color: 'red' }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: '#fff' }} />
            )
          }
            
          </IconButton>

          <IconButton>
            <Box component='img' src={sendIcon} sx={{width:'18px'}}/>
          </IconButton>
          

        </Box>


      </Box>

    </Box>
  );
}
