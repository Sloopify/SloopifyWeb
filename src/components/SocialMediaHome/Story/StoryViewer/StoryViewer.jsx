import React, {useState, useEffect} from 'react';
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



const [elapsed, setElapsed] = useState(0);

useEffect(() => {
  if (!story) return;

  setElapsed(0);
  const duration = story.type === 'video' ? 8000 : 5000;
  const startTime = Date.now();

  const timer = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime >= duration) {
      clearInterval(timer);
      setElapsed(duration);
      handleAutoNext();
    } else {
      setElapsed(elapsedTime);
    }
  }, 50);

  return () => clearInterval(timer);
}, [story, activeUserIndex, activeStoryIndex]);



const duration = story?.type === 'video' ? 8000 : 5000;
const progress = Math.min((elapsed / duration) * 100, 100);

  
  const handleAutoNext = () => {
    if (activeStoryIndex < user.stories.length - 1) {
      // 👉 next story for same user
      setActiveStoryIndex(activeStoryIndex + 1);
    } else if (activeUserIndex < stories.length - 1) {
      // 👉 next user
      setActiveUserIndex(activeUserIndex + 1);
      setActiveStoryIndex(0);
    } else {
      // 👉 no more, close viewer
      onClose();
    }
  };




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
        key={`${activeUserIndex}-${activeStoryIndex}`}
          stories={stories}
          activeUserIndex={activeUserIndex}
          setActiveUserIndex={setActiveUserIndex}
          activeStoryIndex={activeStoryIndex}
          setActiveStoryIndex={setActiveStoryIndex}
          renderStoryContent={(story, user) => (
            <StoryContent
              key={`${user.id}-${story.id}`}
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