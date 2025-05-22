import React, { useState } from 'react';
import {
  Paper,
  Avatar,
  Typography,
  Box,
  IconButton,
  CardMedia,
  Stack,
  Collapse,
  TextField,
  Button,
} from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

// images
import UserAvatar from '../../../assets/Home/AvatarUser.png';
import sendCommentIcon from '../../../assets/Home/icons/sendCommentIcon.svg';
import AttachFile from '../../../assets/Home/icons/fileAttachment.svg';
import EmotionIcon from '../../../assets/Home/icons/motion.svg'

const Post = ({ user, content, image, postedAt }) => {
  const [likes, setLikes] = useState(18);
  const [liked, setLiked] = useState(false);
  const [shares, setShares] = useState(229);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    {avatar:"/assets/Home/Frame.png", id: 1, author: 'Jane', text: 'Awesome shot!' },
  ]);
  const [commentText, setCommentText] = useState('');

  const toggleLike = () => {
    setLiked(!liked);
    setLikes((prev) => prev + (liked ? -1 : 1));
  };
  const toggleShare = () => {
  
    setShares((prev) => prev + 1);
  };
  const toggleSave = () => {
    setSaved(!saved);
  };
  const handleAddComment = () => {
    if (commentText.trim()) {
      setComments([...comments, { id: Date.now(), author: 'You', text: commentText }]);
      setCommentText('');
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 0,boxShadow:'none',borderBottom:'1px solid #E2E8F0' }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Avatar src={user.avatar} alt={user.name} />
        <Box>
          <Typography variant="subtitle1" fontWeight={700}
          sx={{
            fontFamily:'Plus Jakarta Sans',
            color:'#1E293B',
            fontSize:'14px',
            lineHeight:'20px'
          }}
          >
            {user.name}
          </Typography>
          <Typography variant="caption" 
          sx={{
            fontFamily:'Plus Jakarta Sans',
            color:'#475569',
            fontSize:'14px',
            fontWeight:'400'
          }}
          
          >
            {/* {formatDistanceToNow(new Date(postedAt), { addSuffix: true })} */}
            {user.position}, {user.company}
          </Typography>
        </Box>
      </Stack>

      {/* Post Text */}
      <Typography variant="body1" sx={{ mb: image ? 2 : 1,
        padding:'10px 0px',
        fontFamily:'Plus Jakarta Sans',
        color:'#1E293B',
        fontWeight:'400',
        fontSize:'14px'
       }}>
        {content}
      </Typography>

      {/* Image */}
      {image && (
        <CardMedia
          component="img"
          image={image}
          alt="Post"
          sx={{ borderRadius: 2, maxHeight: 400, objectFit: 'cover', mb: 1 }}
        />
      )}

      {/* Action Buttons */}
      <Stack direction="row" alignItems="center">
        <IconButton onClick={toggleLike}>
          {liked ? <ThumbUpOffAltIcon
          sx={{
            color:'#14B8A6'
          }}/> : <ThumbUpOffAltIcon 
          sx={{
            color:'#94A3B8'
          }}/>}
        </IconButton>
        <Typography variant="body2"
          sx={{
            fontFamily:'Plus Jakarta Sans',
            color:'#1E293B',
            fontSize:'14px',
            fontWeight:'500',
            marginRight:'30px'
          }}
        >{likes} Likes</Typography>

        <IconButton onClick={() => setShowComments((prev) => !prev)}>
          <SmsOutlinedIcon 
          sx={{
            color:'#94A3B8',
            fontSize:'20px'
          }} />
        </IconButton>
        <Typography
          sx={{
            fontFamily:'Plus Jakarta Sans',
            color:'#1E293B',
            fontSize:'14px',
            fontWeight:'500',
            marginRight:'30px'
          }}
         variant="body2">{comments.length} Comments</Typography>

        <IconButton  onClick={toggleShare}>

          <ReplyIcon 
          sx={{
            color:'#94A3B8',
            fontSize:'20px',
            marginRight:'5px'
          }}/>
          <Typography variant="body2"
          sx={{
            fontFamily:'Plus Jakarta Sans',
            color:'#1E293B',
            fontSize:'14px',
            fontWeight:'500',
            marginRight:'30px'
          }}
        >{shares} Share</Typography>
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton  onClick={toggleSave}>
          {saved ? <BookmarkIcon sx={{color:'#94A3B8'}} />
           : <BookmarkBorderIcon sx={{color:'#94A3B8'}}/>}
        </IconButton>
      </Stack>

      {/* Comments */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Box mt={2} sx={{borderTop:'1px solid #E2E8F0',paddingTop:'15px'}}>
          {comments.map((c) => (

            <Box key={c.id} mb={1} sx={{display:'flex',
              width:'auto',
              backgroundColor:'#F1F5F9',
              padding:' 10px',
              borderRadius:'123px'
            }}>

              <Avatar src={c.avatar} /> 
              <Box component={'div'} sx={{paddingLeft:'10px'}}>
                <Typography variant="subtitle2" sx={{
                  color:'#1E293B',
                  fontWeight:'700',
                  lineHeight:'20px',
                  fontSize:'14px',
                  fontFamily:'Plus Jakarta Sans'
                }}>{c.author}</Typography>
                <Typography variant="body2" sx={{
                  color:'#475569',
                  fontWeight:'500',
                  lineHeight:'20px',
                  fontSize:'14px',
                  fontFamily:'Plus Jakarta Sans'
                }}>{c.text}</Typography>
              </Box>             
              
            </Box>
          ))}

          <Stack direction="row"  spacing={1} mt={3} sx={{justifyContent:'space-between'}}>
            <Stack direction="row"  spacing={1} mt={3}>
            <Avatar src={UserAvatar} /> 

            <TextField
              variant="outlined"
              size="small"
              placeholder="Write a comment..."
              fullWidth
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{
                width:'400px',
                 '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #CBD5E1',
                    borderRadius:'123px',
                    padding:'5px'
                  },
                   '& .MuiInputBase-input::placeholder': {
                      color:'#475569',
                      opacity:'1',
                      fontFamily:'Plus Jakarta Sans',
                      fontWeight:'500'
                  }
              }}
            />
            </Stack>
            <Stack direction="row"  spacing={1} mt={3}>
              <Button sx={{
                  border:'1px solid #CBD5E1',
                  borderRadius:'50%',
                  width:'40px',
                  height:'40px',
                  minWidth:'40px'
                }}>
                <Box component={'img'} src={EmotionIcon}
                />
              </Button>
              <Button sx={{
                  border:'1px solid #CBD5E1',
                  borderRadius:'50%',
                  width:'40px',
                  height:'40px',
                  minWidth:'40px'
                }}>
                <Box component={'img'} src={AttachFile}
                />
              </Button>
              <Button onClick={handleAddComment} disabled={!commentText.trim()} sx={{
                  border:'1px solid #14B8A6',
                  borderRadius:'50%',
                  width:'40px',
                  height:'40px',
                  minWidth:'40px'
                }}>
                <Box component={'img'} src={sendCommentIcon}
                />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default Post;
