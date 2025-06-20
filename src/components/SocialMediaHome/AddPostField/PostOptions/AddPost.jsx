import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Chip,
  Avatar,
  Button
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LocationIcon from '../../../../assets/Home/icons/location.svg';
import AddImageIcon from '../../../../assets/Home/icons/image.svg';
import GiftIcon from '../../../../assets/Home/icons/gif.svg';
import TagFriendIcon from '../../../../assets/Home/icons/fluent_person-tag-20-regular.svg';
import OptionsIcon from '../../../../assets/Home/icons/DotsThree.svg';
import EastIcon from '@mui/icons-material/East';
import PostComposer from './PostComposer';
import ImageGridUploader from './ImageGridUploader';

export default function AddPost({
  setView,
  selectedFriends,
  handleRemove,
  selectedFeeling,
  selectedActivity,
  handleRemoveFeeling,
  selectedLocation,
  handleRemovelocation,
  handleRemoveActivity,
  onPostDataChange,
  handleSubmitPost,
  isSubmitting,
  editorData,
  setEditorData,
  postData,
  images,
  setImages,
  imageView,
  setImageView,
   editorRef
}) {
 
  const fileInputRef = useRef();

  

  const toggleImageUploader = () => {
    setImageView(prev => !prev);

  };




 const handleImageChange = (event) => {
  const files = Array.from(event.target.files || []);
  
  // Filter out non-image files
  const validFiles = files.filter(file => file.type.startsWith('image/'));

  const newImages = validFiles.map(file => ({
    id: URL.createObjectURL(file),
    file
  }));

  const totalImages = [...images, ...newImages].slice(0, 8);

  // Reset text background
  setEditorData(prev => ({
    ...prev,
    bgColor: '#fff',
    bgGradient: null,
    bgImage: null
  }));

  // Update image list
  setImages(totalImages);

  // Clear file input (if ref exists)
  if (fileInputRef.current) {
    fileInputRef.current.value = null;
  }
};


  return (
    <Box sx={{marginTop:'20px'}}>
     <Box sx={{marginBottom:'20px'}}>
         <PostComposer onPostDataChange={onPostDataChange}  editorData={editorData} setEditorData={setEditorData} postData={postData}  editorRef={editorRef}/>
     </Box>
     

      {/* Selected Friends */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {selectedFriends.map(friend => (
          <Chip
            key={friend.id}
            label={friend.first_name}
            onDelete={() => handleRemove(friend.id)}
            sx={{
              backgroundColor: '#EEF2FF',
              color: '#475569',
              fontFamily: 'Plus Jakarta Sans',
              fontSize: '14px',
              fontWeight: '700',
              padding: '15px 5px',
              lineHeight: '20px',
              '& .MuiChip-deleteIcon': {
                color: '#14B8A6',
                fontSize: '18px'
              }
            }}
            deleteIcon={<HighlightOffOutlinedIcon />}
          />
        ))}
      </Box>

      {/* Selected Feeling */}
      {selectedFeeling && (
        <Chip
          label={selectedFeeling.name}
          onDelete={handleRemoveFeeling}
          avatar={<Avatar src="/assets/emotion.svg" alt="Happy" />}
          deleteIcon={<HighlightOffOutlinedIcon />}
          sx={{
            backgroundColor: '#EEF2FF',
            color: '#475569',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '14px',
            fontWeight: '700',
            padding: '15px 5px',
            lineHeight: '20px',
            mb: 2
          }}
        />
      )}

      {/* Selected Activity */}
      {selectedActivity && (
        <Chip
          label={selectedActivity}
          onDelete={handleRemoveActivity}
          avatar={<Avatar src="/assets/emotion.svg" alt="Happy" />}
          deleteIcon={<HighlightOffOutlinedIcon />}
          sx={{
            backgroundColor: '#EEF2FF',
            color: '#475569',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '14px',
            fontWeight: '700',
            padding: '15px 5px',
            lineHeight: '20px',
            mb: 2
          }}
        />
      )}

      {/* Selected Location */}
      {selectedLocation && (
        <Chip
          label={selectedLocation.name}
          onDelete={handleRemovelocation}
          avatar={<Avatar src="/assets/location.svg" alt="location" />}
          deleteIcon={<HighlightOffOutlinedIcon />}
          sx={{
            backgroundColor: '#EEF2FF',
            color: '#475569',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '14px',
            fontWeight: '700',
            padding: '15px 5px',
            lineHeight: '20px',
            mb: 2
          }}
        />
      )}

      {/* Image Uploader */}
      {imageView && (
        <ImageGridUploader
          images={images}
          setImages={setImages}
          toggleImageUploader={toggleImageUploader}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
        />
      )}

      {/* Feeling/Activity Icon */}
      <Tooltip title="Feeling/Activity">
        <IconButton onClick={() => setView('feelings')}>
          <SentimentSatisfiedAltIcon sx={{ color: '#A3A3A3' }} />
        </IconButton>
      </Tooltip>

      {/* Bottom Options Row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          border: '1px solid #E5E5E5',
          borderRadius: '12px',
          marginTop: '10px',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '20px',
            lineHeight: '160%',
            color: '#475569',
            fontWeight: '400',
            minWidth: '60%'
          }}
        >
          Add to your post
        </Typography>

        <Stack direction="row" spacing={0} sx={{ mt: 1 }}>
          <Tooltip title="Add Location">
            <IconButton onClick={() => setView('locations')}>
              <Box component={'img'} src={LocationIcon} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Image">
            <IconButton onClick={toggleImageUploader} color={imageView ? 'primary' : 'default'}>
              <Box component={'img'} src={AddImageIcon} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Gif">
            <IconButton>
              <Box component={'img'} src={GiftIcon} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Tag Friends">
            <IconButton onClick={() => setView('friends')}>
              <Box component={'img'} src={TagFriendIcon} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Tooltip title="All Options">
          <IconButton onClick={() => setView('add-ons')}>
            <Box component={'img'} src={OptionsIcon} />
          </IconButton>
        </Tooltip>

      </Box>
      <Button fullWidth sx={{
        fontFamily:'Plus Jakarta Sans',
        fontSize:'20px',
        fontWeight:'700',
        lineHeight:'30px',
        color:'#FFFFFF',
        backgroundColor:'#14B8A6',
        padding:'12px 20px',
        borderRadius:'12px',
        margin:'20px 0px',
      }} onClick={handleSubmitPost}> {isSubmitting ? 'Posting...' : 'Post'} <EastIcon sx={{
        color:'#fff',
        marginLeft:'15px'
      }}/></Button>
    </Box>
  );
}
