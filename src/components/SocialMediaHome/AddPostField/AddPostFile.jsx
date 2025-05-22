import React, { useState } from 'react';
import { Box, TextField, IconButton, Button, Stack, Paper, Typography, InputAdornment} from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';

// icons
import AttachIcon from '../../../assets/Home/icons/Paperclip.svg';
import EmotionIcon from '../../../assets/Home/icons/motion.svg';
import VoiceIcon from '../../../assets/Home/icons/voice.svg';
import SubmitIcon from '../../../assets/Home/icons/PaperPlaneRight.svg'




export default function AddPostField() {
  const [postContent, setPostContent] = useState('');

  const handlePost = () => {
    console.log('Posting:', postContent);
    // Add your post submission logic here
    setPostContent('');
  };

  return (
    <Paper  sx={{  maxWidth: '100%', mx: 'auto', boxShadow:'none' ,width:'99%',
        border:'1px solid #E2E8F0',
        padding:'10px 10px 15px 0px',
    }}>
      
      <TextField
        multiline
        fullWidth
        minRows={1}
       
        placeholder="What’s on your mind right now?"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        sx={{ mb: 2,
             outline:'none',
            '& .MuiInputBase-inputMultiline':{
                outline:'none',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
              '& .MuiInputBase-root':{
             
                outline:'none',
                alignItems: 'flex-start'       
            },
            '& .MuiInputBase-input::placeholder': {
                color:'#475569',
                opacity:'1',
                fontFamily:'Plus Jakarta Sans',
                fontWeight:'500'
            }
         }}
            InputProps={{
            startAdornment: (
                <InputAdornment position="start" >
                    <Box
                    component="img"
                    src={AttachIcon}
                    alt="Attach Icon"
                />
                </InputAdornment>
                ),
        }}
      />
      <Stack direction="row" justifyContent="end" alignItems="center">
        <Box>
          <IconButton
          sx={{
                border:'1px solid #CBD5E1',
                margin:'0px 5px'
            }}>
            <Box
                component="img"
                src={EmotionIcon}
                alt="Search Icon"
                />
          </IconButton>
          <IconButton
            sx={{
                border:'1px solid #CBD5E1',
                margin:'0px 5px'
            }}
          >
             <Box
                component="img"
                src={VoiceIcon}
                alt="Voice Icon"
            />
          </IconButton>
        </Box>
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={!postContent.trim()}
          sx={{
            backgroundColor:'#14B8A6',
            padding:'10px 16px',
            borderRadius:'1234px',
            color:'#fff',
            fontFamily:'Plus Jakarta Sans',
            fontSize:'14px',
            fontWeight:'700',
            boxShadow:'none',
            textTransform:'capitalize',
            marginLeft:'8px',
            '&.Mui-disabled ':{
                backgroundColor:'#14B8A6',
                color:'#fff',
            }
          }}
        >
          Post
           <Box
                component="img"
                src={SubmitIcon}
                alt="Submit Icon"
                sx={{
                    marginLeft:'8px'
                }}
            />
        </Button>
      </Stack>
    </Paper>
  );
}
