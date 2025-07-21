import React, { useState } from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from '../../../context/UserContext';


// Story Dialog
import StoryDialog from './StoryOption/StoryDialog';
// Story Viewer Components
import StoryViewer from './StoryViewer/StoryViewer';
// icon
import UserAvatar from '../../../assets/Home/icons/Avatar.svg';
import StoryImg  from '../../../assets/Home/icons/story.png';
import StoryTest from '../../../assets/Story/story.jpg';
import StoryTest2 from '../../../assets/Story/story2.jpg';
import StoryTest3 from '../../../assets/Story/pexels-mikitayo-17926439.jpg';
import StoryTest4 from '../../../assets/Story/pexels-mikitayo-18252321.jpg';
import StoryTest5 from '../../../assets/Story/pexels-mykyta-hurenko-385502177-28645113.jpg';
import StoryTest6 from '../../../assets/Story/pexels-symeon-ekizoglou-1107605-2105937.jpg';
import StoryUser2 from '../../../assets/Story/avatar.png';
import StoryUser3 from '../../../assets/Story/avatar2.png';
import StoryUser4 from '../../../assets/Story/avatar-3.png'


// Sample stories
const stories = [
  { id: 1,
    name: 'Your Story',
    isOwn: true, 
    stories: [
      { id: 1, type: 'image', url: StoryTest },

    ],
   },
  {
    id: 2,
    name: 'Alice',
    img: StoryUser3,
    viewed: false,
    stories: [
      { id: 1, type: 'image', url: StoryTest3 },
      { id: 2, type: 'image', url: StoryTest6 },
   
    ],
  },
  {
    id: 3,
    name: 'Bob',
    img: StoryImg,
    viewed: true,
    stories: [
      { id: 1, type: 'image', url: StoryTest2 },
    ],
  },
   {
    id: 3,
    name: 'Wade Warren',
    img: StoryUser2,
    viewed: true,
    stories: [
      { id: 1, type: 'image', url: StoryTest4 },
    ],
  },
    {
    id: 4,
    name: 'Devon Lane',
    img: StoryUser4,
    viewed: true,
    stories: [
      { id: 1, type: 'image', url: StoryTest5 },
    ],
  },
];


const StoriesBar = () => {

  const { userData } = useUser();
  const avatarUserUrl=  `${userData?.profileImage || ''}`;

  // Story Option Dialog

  const [storyDialogOpen, setstoryDialogOpen] = useState(false);

  // View Stories State
  const [openViewStory, setOpenViewStory] = useState(false);
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState('');



  const handleNextStory = () => {
    if (activeStoryIndex < stories[activeUserIndex].stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else if (activeUserIndex < stories.length - 1) {
      setActiveUserIndex(activeUserIndex + 1);
      setActiveStoryIndex(0);
    } else {
      setOpenViewStory(false);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    } else if (activeUserIndex > 0) {
      setActiveUserIndex(activeUserIndex - 1);
      setActiveStoryIndex(0);
    } else {
      setOpenViewStory(false);
    }
  };






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
      {stories.map((story, index) =>
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
          <Box key={story.id} sx={{ textAlign: 'center' }} 
            onClick={() => {
              setActiveUserIndex(index); 
              setActiveStoryIndex(0);
              setOpenViewStory(true);
              
            }}
          >
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
      {/* Story Option Dialog */}
      <StoryDialog storyDialogOpen={storyDialogOpen} setstoryDialogOpen={setstoryDialogOpen}/>
      {/* Story Viewer */}
      <StoryViewer open={openViewStory} onClose={() => setOpenViewStory(false)} setOpenViewStory={setOpenViewStory} 
      activeUserIndex={activeUserIndex} setActiveUserIndex={setActiveUserIndex} setActiveStoryIndex={setActiveStoryIndex} activeStoryIndex={activeStoryIndex} stories={stories}
      onNextStory={handleNextStory} onPrevStory={handlePrevStory} liked={liked} setLiked={setLiked} message={message} setMessage={setMessage}/>
    </Box>
  );
};

export default StoriesBar;
