import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';

import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GifIcon from '@mui/icons-material/Gif';
import ImageIcon from '@mui/icons-material/Image';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocationIcon from '../../../../assets/Home/icons/location.svg';
import AddImageIcon from '../../../../assets/Home/icons/image.svg';
import GiftIcon from '../../../../assets/Home/icons/gif.svg';
import TagFriendIcon from '../../../../assets/Home/icons/fluent_person-tag-20-regular.svg';
import OptionsIcon from '../../../../assets/Home/icons/DotsThree.svg';
// Component
import ImageGridUploader from './ImageGridUploader';

export default function AddPost({ setView }) {

  const [imageView, setImageView] = useState(false);
  
  const toggleImageUploader = () => {
    setImageView(prev => !prev);
  };


  return (
    <Box>
      <TextField
        fullWidth
        multiline
        minRows={3}
        placeholder="What are you thinking...?"
      
        sx={{
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiInputBase-root': { alignItems: 'flex-start' },
            '& .MuiInputBase-input::placeholder': {
              color: '#475569',
              opacity: '1',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: '400',
              fontSize:'48px',
              lineHeight:'60px'
            }
          }}
      />
      {/* image uploader */}
      {imageView && <ImageGridUploader toggleImageUploader={toggleImageUploader} />}
      {/* add emotion */}
      <Tooltip title="Feeling/Activity">
          <IconButton>
            <SentimentSatisfiedAltIcon color="#A3A3A3" onClick={() => setView('feelings')}/>
          </IconButton>
      </Tooltip>

      <Box sx={{display:'flex',alignItems:'center',
        padding:'10px',
        border:'1px solid #E5E5E5',
        borderRadius:'12px',
        marginTop:'10px',
        justifyContent:'space-between'
      }}>
        <Typography
        sx={{
          fontFamily:'Plus Jakarta Sans',
          fontSize:'20px',
          lineHeight:'160%',
          color:'#475569',
          fontWeight:'400',
          minWidth:'60%'

        }}
        >add to your post   </Typography>
         <Stack direction="row" spacing={0} sx={{ mt: 1 }}>
       
        <Tooltip title="Add Location">
            <IconButton>
            <Box component={'img'} src={LocationIcon}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Image">
          <IconButton onClick={toggleImageUploader} color={imageView ? 'primary' : 'default'}>
            <Box component={'img'} src={AddImageIcon}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Gif">
          <IconButton>
            <Box component={'img'} src={GiftIcon}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Tag Friends">
          <IconButton>
            <Box component={'img'} src={TagFriendIcon}/>
          </IconButton>
        </Tooltip>
      </Stack>
       <Tooltip title="All Options">
          <IconButton onClick={() => setView('add-ons')}>
            <Box component={'img'} src={OptionsIcon}/>
          </IconButton>
        </Tooltip>
      </Box>
     
    </Box>
  );
}
