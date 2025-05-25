import React, { useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Typography
} from '@mui/material';

import { Grid } from "@mui/joy";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import AddImagesIcons from '../../../../assets/Home/icons/flat-color-icons_add-image.svg'

export default function ImageGridUploader({toggleImageUploader}) {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: URL.createObjectURL(file),
      file
    }));

    // Limit total to 8 images
    const totalImages = [...images, ...newImages].slice(0, 8);
    setImages(totalImages);
  };

  const handleRemove = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={1}>
        {images.map((img) => (
          <Grid item xs={3} key={img.id}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <img
                src={img.id}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemove(img.id)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(255,255,255,0.8)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}

        {images.length < 8 && (
          <Grid item xs={12} sx={{position:'relative'}} >
            <Box
              onClick={openFilePicker}
              sx={{
                position:'relative',
                width: '100%',
                height: '147px',
                bgcolor: '#f0f0f0',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginBottom:'10px',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              <Box component={'img'} src={AddImagesIcons}/>
             
            </Box>
            <IconButton sx={{
                position:'absolute',
                top:'10px',
                right:'10px',
                zIndex:'999',
                backgroundColor:'#fff',
                borderRadius:'50%'
            }} onClick={() => toggleImageUploader()}>
              <CloseIcon fontSize="small"  
              />
            </IconButton>
             
          </Grid>
        )}
      </Grid>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleImageChange}
      />
    </Box>
  );
}
