import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slider,
  CircularProgress
} from '@mui/material';
import { Grid } from "@mui/joy";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CropIcon from '../../../../assets/Home/icons/Crop.png';
import RotateIcon from '../../../../assets/Home/icons/ArrowsCounterClockwise.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddImagesIcons from '../../../../assets/Home/icons/flat-color-icons_add-image.svg';
import PlayCircleOutlineIcon from '../../../../assets/Home/icons/lets-icons_video-fill.png';
import FlipHorizontalIcon from '../../../../assets/Home/icons/flip-horizontal.png';
import FlipVerticalIcon from '../../../../assets/Home/icons/flip-vertical.png';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import FilerobotImageEditor from 'filerobot-image-editor';
import IconTabs from '../../HomeBody/HomeBody';

const filters = [
  { value: 'sepia(100%)', label: 'Sepia' },
  { value: 'grayscale(100%)', label: 'Black & White' },
  { value: 'brightness(1.1) contrast(1.1) saturate(1.3) hue-rotate(-10deg)', label: 'Warm' },
  { value: 'brightness(1.1) contrast(1.1) saturate(0.9) hue-rotate(10deg)', label: 'Cool' },
  { value: 'sepia(50%) brightness(0.9) contrast(1.1) saturate(1.1)', label: 'Vintage' },
  { value: 'saturate(1.5) contrast(1.2) brightness(1.1)', label: 'Vivid' }

];

const brightnessSteps = [50, 75, 100, 125, 150, 200];
const contrastSteps = [50, 75, 100, 125, 150, 200];

export default function MediaGridUploader({ toggleImageUploader,handleImageChange }) {
  // Media state
  const [media, setMedia] = useState([]);
  const [editingMedia, setEditingMedia] = useState(null);
  const [openEditor, setOpenEditor] = useState(false);
  
  // Image editing state
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [filter, setFilter] = useState('none');
  const [brightnessIndex, setBrightnessIndex] = useState(2);
  const [contrastIndex, setContrastIndex] = useState(2);
  const [rotation, setRotation] = useState(0);
  const [editorMode, setEditorMode] = useState('basic');
  const [isCropActive, setIsCropActive] = useState(false);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  
  // Video editing state
  const [isVideoEditing, setIsVideoEditing] = useState(false);
  const [videoStart, setVideoStart] = useState(0);
  const [videoEnd, setVideoEnd] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Thumbnail state
  const [thumbnails, setThumbnails] = useState([]);
  const [hoverTime, setHoverTime] = useState(null);
  const [isHoveringSlider, setIsHoveringSlider] = useState(false);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

  // track if the user do any change

const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
const [showExitConfirm, setShowExitConfirm] = useState(false);

// Update this whenever changes are made
const handleCropChange = (c) => {
  setCrop(c);
  setHasUnsavedChanges(true);
};

// Handle flip Hor
const flipHorizontally = () => {
  setFlipHorizontal(prev => !prev);
  setHasUnsavedChanges(true);
};

// Handle flip Ver
const flipVertically = () => {
  setFlipVertical(prev => !prev);
  setHasUnsavedChanges(true);
};

const handleFilterChange = (value) => {
  setFilter(value);
  setHasUnsavedChanges(true);
};

// Modify your close handler
const handleCloseEditor = () => {
  if (hasUnsavedChanges) {
    setShowExitConfirm(true);
  } else {
    setOpenEditor(false);
  }
};

// Add these new handlers
const handleSaveAndClose = () => {
  handleSaveEditedMedia(); // Your existing save function
  setOpenEditor(false);
  setHasUnsavedChanges(false);
};

const handleDiscardChanges = () => {
  setOpenEditor(false);
  setHasUnsavedChanges(false);
  // Reset any editing states if needed
  setCrop(undefined);
  setFilter('none');
  setShowExitConfirm(false)
  // ... other resets
};

  
  // Refs
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const videoRef = useRef(null);
  const thumbnailCanvasRef = useRef(null);

  // Helper to format time as HH:MM:SS or MM:SS
  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const isoString = date.toISOString().substring(11, 19);
    return seconds >= 3600 ? isoString : isoString.substring(3);
  };

  // Handle file selection
  const handleMediaChange = (event) => {
    const files = Array.from(event.target.files);
    const newMedia = files.map((file) => {
      const id = URL.createObjectURL(file);
      const isVideo = file.type.includes('video');
      
      return {
        id,
        file,
        type: isVideo ? 'video' : 'image',
        editedDataUrl: id,
        filters: {
          type: 'none',
          brightness: 100,
          contrast: 100,
          rotation: 0,
        },
        trimStart: 0,
        trimEnd: isVideo ? 0 : null,
      };
    });
    setMedia((prev) => [...prev, ...newMedia].slice(0, 8));
  };

  // Remove media item
  const handleRemove = (id) => {
    setMedia((prev) => prev.filter((item) => item.id !== id));
  };

  // Edit media item
  const handleEdit = (item) => {
    setEditingMedia(item);
    setOpenEditor(true);
    
    if (item.type === 'video') {
      setIsVideoEditing(true);
      setFilter('none');
    } else {
      setIsVideoEditing(false);
      setFilter(item.filters.type);
      setBrightnessIndex(
        brightnessSteps.indexOf(item.filters.brightness) >= 0
          ? brightnessSteps.indexOf(item.filters.brightness)
          : 2
      );
      setContrastIndex(
        contrastSteps.indexOf(item.filters.contrast) >= 0
          ? contrastSteps.indexOf(item.filters.contrast)
          : 2
      );
      setRotation(item.filters.rotation ?? 0);
      setCrop(undefined);
      setCompletedCrop(null);
      setIsCropActive(false);
      setFlipHorizontal(item.filters.flipHorizontal || false);
      setFlipVertical(item.filters.flipVertical || false);
    }
  };
const handleAdvancedEditorSave = (editedImageObject) => {
  // Create a Promise to handle the image conversion
  const processImage = new Promise((resolve) => {
    if (editedImageObject.imageBase64) {
      // If we already have a base64 image, use it directly
      resolve(editedImageObject.imageBase64);
    } else if (editedImageObject.fullName) {
      // If we have a file name, convert it to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(editedImageObject.fullName);
    } else {
      // Fallback to the original image if no edits were made
      resolve(editingMedia.editedDataUrl);
    }
  });

  // Process the image and update state
  processImage.then((imageData) => {
    setMedia((prev) =>
      prev.map((item) =>
        item.id === editingMedia.id
          ? { 
              ...item, 
              editedDataUrl: imageData,
              // For images, preserve any existing filters
              ...(item.type === 'image' ? {
                filters: {
                  ...item.filters,
                  // Reset crop-related data when using advanced editor
                  cropX: undefined,
                  cropY: undefined,
                  cropWidth: undefined,
                  cropHeight: undefined
                }
              } : {})
            }
          : item
      )
    );
    
    // Close the editor
    setOpenEditor(false);
    
    // Reset editing state
    setEditingMedia(null);
    setEditorMode('basic');
  }).catch((error) => {
    console.error('Error saving edited image:', error);
    // Fallback to original image on error
    setMedia((prev) =>
      prev.map((item) =>
        item.id === editingMedia.id
          ? item // Keep original if error occurs
          : item
      )
    );
  });
};
  // Save edited media
  const handleSaveEditedMedia = () => {
    if (isVideoEditing) {
      // Save video trim
      setMedia((prev) =>
        prev.map((item) =>
          item.id === editingMedia.id
            ? {
                ...item,
                trimStart: videoStart,
                trimEnd: videoEnd,
              }
            : item
        )
      );
    } else {
      // Save image edits
      let editedDataUrl = editingMedia.editedDataUrl;

      if (isCropActive && completedCrop?.width && completedCrop?.height) {
        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = imgRef.current;

        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          image,
          completedCrop.x,
          completedCrop.y,
          completedCrop.width,
          completedCrop.height,
          0,
          0,
          completedCrop.width,
          completedCrop.height
        );

        editedDataUrl = canvas.toDataURL();
      }

      setMedia((prev) =>
        prev.map((item) =>
          item.id === editingMedia.id
            ? {
                ...item,
                editedDataUrl,
                filters: {
                  type: filter,
                  brightness: brightnessSteps[brightnessIndex],
                  contrast: contrastSteps[contrastIndex],
                  rotation,
                  flipHorizontal,
                  flipVertical,
                },
              }
            : item
        )
      );
    }
    setOpenEditor(false);
  };

  // Image load handler
  const onImageLoad = () => {
    setCrop({
      unit: '%',
      width: 100,
      aspect: 1,
    });
  };

  // Video metadata loaded handler
  const onVideoLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setVideoDuration(duration);
      setVideoEnd(duration);
      if (editingMedia) {
        setVideoStart(editingMedia.trimStart || 0);
        setVideoEnd(editingMedia.trimEnd || duration);
      }
    }
  };

  // Generate video thumbnails
  useEffect(() => {
    if (!videoRef.current || !thumbnailCanvasRef.current || !isVideoEditing) return;

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
        
        // Wait for seek to complete
        await new Promise(resolve => {
          video.addEventListener('seeked', resolve, { once: true });
        });
        
        // Draw frame to canvas
        canvas.width = 160; // Thumbnail width
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
  }, [editingMedia, isVideoEditing]);

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

  // Apply image filters
  const applyFilters = () => ({
    filter: `
      brightness(${brightnessSteps[brightnessIndex]}%)
      contrast(${contrastSteps[contrastIndex]}%)
      saturate(100%)
      ${filter !== 'none' ? filter : ''}
    `,
    transform: `
    rotate(${rotation}deg)
    scaleX(${flipHorizontal ? -1 : 1})
    scaleY(${flipVertical ? -1 : 1})`,

    transition: 'transform 0.3s ease',
  });

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  // Handle slider change for video trimming
  const handleSliderChange = (event, newValue) => {
    if (Array.isArray(newValue)) {
      setVideoStart(newValue[0]);
      setVideoEnd(newValue[1]);
      if (videoRef.current) {
        videoRef.current.currentTime = newValue[0];
      }
    }
  };

  // Handle video time updates
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentVideoTime(videoRef.current.currentTime);
      if (videoRef.current.currentTime >= videoEnd) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
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

  // Cycle brightness and contrast
  const cycleBrightness = () => {
    setBrightnessIndex((prev) => (prev + 1) % brightnessSteps.length);
  };
  
  const cycleContrast = () => {
    setContrastIndex((prev) => (prev + 1) % contrastSteps.length);
  };
  
  // Rotate image
  const rotate90 = () => {
    setRotation((prev) => (prev + 90) % 360);
     setHasUnsavedChanges(true);
  };

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Grid container spacing={1}>
        {media.map((item) => (
          <Grid item xs={3} key={item.id}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover .edit-button': { opacity: 1 },
              }}
            >
              {item.type === 'video' ? (
                <>
                <video
                  src={item.editedDataUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    aspectRatio: '1/1',
                  }}
                  muted
                  loop
                />
                 <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(173, 170, 170, 0.68))',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(173, 170, 170, 0.68)',
                      }
                    }}
                  >
                    <Box  component='img' 
                    src={PlayCircleOutlineIcon} width={48}/>
                  </Box>
                </>

              ) : (
                <img
                  src={item.editedDataUrl}
                  alt="preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    aspectRatio: '1/1',
                    filter: `
                      brightness(${item.filters.brightness}%)
                      contrast(${item.filters.contrast}%)
                      saturate(100%)
                      ${item.filters.type}
                    `,
                    transform: `rotate(${item.filters.rotation ?? 0}deg)`,
                    transition: 'transform 0.3s ease',
                  }}
                />
              )}
              <IconButton
                size="small"
                onClick={() => handleRemove(item.id)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(255,255,255,0.8)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <IconButton
                className="edit-button"
                size="small"
                onClick={() => handleEdit(item)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  bgcolor: 'rgba(255,255,255,0.8)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ position: 'relative', mt: 2 }}>
        {media.length === 0 ? (
          <>
            <Box
              onClick={openFilePicker}
              sx={{
                width: '100%',
                height: '147px',
                bgcolor: '#f0f0f0',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginBottom: '10px',
                '&:hover': { bgcolor: '#e0e0e0' },
              }}
            >
              <Box component={'img'} src={AddImagesIcons} />
            </Box>
            <IconButton
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 999,
                backgroundColor: '#fff',
                borderRadius: '50%',
              }}
              onClick={toggleImageUploader}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Box
            onClick={openFilePicker}
            sx={{
              width: '100%',
              height: '64px',
              bgcolor: '#CBD5E1',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: '10px',
              '&:hover': { bgcolor: '#e0e0e0' },
            }}
          >
            <AddIcon sx={{ fontSize: '30px', color: '#475569' }} />
          </Box>
        )}
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={(e) => {
            handleMediaChange(e);
            handleImageChange(e);
          }}
      />

      <Dialog 
        open={openEditor} 
        onClose={() => setOpenEditor(false)} 
        maxWidth="md" 
        fullWidth 
        sx={{
          cursor: 'pointer',
          boxShadow: 'none',
          '& .MuiPaper-root': {
            border: '1px solid #E2E8F0',
            padding: '40px 60px',
            borderRadius: '39px'
          },
        }}
      >
        <DialogTitle sx={{
          fontFamily:'Plus Jakarta Sans',
          fontSize:'36px',
          fontWeight:'800',
          lineHeight:'44px',
          borderBottom:'1px solid #E2E8F0',
          marginBottom:'20px'
        }}>
          Create post 
          <IconButton 
            onClick={() => handleCloseEditor(true)}  
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
        
        <DialogContent sx={{
          border:'1px solid #CBD5E1',
          borderRadius:'12px',
          padding:'12px 20px'
        }}>
          {isVideoEditing ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                backgroundColor: '#F5F5F5',
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              {/* Video Preview */}
              <video
                ref={videoRef}
                src={editingMedia?.editedDataUrl}
                style={{ 
                  maxWidth: '100%', 
                  borderRadius: '12px',
                  aspectRatio: '16/9',
                  backgroundColor: '#000'
                }}
                controls={false}
                onLoadedMetadata={onVideoLoadedMetadata}
                onTimeUpdate={handleVideoTimeUpdate}
              />
              
              {/* Timeline Controls */}
              {/* Timeline Controls */}
<Box 
  sx={{ 
    position: 'relative',
    width: '90%',
    px: 2,
    mb: 2
  }}
  onMouseEnter={() => setIsHoveringSlider(true)}
  onMouseLeave={() => setIsHoveringSlider(false)}
  onMouseMove={handleSliderHover}
>
  {/* Time Display */}
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center',
    mb: 1
  }}>
    <Typography sx={{ textAlign:'center' }}>
      {formatTime(currentVideoTime)} / {formatTime(videoDuration)}
    </Typography>
  </Box>

  {/* 🆕 Thumbnail Slideshow Strip */}
  <Box
    sx={{
      display: 'flex',
      overflowX: 'auto',
      width: '100%',
      mt: 1,
      mb: 1,
      px: 1,
      gap: 0.5,
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
          width: '80px',
          height: '45px',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
          border: (thumb.time >= videoStart && thumb.time <= videoEnd)
            ? '2px solid #14b8a6'
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

  {/* Main Slider */}
  <Slider
    value={[videoStart, videoEnd]}
    onChange={handleSliderChange}
    min={0}
    max={videoDuration}
    step={0.1}
    sx={{
      '& .MuiSlider-thumb': {
        height: 20,
        width: 20,
        backgroundColor: '#14b8a6',
      },
      '& .MuiSlider-track': {
        backgroundColor: '#14b8a6',
      },
      '& .MuiSlider-rail': {
        backgroundColor: '#CBD5E1',
      },
    }}
  />

  {/* Time Markers */}
  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    mt: -1,
    px: 0.5
  }}>
    {[0, 2, 4, 6, 8, 10, 12].map((time) => (
      <Typography key={time} variant="caption" color="text.secondary">
        {time}s
      </Typography>
    ))}
  </Box>

  {/* Thumbnail Preview on Hover */}
  {isHoveringSlider && hoverTime !== null && thumbnails.length > 0 && (
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
  )}

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
      <CircularProgress size={24} />
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
                <Button 
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
                </Button>
                <Button 
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
                </Button>
              </Box>
            </Box>
          ) : editorMode === 'basic' ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                backgroundColor: '#F5F5F5',
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              <Grid container>
                <Grid item xs={7} sx={{ padding: '15px' }}>
                  {isCropActive ? (
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => handleCropChange(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={1}
                    >
                      <img
                        ref={imgRef}
                        src={editingMedia?.editedDataUrl}
                        onLoad={onImageLoad}
                        style={applyFilters()}
                        alt="to edit"
                      />
                    </ReactCrop>
                  ) : (
                    <img
                      src={editingMedia?.editedDataUrl}
                      alt="Preview"
                      style={{ maxWidth: '100%', borderRadius: '12px', ...applyFilters() }}
                    />
                  )}
                </Grid>

                <Grid item xs={5}>
                  <Button
                    fullWidth
                   
                    onClick={() => setIsCropActive(!isCropActive)}
                    sx={{
                      alignSelf: 'flex-start',
                      mb: 2,
                      backgroundColor: '#F8FAFC',
                      padding: '16px 24px',
                      border: '1px solid #475569',
                      borderRadius: '12px',
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: '700',
                      fontSize: '18px',
                      lineHeight: '24px',
                      color: '#475569',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {isCropActive ? 'Disable Crop' : 'Crop'}
                    <Box
                      component="img"
                      src={CropIcon}
                      alt="Crop Icon"
                      sx={{ marginLeft: '10px', width: 24, height: 24 }}
                    />
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={rotate90}
                    sx={{
                      alignSelf: 'flex-start',
                      mb: 2,
                      backgroundColor: '#F8FAFC',
                      padding: '16px 24px',
                      border: '1px solid #14B8A6',
                      borderRadius: '12px',
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: '700',
                      fontSize: '18px',
                      lineHeight: '24px',
                      color: '#475569',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    Rotate
                    <Box
                      component="img"
                      src={RotateIcon}
                      alt="Rotate Icon"
                      sx={{ marginLeft: '10px', width: 24, height: 24 }}
                    />
                  </Button>
                  {/* Flip Options */}
                  <Box sx={{display:'flex',gap:2}}>
                    <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={flipHorizontally}
                    sx={{
                      alignSelf: 'flex-start',
                      mb: 2,
                      backgroundColor: '#F1F5F9',
                      padding: '16px 24px',
                      border: '1px solid #64748B',
                      borderRadius: '12px',
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: '700',
                      fontSize: '18px',
                      lineHeight: '24px',
                      color: '#475569',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
>
                  Flip 
                  <Box component='img'
                  src={FlipHorizontalIcon}
                   sx={{ 
                   width:'24px',
                  marginLeft:'10px'
                  }} />
                   
                 
             </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={flipVertically}
                sx={{
                  alignSelf: 'flex-start',
                      mb: 2,
                      backgroundColor: '#F1F5F9',
                      padding: '16px 24px',
                      border: '1px solid #64748B',
                      borderRadius: '12px',
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: '700',
                      fontSize: '18px',
                      lineHeight: '24px',
                      color: '#475569',
                      display: 'flex',
                      justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                Flip 
               <Box component='img'
                  src={FlipVerticalIcon}
                   sx={{ 
                   width:'24px',
                  marginLeft:'10px'
                  }} />
              </Button>
                  </Box>

                  <Typography sx={{
                    fontFamily:'Plus Jakarta Sans',
                    fontSize:'20px',
                    color:'#1E293B',
                    fontWeight:'700',
                    marginBottom:'15px'
                  }}>
                    Add Filter
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap',
                      marginBottom: 2,
                      userSelect: 'none',
                    }}
                  >
                    {filters.map((f) => (
                      <Box sx={{ position:'relative' }}>
                        <Box
                          key={f.value}
                          onClick={() => handleFilterChange(f.value)}
                          sx={{
                            cursor: 'pointer',
                            border: filter === f.value ? '2px solid #475569' : '2px solid transparent',
                            borderRadius: 2,
                            overflow: 'hidden',
                            width: 100,
                            height: 140,
                          }}
                        >
                          <img
                            src={editingMedia?.editedDataUrl}
                            alt={f.label}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              filter: f.value === 'none' ? 'none' : f.value,
                              userSelect: 'none',
                            }}
                            draggable={false}
                          />
                        </Box>
                        <Typography sx={{
                          fontFamily:'Plus Jakarta Sans',
                          fontSize:'16px',
                          fontWeight:'700',
                          textAlign:'center',
                        }}>
                          {f.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
              <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
            </Box>
          ) : (
            <FilerobotImageEditor
              source={editingMedia?.editedDataUrl}
              onSave={handleAdvancedEditorSave}
              onClose={() => setOpenEditor(false)}
              annotationsCommon={{
                fill: '#ff0000',
              }}
              Text={{ text: 'Custom Text' }}
              Crop={{ cropPresets: [] }}
              Rotate={{ angle: 0 }}
            />
          )}
        </DialogContent>
        
        <DialogActions>
          {(!isVideoEditing && editorMode === 'basic') || isVideoEditing ? (
            <Button
              sx={{
                backgroundColor:'#14b8a6',
                borderRadius:'8px',
                padding:'16px',
                fontSize:'20px',
                fontFamily:'Plus Jakarta Sans',
                fontWeight:'600',
                color:'#fff',
                width:'70%'
              }} 
              onClick={handleSaveEditedMedia}
            >
              {isVideoEditing ? 'Save Trim' : 'Save'}
            </Button>
          ) : null}
          <Button
            sx={{
              backgroundColor:'#CBD5E1',
              borderRadius:'8px',
              padding:'16px',
              fontSize:'20px',
              fontFamily:'Plus Jakarta Sans',
              fontWeight:'600',
              color:'#334155',
              width: isVideoEditing || (editorMode === 'basic' && !isVideoEditing) ? '30%' : '100%'
            }} 
            onClick={() => setOpenEditor(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Hidden canvas for thumbnails */}
      <canvas ref={thumbnailCanvasRef} style={{ display: 'none' }} />

        {/* Add this confirmation dialog */}
  <Dialog open={showExitConfirm} onClose={() => setShowExitConfirm(false)} 
     sx={{
          cursor: 'pointer',
          boxShadow: 'none',
          '& .MuiPaper-root': {
          width:'360px',
            border: '1px solid #E2E8F0',
            padding: '12px ',
            borderRadius: '39px'
          },
        }}>
    <DialogTitle sx={{
      fontFamily:'Plus Jakarta Sans',
      fontSize:'14px',
      fontWeight:'800',
      lineHeight:'20px'
    }}> You have unsaved changes</DialogTitle>
    <DialogContent>
      <Typography  sx={{
      fontFamily:'Plus Jakarta Sans',
      fontSize:'12px',
      fontWeight:'400',
      lineHeight:'20px'
    }}>If you leave now,<br />
 your changes will be lost</Typography>
    </DialogContent>
    <DialogActions>
      <Button 
        onClick={() => setShowExitConfirm(false)}
        sx={{ 
           fontFamily:'Plus Jakarta Sans',
            fontSize:'14px',
            fontWeight:'700',
            lineHeight:'20px',
            color:'rgba(71, 85, 105, 1)',
            padding:'6px 12px',
            border:'1px solid rgba(203, 213, 225, 1)',
            borderRadius:'12px'
         }}
      >
        Keep editing
      </Button>
      <Button 
        onClick={handleDiscardChanges}
          sx={{ 
           fontFamily:'Plus Jakarta Sans',
            fontSize:'14px',
            fontWeight:'700',
            lineHeight:'20px',
            color:'#fff',
            padding:'6px 12px',
            border:'1px solid rgba(20, 184, 166, 1)',
            borderRadius:'12px',
            backgroundColor:'rgba(20, 184, 166, 1)'
         }}
      >
        Ignore
      </Button>
      {/* <Button 
        onClick={handleSaveAndClose}
        sx={{ color: '#14B8A6', fontWeight: 'bold' }}
      >
        Save
      </Button> */}
    </DialogActions>
  </Dialog>

    </Box>
  );
}