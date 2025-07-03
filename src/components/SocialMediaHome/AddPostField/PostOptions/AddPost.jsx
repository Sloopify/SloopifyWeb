import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
   editorRef,
   setPostData
}) {
 
  const fileInputRef = useRef();

  

  const toggleImageUploader = () => {
    setImageView(prev => !prev);

  };


const updateImagesList = (newImages) => {
  setImages(newImages);

  // Update postData.mediaFiles
  setPostData(prevData => ({
    ...prevData,
    mediaFiles: newImages.map((img, i) => ({
      file: img.file,
      type: img.type || 'image',
      order: i + 1,
    })),
  }));
};


const handleImageChange = (event) => {
  const files = Array.from(event.target.files || []);
  const validFiles = files.filter(file => file.type.startsWith('image/'));

  const newImages = validFiles.map(file => ({
    id: uuidv4(), // stable unique ID
    file,
    previewUrl: URL.createObjectURL(file),
  }));

  const totalImages = [...images, ...newImages].slice(0, 20); // max 8

  // Reset background settings
  setEditorData({
    ...editorData,
    bgColor: 'transparent',
    bgGradient: null,
    bgImage: null,
    hasBackgroundColor: false,
    hasBackgroundImage: false,
    textProperties: {
      ...editorData.textProperties,
      color: '#475569',
    },
  });

  updateImagesList(totalImages); // ✅ use shared updater

  // Update editor color
  if (editorRef.current) {
    setTimeout(() => {
      editorRef.current.commands.selectAll();
      editorRef.current.commands.setColor('#475569');
      editorRef.current.commands.setTextSelection(editorRef.current.state.doc.content.size);
    }, 100);
  }

  // Clear input
  if (fileInputRef.current) {
    fileInputRef.current.value = null;
  }
};



  return (
    <Box sx={{marginTop:'20px'}}>
     <Box sx={{marginBottom:'20px'}}>
         <PostComposer onPostDataChange={onPostDataChange}  editorData={editorData} setEditorData={setEditorData} postData={postData} setPostData={setPostData}  editorRef={editorRef}   images={images}/>
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
          margin:'0px 5px'
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
               margin:'0px 5px'
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
               margin:'0px 5px'
          }}
        />
      )}

      {/* Image Uploader */}
      {imageView && (
        <ImageGridUploader
          images={images}
          setImages={setImages}
          updateImagesList={updateImagesList}
          toggleImageUploader={toggleImageUploader}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
          editorData={editorData} setEditorData={setEditorData}  editorRef={editorRef}
          setPostData={setPostData}
         
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
            fontSize: {
              xs:'12px',
              md:'20px'},
            lineHeight: '160%',
            color: '#475569',
            fontWeight: '400',
            minWidth: '40%'
          }}
        >
          Add to your post
        </Typography>

        <Stack direction="row" spacing={0} sx={{ mt: 0 }}>
          <Tooltip title="Add Location">
            <IconButton onClick={() => setView('locations')} sx={{
                padding:{
                  xs:'5px',
                   md:'12px'
                }
              }}>
              <Box component={'img'} src={LocationIcon} sx={{
                width:{
                  xs:'12px',
                  md:'24px'
                }
              }}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Image">
            <IconButton onClick={toggleImageUploader} color={imageView ? 'primary' : 'default'} sx={{
                padding:{
                  xs:'5px',
                 md:'12px'
                }
              }}>
              <Box component={'img'} src={AddImageIcon} sx={{
                width:{
                  xs:'12px',
                  md:'24px'
                }
              }}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Gif">
            <IconButton sx={{
                padding:{
                  xs:'5px',
                  md:'12px'
                }
              }}>
              <Box component={'img'} src={GiftIcon} sx={{
                width:{
                  xs:'12px',
                  md:'24px'
                }
              }}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Tag Friends">
            <IconButton onClick={() => setView('friends')} sx={{
                padding:{
                  xs:'5px',
                 md:'12px'
                }
              }}>
              <Box component={'img'} src={TagFriendIcon} sx={{
                width:{
                  xs:'12px',
                  md:'24px'
                }
              }} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Tooltip title="All Options">
          <IconButton onClick={() => setView('add-ons')} sx={{
                padding:{
                  xs:' 5px',
                  md:'12px'
                }
              }}>
            <Box component={'img'} src={OptionsIcon} sx={{
                width:{
                  xs:'12px',
                  md:'24px'
                }
              }}/>
          </IconButton>
        </Tooltip>

      </Box>
      <Button fullWidth sx={{
        fontFamily:'Plus Jakarta Sans',
        fontSize:{
          xs:'14px',
          md:'20px'
        },
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
