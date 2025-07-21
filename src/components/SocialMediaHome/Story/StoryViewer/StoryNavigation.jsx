import React from 'react';
import { Box, IconButton } from '@mui/material';
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

  // Always calculate prev/next users (up to 2)
  const prevUsers = [];
  const nextUsers = [];

  for (let i = 1; i <= 2; i++) {
    if (activeUserIndex - i >= 0) prevUsers.unshift(stories[activeUserIndex - i]);
    if (activeUserIndex + i < stories.length) nextUsers.push(stories[activeUserIndex + i]);
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
          left: 60,
          display: 'flex',
          gap: 1,
        }}
      >
        {prevUsers.map((prevUser, idx) => {
          const thumb = prevUser.stories[0];
          return (
            <Box
              key={prevUser.id}
              sx={{
                width: idx === prevUsers.length - 1 ? 60 : 40,
                height: idx === prevUsers.length - 1 ? 100 : 80,
                backgroundImage: `url(${thumb.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                opacity: 0.6 + 0.2 * idx,
                cursor: 'pointer',
                transition: '0.3s',
              }}
              onClick={() => {
                setActiveUserIndex(activeUserIndex - (prevUsers.length - idx));
                setActiveStoryIndex(0);
              }}
            />
          );
        })}
      </Box>

      {/* Active Story */}
      <Box
        sx={{
          mx: 10,
          borderRadius: '12px',
          overflow: 'hidden',
          maxWidth: '500px',
          width: '100%',
          transition: '0.3s',
        }}
      >
        {renderStoryContent(activeStory, user, progress)}
      </Box>

      {/* Next Thumbnails */}
      <Box
        sx={{
          position: 'absolute',
          right: 60,
          display: 'flex',
          gap: 1,
        }}
      >
        {nextUsers.map((nextUser, idx) => {
          const thumb = nextUser.stories[0];
          return (
            <Box
              key={nextUser.id}
              sx={{
                width: idx === 0 ? 60 : 40,
                height: idx === 0 ? 100 : 80,
                backgroundImage: `url(${thumb.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                opacity: 0.6 + 0.2 * (1 - idx),
                cursor: 'pointer',
                transition: '0.3s',
              }}
              onClick={() => {
                setActiveUserIndex(activeUserIndex + idx + 1);
                setActiveStoryIndex(0);
              }}
            />
          );
        })}
      </Box>

      {/* Prev Arrow */}
      {hasPrev && (
        <IconButton
          onClick={navigatePrev}
          sx={{
            position: 'absolute',
            left: 8,
            zIndex: 2,
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
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
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.3)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
}
