import React, { useState } from 'react';
import { Box, Avatar, Typography, IconButton, Stack, Badge } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from '../../../context/UserContext';

// Story Dialog
import StoryDialog from './StoryOption/StoryDialog';
// icon
import UserAvatar from '../../../assets/Home/icons/Avatar.svg';
import StoryImg  from '../../../assets/Home/icons/story.png';

// Sample stories
const stories = [
  { id: 1, name: 'Your Story', isOwn: true },
  { id: 2, name: 'Alice', img: StoryImg, viewed: false },
  { id: 3, name: 'Bob', img: StoryImg, viewed: true },
  { id: 4, name: 'Clara', img: StoryImg, viewed: false },
  { id: 5, name: 'Clara2', img: StoryImg, viewed: false },
  { id: 6, name: 'Clara2', img:StoryImg, viewed: false },
  { id: 7, name: 'Clara2', img: StoryImg, viewed: false },
  { id: 8, name: 'Clara2', img:StoryImg, viewed: false },
  { id: 9, name: 'Clara2', img:StoryImg, viewed: false },
  

];

const StoriesBar = () => {

  const { userData } = useUser();
  const avatarUserUrl=  `${userData?.profileImage || ''}`;

  const [storyDialogOpen, setstoryDialogOpen] = useState(false);


  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'scroll',
        flexWrap:'nowrap',
        width:'100%',
        padding: 2,
        gap: 1,
        width:'100',
        scrollbarWidth: 'none',
        borderBottom:'2px solid #D1D5DB',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {stories.map((story) =>
        story.isOwn ? (
          <Box key={story.id} sx={{ textAlign: 'center' ,p:'2.5px'}}  onClick={() => setstoryDialogOpen(true)}>
            <IconButton
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
             
                display: 'flex',
                alignItems: 'center',
                position:'relative',
                justifyContent: 'center',
              }}
              onClick={() => setstoryDialogOpen(true)}
            >
                 <Avatar
                src={avatarUserUrl}
                sx={{
                  width: 60,
                  height: 60,
                    border:'4px solid #fff'
                }}
              />
              <AddIcon 
              sx={{
                color:'#fff',
                backgroundColor:'#1fa1ff',
                borderRadius:'50%',
                fontSize:'20px',
                position:'absolute',
                bottom:'0px',
                right:'-5px'
              }}
              />
            </IconButton>
            <Typography variant="caption"
            sx={{
                color:'#6E6E6E',
                fontWeight:'400',
                  fontSize:'11.5px',
                fontFamily:'Plus Jakarta Sans',
                marginTop:'10px'
            }}>Add Story</Typography>
          </Box>
        ) : (
          <Box key={story.id} sx={{ textAlign: 'center' }}>
                <Box
               sx={{
                  background: `conic-gradient(
                  from 180deg at 50% 50%,
                  #054ae7 0%,
                  #14b8a6 35%,
                  #054ae7 50%,
                  #14b8a6 85%,
                  #054ae7 100%
                )`,
                  borderRadius: '50%',
                  p: '2.5px',
                  display: 'inline-block',
                }}
               
>
              <Avatar
                src={story.img}
                sx={{
                  width: 60,
                  height: 60,
                  border:'4px solid #fff'
                
                }}
              />
              </Box>

            <Typography variant="caption" sx={{display:'block',
                 color:'#000000',
                fontWeight:'400',
                fontSize:'11.5px',
                fontFamily:'Plus Jakarta Sans'
            }}>{story.name}</Typography>
          </Box>
        )
      )}
      <StoryDialog storyDialogOpen={storyDialogOpen} setstoryDialogOpen={setstoryDialogOpen}/>

    </Box>
  );
};

export default StoriesBar;
