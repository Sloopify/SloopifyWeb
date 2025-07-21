import React, {useState} from 'react';
import { Modal, Box, IconButton,Avatar } from '@mui/material';
// assests
import CloseIcon from '@mui/icons-material/Close'; 
import MoreVertIcon from '@mui/icons-material/MoreVert';
// component
import StoryContent from './StoryContent';
import StorySlider from './StoryNavigation';


export default function StoryViewer({
  open,
  onClose,
  stories,
  activeUserIndex,
  activeStoryIndex,
  setActiveStoryIndex,
  setActiveUserIndex,
  liked,
  setLiked,
  message,
  setMessage,
  onNextStory,
  onPrevStory,
  onNextUser,
  onPrevUser,
}) {

const user = stories[activeUserIndex];
const story = user?.stories?.[activeStoryIndex];
const progress = ((activeStoryIndex + 1) / user.stories.length) * 100;




  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: '#00000040',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00000040',
        }}
      >
        {/* Close button positioned at top right */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <StorySlider
          stories={stories}
          activeUserIndex={activeUserIndex}
          setActiveUserIndex={setActiveUserIndex}
          activeStoryIndex={activeStoryIndex}
          setActiveStoryIndex={setActiveStoryIndex}
          renderStoryContent={(story, user, progress) => (
            <StoryContent
              story={story}
              user={user}
              progress={progress}
              activeStoryIndex={activeStoryIndex}
              liked={liked}
              setLiked={setLiked}
              message={message}
              setMessage={setMessage}
            />
          )}
        />

       
      </Box>
    </Modal>
  );
}