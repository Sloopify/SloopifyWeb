import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Slider,
  CircularProgress,
  IconButton 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCutRoundedIcon from '@mui/icons-material/ContentCutRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

const formatTime = (seconds) => {
  const date = new Date(seconds * 1000);
  const isoString = date.toISOString().substring(11, 19);
  return seconds >= 3600 ? isoString : isoString.substring(3);
};

const VideoTrimmer = ({ 
  videoUrl, 
  videoRef,
   start = 0, 
  end = 0, 
  onTrimChange, 
  onSave, 
  onCancel,
  onClose 
}) => {
  const thumbnailCanvasRef = useRef(null);
  
 const videoStart = start;
const videoEnd = end;

  const [videoDuration, setVideoDuration] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [hoverTime, setHoverTime] = useState(null);
  const [isHoveringSlider, setIsHoveringSlider] = useState(false);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

  // Initialize video duration when metadata loads
const onVideoLoadedMetadata = () => {
  if (!videoRef.current) return;

  const duration = videoRef.current.duration;
  setVideoDuration(duration);

  // Auto set end if not already set
  if (start === 0 && end === 0) {
    onTrimChange({ trimStart: 0, trimEnd: duration });
  }
};



  // Generate video thumbnails
  useEffect(() => {
    if (!videoRef.current || !thumbnailCanvasRef.current) return;

    const generateThumbnails = async () => {
      setIsGeneratingThumbnails(true);
      const video = videoRef.current;
      const canvas = thumbnailCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const thumbnails = [];
      const steps = 12; // Number of thumbnails to generate
      
      for (let i = 0; i < steps; i++) {
        const time = (i / steps) * video.duration;
        video.currentTime = time;
        
        await new Promise(resolve => {
          video.addEventListener('seeked', resolve, { once: true });
        });
        
        canvas.width = 160;
        canvas.height = (160 / video.videoWidth) * video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        thumbnails.push({
          time,
          url: canvas.toDataURL('image/jpeg', 0.8)
        });
      }
      
      setThumbnails(thumbnails);
      setIsGeneratingThumbnails(false);
    };

    videoRef.current.addEventListener('loadedmetadata', generateThumbnails);
    return () => {
      videoRef.current?.removeEventListener('loadedmetadata', generateThumbnails);
    };
  }, [videoUrl]);

  // Handle video time updates
const handleVideoTimeUpdate = () => {
  if (!videoRef.current) return;

  const t = videoRef.current.currentTime;

  setCurrentVideoTime(t);

  if (t < videoStart) {
    videoRef.current.currentTime = videoStart;
  }

  if (t >= videoEnd) {
    videoRef.current.pause();
    setIsPlaying(false);
  }
};


  // Handle slider change for video trimming
 const handleSliderChange = (event, newValue) => {
  if (Array.isArray(newValue)) {
    onTrimChange({ trimStart: newValue[0], trimEnd: newValue[1] });
    if (videoRef.current) {
      videoRef.current.currentTime = newValue[0];
    }
  }
};


  // Handle slider hover to show thumbnails
  const handleSliderHover = (event) => {
    if (!videoRef.current) return;
    
    const slider = event.currentTarget;
    const rect = slider.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const hoverTime = Math.max(0, Math.min(percent * videoDuration, videoDuration));
    
    setHoverTime(hoverTime);
    setIsHoveringSlider(true);
  };

  // Find closest thumbnail for hover position
  const findClosestThumbnail = (time) => {
    if (thumbnails.length === 0) return null;
    return thumbnails.reduce((prev, curr) => 
      Math.abs(curr.time - time) < Math.abs(prev.time - time) ? curr : prev
    );
  };

  // Play trimmed section
  const playTrimmedVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoStart;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        if (videoRef.current.currentTime >= videoEnd) {
          videoRef.current.currentTime = videoStart;
        }
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle save
const handleSave = () => {
  onSave({
    trimStart: videoStart,
    trimEnd: videoEnd
  });
  onClose(); 

  
};



  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        padding: '0px',
        
      }}
    >
  

      {/* Video Preview */}
      <video
        ref={videoRef}
        src={videoUrl}
        style={{ 
          maxWidth: '100%', 
          borderRadius: '12px',
          aspectRatio: '16/9',
          backgroundColor: '#F8FAFC'
        }}
        controls={false}
        onLoadedMetadata={onVideoLoadedMetadata}
        onTimeUpdate={handleVideoTimeUpdate}
      />
      
      {/* Timeline Controls */}
      <Box 
        sx={{ 
          position: 'relative',
          width: '90%',
          px: 2,
          mb: 0,
          pt:2,
          borderTop:'1px solid #475569'
        }}
        onMouseEnter={() => setIsHoveringSlider(true)}
        onMouseLeave={() => setIsHoveringSlider(false)}
        onMouseMove={handleSliderHover}
      >
        {/* Time Display */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent:'space-between',
          alignItems:'center',
          mb: 0
        }}>
          <Box sx={{width:'33%'}}>
              {/* pause */}
              <IconButton sx={{ color:'#475569',}} onClick={togglePlayPause}>
                {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
              </IconButton>
              {/* play trim */}
              <IconButton  sx={{ color:'#475569',}}
              onClick={playTrimmedVideo}>
                <ContentCutRoundedIcon />

              </IconButton>
          </Box>
         


          <Typography sx={{ textAlign:'center', width:'33%',
            color:'#475569',
            fontFamily:'Plus Jakarta Sans',
            fontSize:'14px'
           }}>
            {formatTime(currentVideoTime)} / {formatTime(videoDuration)}
          </Typography>
         

           <Box sx={{ display: 'flex', justifyContent:'end', width:'33%' }}>
            <Button
              onClick={onCancel}
              sx={{
                color:'#475569',
                fontFamily:'Plus Jakarta Sans',
                fontSize:'14px'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
               sx={{ color:'#475569',}}
            >
              <SaveRoundedIcon />
            </Button>
          </Box>


        </Box>

       

        {/* Main Slider */}
       <Slider
          value={[videoStart, videoEnd]}
          onChange={handleSliderChange}
          min={0}
          max={videoDuration}
          step={0.1}
          sx={{
            position: 'relative',
            '& .MuiSlider-thumb': {
              height: 20,
              width: 20,
              backgroundColor: '#14b8a6',
            },
            '& .MuiSlider-track': {
              backgroundColor: '#14b8a6',
              border:'0px'
            },
            '& .MuiSlider-rail': {
              backgroundColor: '#CBD5E1',
              position: 'relative',
              // Add pseudo-element for tick marks
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundImage: `
                  repeating-linear-gradient(
                    to right,
                    transparent,
                    transparent calc(10% - 1px),
                    #475569 calc(10% - 1px),
                    #475569 calc(10%),
                    transparent calc(10%)
                  )
                `,
                backgroundSize: '100% 100%',
              },
            },
          }}
        />


         {/* Thumbnail Slideshow Strip */}
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            width: '100%',
            alignItems:'center',
            justifyContent:'center',
            mt: 1,
            mb: 0,
            px: 1,
            gap: 0,
          }}
        >
          {thumbnails.map((thumb, index) => (
            <Box
              key={index}
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = thumb.time;
                  setCurrentVideoTime(thumb.time);
                }
              }}
              sx={{
                flex: '0 0 auto',
                width: 'auto',
                height: '60px',
                borderRadius: '0px',
                
                overflow: 'hidden',
                position: 'relative',
                border: (thumb.time >= videoStart && thumb.time <= videoEnd)
                  ? '1px solid #14b8a6'
                  : '1px solid #CBD5E1',
                cursor: 'pointer',
                transition: 'border 0.2s',
              }}
            >
              <img
                src={thumb.url}
                alt={`Thumbnail at ${thumb.time}s`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Thumbnail Preview on Hover */}
        {/* {isHoveringSlider && hoverTime !== null && thumbnails.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '70px',
              left: `${(hoverTime / videoDuration) * 100}%`,
              transform: 'translateX(-50%)',
              zIndex: 10,
              width: '120px',
              bgcolor: 'background.paper',
              borderRadius: '4px',
              boxShadow: 3,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <img
              src={findClosestThumbnail(hoverTime).url}
              alt="preview"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                py: 0.5,
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
              }}
            >
              {formatTime(hoverTime)}
            </Typography>
          </Box>
        )} */}

        {/* Thumbnail Loading Indicator */}
        {isGeneratingThumbnails && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 5
          }}>
            <CircularProgress size={24} sx={{color: '#14B8A6'}}/>
          </Box>
        )}
      </Box>
      
      {/* Video Controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2,
        mt: 1
      }}>
        {/* <Button 
          variant="outlined"
          onClick={togglePlayPause}
          startIcon={isPlaying ? null : <ArrowBackIcon />}
          sx={{
            borderColor: '#14b8a6',
            color: '#14b8a6',
            '&:hover': {
              borderColor: '#0d9488',
              backgroundColor: 'rgba(20, 184, 166, 0.04)'
            }
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button> */}
        {/* <Button 
          variant="outlined"
          onClick={playTrimmedVideo}
          sx={{
            borderColor: '#475569',
            color: '#475569',
            '&:hover': {
              borderColor: '#334155',
              backgroundColor: 'rgba(71, 85, 105, 0.04)'
            }
          }}
        >
          Play Trim
        </Button> */}
      </Box>

      {/* Action Buttons */}
    

      {/* Hidden canvas for thumbnails */}
      <canvas ref={thumbnailCanvasRef} style={{ display: 'none' }} />
    </Box>
  );
  
};


export default VideoTrimmer;