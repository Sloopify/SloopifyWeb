import { Box, LinearProgress } from '@mui/material';

export default function StoryProgress({ totalStories, activeIndex, progress }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, position: 'absolute', top: 30, left: 8, right: 8 }}>
      {Array.from({ length: totalStories }).map((_, idx) => {
        const isActive = idx === activeIndex;
        return (
          <LinearProgress
            key={idx}
            variant="determinate"
            value={idx < activeIndex ? 100 : isActive ? progress : 0}
            sx={{
              flex: 1,
              height: 4,
              bgcolor: 'rgba(255,255,255,0.3)',
              // Disable transition on progress reset
              transition: isActive && progress === 0 ? 'none' : undefined,
              '& .MuiLinearProgress-bar': {
                bgcolor: '#fff',
                transition: isActive && progress === 0 ? 'none' : undefined,
              },
            }}
          />
        );
      })}
    </Box>
  );
}
