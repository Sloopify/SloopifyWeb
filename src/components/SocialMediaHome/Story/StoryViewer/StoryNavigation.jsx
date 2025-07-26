import React from 'react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function StorySlider({
  stories,
  activeUserIndex,
  setActiveUserIndex,
  activeStoryIndex,
  setActiveStoryIndex,
  renderStoryContent,
  progress,
}) {
  const user = stories[activeUserIndex];
  const activeStory = user?.stories?.[activeStoryIndex];

  const isFirstStory = activeStoryIndex === 0;
  const isLastStory = activeStoryIndex === user.stories.length - 1;

  const hasPrev = activeUserIndex > 0 || !isFirstStory;
  const hasNext = activeUserIndex < stories.length - 1 || !isLastStory;

  const navigatePrev = () => {
    if (isFirstStory) {
      if (activeUserIndex > 0) {
        const prevUser = stories[activeUserIndex - 1];
        setActiveUserIndex(activeUserIndex - 1);
        setActiveStoryIndex(prevUser.stories.length - 1);
      }
    } else {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const navigateNext = () => {
    if (isLastStory) {
      if (activeUserIndex < stories.length - 1) {
        setActiveUserIndex(activeUserIndex + 1);
        setActiveStoryIndex(0);
      }
    } else {
      setActiveStoryIndex(activeStoryIndex + 1);
    }
  };

  // Build prev/next users with stable offset
  const prevUsers = [];
  const nextUsers = [];

  for (let i = 1; i <= 2; i++) {
    if (activeUserIndex - i >= 0) {
      prevUsers.unshift({
        user: stories[activeUserIndex - i],
        offset: i,
      });
    }
    if (activeUserIndex + i < stories.length) {
      nextUsers.push({
        user: stories[activeUserIndex + i],
        offset: i,
      });
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      
      }}
    >
      {/* Prev Thumbnails */}
      <Box
        sx={{
          position: 'absolute',
          left: 90,
          display: 'flex',
          gap: 6,
          minWidth:'400px',
          justifyContent:'end'
        }}
      >
        {prevUsers.map(({ user: prevUser, offset }, idx) => {
          const thumb = prevUser.stories[0];
          const userimg = prevUser.img;
          const userName = prevUser.name;
          return (
            <Box
              key={`prev-${prevUser.id}`}
              sx={{
                width: idx === prevUsers.length - 1 ? 200 : 150,
                height: idx === prevUsers.length - 1 ? 300 : 250,
                backgroundImage: `url(${thumb.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                // opacity: 0.6 + 0.2 * idx,
                cursor: 'pointer',
                transition: '0.3s',
                position: 'relative', 
                overflow: 'hidden',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                  borderRadius: '8px',
                  transition: '0.3s',
                },
                '&:hover::before': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                }
              }}
              onClick={() => {
                setActiveUserIndex(activeUserIndex - offset);
                setActiveStoryIndex(0);
              }}
            >
               <Box sx={{ 
              position: 'relative', 
              zIndex: 2,}}>

                   <Avatar 
             
              src={userimg} 
              sx={{
               
                 width: {
                        md:55,
                        xl:60
                        }, 
                    height:  {
                        md:55,
                        xl:60
                    }, 
              
              }}
            />
            <Typography 
            sx={{
                color:'#fff',
                fontWeight:'400',
                fontSize:'12px',
                fontFamily:'Plus Jakarta Sans',
                marginTop:'10px',
                textAlign:'center'
            }}
            >{userName}</Typography>
              
            </Box>
         
              </Box>
          );
        })}
      </Box>

      {/* Active Story */}
      <Box
        sx={{
          mx: 10,
          borderRadius: '12px',
          // overflow: 'hidden',
          maxWidth: {
            md:'430px',
            xl:'500px'},
          width: '100%',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          transition: '0.3s',
          position:'relative'
        }}
      >
        {renderStoryContent(activeStory, user, progress)}
          {/* Prev Arrow */}
          {hasPrev && (
            <IconButton
              onClick={navigatePrev}
              sx={{
                position: 'absolute',
                left: 8,
                zIndex: 2,
                color: '#020617',
                backgroundColor: '#F8FAFC',
                '&:hover': { backgroundColor: '#F8FAFC' },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          {/* Next Arrow */}
          {hasNext && (
            <IconButton
              onClick={navigateNext}
              sx={{
                position: 'absolute',
                right: 8,
                zIndex: 2,
                color: '#020617',
                backgroundColor: '#F8FAFC',
                '&:hover': { backgroundColor: '#F8FAFC' },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
      </Box>

      {/* Next Thumbnails */}
      <Box
        sx={{
          position: 'absolute',
          right: 90,
          display: 'flex',
          gap: 6,
          minWidth:'400px',

        }}
      >
        {nextUsers.map(({ user: nextUser, offset }, idx) => {
          const thumb = nextUser.stories[0];
          const userimg = nextUser.img;
          const userName = nextUser.name;
          return (
          <Box
            key={`next-${nextUser.id}`}
            sx={{
              width: idx === 0 ? 200 : 150,
              height: idx === 0 ? 300 : 250,
              backgroundImage: `url(${thumb.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              position: 'relative', 
              overflow: 'hidden',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              cursor: 'pointer',
              transition: '0.3s',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                borderRadius: '8px',
                transition: '0.3s',
              },
              '&:hover::before': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)', 
              },
            }}
            onClick={() => {
              setActiveUserIndex(activeUserIndex + offset);
              setActiveStoryIndex(0);
            }}
          >
            {/* Wrapped the img in a Box with proper zIndex and positioning */}
            <Box sx={{ 
              position: 'relative', 
              zIndex: 2,}}>

                   <Avatar 
             
              src={userimg} 
              sx={{
               
                 width: {
                        md:55,
                        xl:60
                        }, 
                    height:  {
                        md:55,
                        xl:60
                    }, 
              
              }}
            />
            <Typography 
            sx={{
                color:'#fff',
                fontWeight:'400',
                fontSize:'12px',
                fontFamily:'Plus Jakarta Sans',
                marginTop:'10px',
                textAlign:'center'
            }}
            >{userName}</Typography>
              
            </Box>
         
          </Box>
          );
        })}
        
      </Box>

    
    </Box>
  );
}
