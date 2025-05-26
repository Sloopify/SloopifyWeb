import React, { useState } from 'react';
import {
  Box, 
  TextField, 
  IconButton, 
  Button, 
  Stack, 
  Paper,
  InputAdornment, 
  Dialog, 
  DialogContent, 
  DialogTitle,  
  ToggleButton,
  ToggleButtonGroup,
  Switch,Typography, Avatar,Badge

} from '@mui/material';
import { Grid } from "@mui/joy";

import { styled } from '@mui/material/styles';


// Component
import AddPost from './PostOptions/AddPost';
import FeelingsView from './PostOptions/FeelingsView ';
import LocationsView from './PostOptions/LocationsView';
import FriendsView from './PostOptions/FriendsView';
import PostAudiencePanel from './PostOptions/PostAudienceView';

// Icons
import AttachIcon from '../../../assets/Home/icons/Paperclip.svg';
import EmotionIcon from '../../../assets/Home/icons/motion.svg';
import VoiceIcon from '../../../assets/Home/icons/voice.svg';
import SubmitIcon from '../../../assets/Home/icons/PaperPlaneRight.svg';
import CloseIcon from '@mui/icons-material/Close'; 
import AvatarUser from '../../../assets/Home/AvatarUser.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationIcon from '../../../assets/Home/icons/location.svg';
import FeelingIcon from '../../../assets/Home/icons/emotion.svg';
import ImageIcon from '../../../assets/Home/icons/image.svg';
import LiveBoadCastIcon from '../../../assets/Home/icons/BroadCast.svg';
import GiftIcon from '../../../assets/Home/icons/gif.svg';
import BroadCastIcon from '../../../assets/Home/icons/icon-park_broadcast-radio.svg';
import TagFriendIcon from '../../../assets/Home/icons/fluent_person-tag-20-regular.svg';
import PullIcon from '../../../assets/Home/icons/pull.svg';
import GlobalPrivacy from '../../../assets/Home/icons/GlobeHemisphereWest.png';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';



const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    borderRadius: '50%',
    height: 10,
    minWidth: 10,
  },
}));


export default function AddPostField() {
  const [postContent, setPostContent] = useState('');
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState('post');
  const [isTemporary, setIsTemporary] = useState(false);

// Modal Views
const [view, setView] = useState('add-post'); 
// Images Views


  const handlePostTypeChange = (_, newType) => {
    if (newType !== null) setPostType(newType);
  };

  const handlePost = () => {
    console.log('Posting:', postContent);
    setPostContent('');
    setOpen(false);
  };

  return (
    <>
      <Paper
        onClick={() => setOpen(true)}
        sx={{
          cursor: 'pointer',
          maxWidth: '100%',
          mx: 'auto',
          boxShadow: 'none',
          width: '99%',
          border: '1px solid #E2E8F0',
          padding: '10px 10px 15px 0px',
        }}
      >
        <TextField
          multiline
          fullWidth
          minRows={1}
          placeholder="What’s on your mind right now?"
          value=""
          disabled
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiInputBase-root': { alignItems: 'flex-start' },
            '& .MuiInputBase-input::placeholder': {
              color: '#475569',
              opacity: '1',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: '500'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="img" src={AttachIcon} alt="Attach Icon" />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" justifyContent="end" alignItems="center">
            <Box>
              <IconButton sx={{ border: '1px solid #CBD5E1', margin: '0px 5px' }}>
                <Box component="img" src={EmotionIcon} alt="Emoji" />
              </IconButton>
              <IconButton sx={{ border: '1px solid #CBD5E1', margin: '0px 5px' }}>
                <Box component="img" src={VoiceIcon} alt="Voice" />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              onClick={handlePost}
              disabled={!postContent.trim()}
              sx={{
                backgroundColor: '#14B8A6',
                padding: '10px 16px',
                borderRadius: '1234px',
                color: '#fff',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: '14px',
                fontWeight: '700',
                boxShadow: 'none',
                textTransform: 'capitalize',
                marginLeft: '8px',
                '&.Mui-disabled': {
                  backgroundColor: '#14B8A6',
                  color: '#fff',
                }
              }}
            >
              Post
              <Box component="img" src={SubmitIcon} alt="Submit Icon" sx={{ marginLeft: '8px' }} />
            </Button>
          </Stack>
      </Paper>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" PaperProps={{
        sx: {
          borderRadius: '39px',
          width:'730px',
          padding:'19px 39px'
        },
      }}>
        {/* Main View */}
        {view === 'add-post' && (
          <Box>
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                color:'#1E293B',
                fontSize:'36px',
                letterSpacing:'-1.4%',
                borderBottom:'1px solid #D4D4D8'

              }}
            >
              Create post............ 
              <IconButton onClick={() => setOpen(false)} size="small" sx={{
                backgroundColor:'#F5F5F5',
                color:'#64748B'
              }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{padding:'15px',
              border:'1px solid #E5E5E5',
              borderRadius:'12px',
              margin:'10px 0px'
            }}>
              <Box sx={{display:'flex', marginTop:'20px',justifyContent:'space-between'}} >
                <Box  sx={{display:'flex'}}> 
                  <Box>
                    <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    >
                    <Avatar src={AvatarUser}/> 
                    </StyledBadge>
                  </Box>
              
                  <Box sx={{marginLeft:'10px'}}>
                    <Typography sx={{
                      fontFamily:'Plus Jakarta Sans',
                      fontSize:'16px',
                      color:'#1E293B',
                      fontWeight:'700',
                      marginLeft:'10px'
                    }}>jackoub kukuu</Typography>
                    <IconButton sx={{
                      backgroundColor:'#F1F5F9',
                      padding:'5px',
                      borderRadius:'12px',
                      marginTop:'5px'

                    }} onClick={() => setView('privacy')}>
                      <Box component={'img'} src={GlobalPrivacy} width={'20px'}/>
                      <Typography sx={{
                        fontFamily:'Plus Jakarta Sans',
                      fontSize:'12px',
                      color:'#475569',
                      fontWeight:'700',
                      marginLeft:'10px',
                      lineHeight:'20px'
                      }}>public</Typography>
                      <ArrowForwardIosIcon
                      sx={{
                         width:'12px',
                        fontSize: '14px',
                        marginLeft:'10px'
                        
                      }} />

                    </IconButton>


                  </Box>
                </Box>
                
                  <Box display="flex" justifyContent="flex-end" alignItems="top" sx={{with:'100%'} }>
                    <Typography>Temporary Post</Typography>
                    <Switch
                      checked={isTemporary}
                      onChange={(e) => setIsTemporary(e.target.checked)}
                    />
                  </Box>
                


              </Box>
              
            <Typography sx={{
              fontFamily:'Plus Jakarta Sans',
              color:'400',
              fontSize:'20px',
            marginTop:'30px'
            }}>Please select one only.</Typography>

            <ToggleButtonGroup
              value={postType}
              exclusive
              onChange={handlePostTypeChange}
              sx={{
              
                opacity: 1,
                borderRadius: '1234px',
                padding: '3px',
                backgroundColor: '#F8FAFC',
                
              }}
              
            >
              <ToggleButton
              sx={{
                backgroundColor: '#F8FAFC',
                color: '#475569',
                textTransform: 'none',
                borderRadius:'123px',
                fontWeight:'700',
                padding:'10px 15px',
                border:'none',
                margin:'0px 2px',
              
                '&.Mui-selected': {
                  backgroundColor: '#fff',
                  borderRadius:'120px',
                  color: '#1E293B',
                  fontFamily:'Plus Jakarta Sans',
                  fontWeight:'700',
                  
                }
              }} value="post">Post</ToggleButton>
              <ToggleButton
                  sx={{
                backgroundColor: '#F8FAFC',
                color: '#475569',
                textTransform: 'none',
                borderRadius:'123px',
                fontWeight:'700',
                padding:'10px 15px',
                border:'none',
                margin:'0px 2px',
              
                '&.Mui-selected': {
                  backgroundColor: '#fff',
                  borderRadius:'120px',
                  color: '#1E293B',
                  fontFamily:'Plus Jakarta Sans',
                  fontWeight:'700',
                  
                }
              }} value="advertising">Advertising</ToggleButton>
            </ToggleButtonGroup>
              
              {postType === 'post' && <AddPost  setView={setView} />}

            
            </DialogContent>
          </Box>
        )}
        {/* add ons view */}
        {view === 'add-ons' && (
          <Box>
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                color:'#1E293B',
                fontSize:'36px',
                letterSpacing:'-1.4%',
                borderBottom:'1px solid #D4D4D8'

              }}
            >
              Add to your post 
            
              <IconButton onClick={() => setView('add-post')}  sx={{
                backgroundColor:'#E5E5E5',
                color:'#1E1E1E'
              }}>
                  <ArrowBackIcon color='#1E1E1E'/>
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{
              border:'1px solid #E5E5E5',
              borderRadius:'12px',
              margin:'10px 0px',
              padding:'15px 25px',
              '&.MuiDialogContent-root':{
                paddingTop:'15px'
              }
            }}>
            
            <Grid container >
              <Grid item xs={6} display={'flex'} alignItems={'center'} sx={{marginBottom:'25px',cursor:'pointer'}}  onClick={() => setView('locations')}>
                
                <Box component={'img'} src={LocationIcon}/>
                <Typography sx={{
                  color:'#1E293B',
                  fontWeight:'600',
                  fontFamily:'Plus Jakarta Sans',
                  fontSize:'14px',
                  marginLeft:'10px',
                  textTransform:'capitalize'
                }}>location</Typography>
              </Grid>
              <Grid item xs={6} display={'flex'} alignItems={'center'} sx={{marginBottom:'25px',cursor:'pointer'}} onClick={() => setView('feelings')}>
                
                <Box component={'img'} src={FeelingIcon}/>
                <Typography sx={{
                  color:'#1E293B',
                  fontWeight:'600',
                  fontFamily:'Plus Jakarta Sans',
                  fontSize:'14px',
                  marginLeft:'10px',
                  textTransform:'capitalize'
                }}>feelings</Typography>
              </Grid>
               <Grid item xs={6} display={'flex'} alignItems={'center'} sx={{marginBottom:'25px',cursor:'pointer'}} >
                
                <Box component={'img'} src={ImageIcon}/>
                <Typography sx={{
                  color:'#1E293B',
                  fontWeight:'600',
                  fontFamily:'Plus Jakarta Sans',
                  fontSize:'14px',
                  marginLeft:'10px',
                  textTransform:'capitalize'
                }}>image</Typography>
              </Grid>
               <Grid item xs={6} display={'flex'} alignItems={'center'} sx={{marginBottom:'25px'}}>
                
                <Box component={'img'} src={LiveBoadCastIcon}/>
                <Typography sx={{
                  color:'#1E293B',
                  fontWeight:'600',
                  fontFamily:'Plus Jakarta Sans',
                  fontSize:'14px',
                  marginLeft:'10px',
                  textTransform:'capitalize'
                }}>Live video broadcast</Typography>
              </Grid>
              <Grid item xs={6} display={'flex'} alignItems={'center'} sx={{marginBottom:'25px'}}>
                
                <Box component={'img'} src={GiftIcon}/>
                <Typography sx={{
                  color:'#1E293B',
                  fontWeight:'600',
                  fontFamily:'Plus Jakarta Sans',
                  fontSize:'14px',
                  marginLeft:'10px',
                  textTransform:'capitalize'
                }}>gif image</Typography>
              </Grid>
              <Grid item xs={6} display={'flex'} alignItems={'center'} sx={{marginBottom:'25px'}}>
                
                <Box component={'img'} src={BroadCastIcon}/>
                <Typography sx={{
                  color:'#1E293B',
                  fontWeight:'600',
                  fontFamily:'Plus Jakarta Sans',
                  fontSize:'14px',
                  marginLeft:'10px',
                  textTransform:'capitalize'
                }}>broadcast</Typography>
              </Grid>
              <Grid item xs={6} display={'flex'} alignItems={'center'} sx={{marginBottom:'25px',cursor:'pointer'}} onClick={() => setView('friends')}>
                
                <Box component={'img'} src={TagFriendIcon}/>
                <Typography sx={{
                  color:'#1E293B',
                  fontWeight:'600',
                  fontFamily:'Plus Jakarta Sans',
                  fontSize:'14px',
                  marginLeft:'10px',
                  textTransform:'capitalize'
                }}>Mention </Typography>
              </Grid>
              <Grid item xs={6} display={'flex'} alignItems={'center'} sx={{marginBottom:'25px'}}>
                
                <Box component={'img'} src={PullIcon}/>
                <Typography sx={{
                  color:'#1E293B',
                  fontWeight:'600',
                  fontFamily:'Plus Jakarta Sans',
                  fontSize:'14px',
                  marginLeft:'10px',
                  textTransform:'capitalize'
                }}>Poll</Typography>
              </Grid>
              

            </Grid>
            

            
          
            
            </DialogContent>
          </Box>
        )}
        {/* feelings view */}
        {view === 'feelings' && ( 
          <Box>
              <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                color:'#1E293B',
                fontSize:'36px',
                letterSpacing:'-1.4%',
                borderBottom:'1px solid #D4D4D8'

              }}
            >
              what do you fell
            
              <IconButton onClick={() => setView('add-post')}  sx={{
                backgroundColor:'#E5E5E5',
                color:'#1E1E1E'
              }}>
                  <ArrowBackIcon color='#1E1E1E'/>
              </IconButton>
            </DialogTitle>
            <FeelingsView />
          </Box>
          
        )}

        {/* location view */}
        {view === 'locations' && ( 
          <Box>
              <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                color:'#1E293B',
                fontSize:'36px',
                letterSpacing:'-1.4%',
                borderBottom:'1px solid #D4D4D8'

              }}
            >
              Search for a location
            
              <IconButton onClick={() => setView('add-post')}  sx={{
                backgroundColor:'#E5E5E5',
                color:'#1E1E1E'
              }}>
                  <ArrowBackIcon color='#1E1E1E'/>
              </IconButton>
            </DialogTitle>
            <LocationsView />
          </Box>
          
        )}

        {/* friends view */}
        {view === 'friends' && ( 
          <Box>
              <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                color:'#1E293B',
                fontSize:'36px',
                letterSpacing:'-1.4%',
                borderBottom:'1px solid #D4D4D8'

              }}
            >
              mention people
            
              <IconButton onClick={() => setView('add-post')}  sx={{
                backgroundColor:'#E5E5E5',
                color:'#1E1E1E'
              }}>
                  <ArrowBackIcon color='#1E1E1E'/>
              </IconButton>
            </DialogTitle>
            <FriendsView />
          </Box>
          
        )}
         {/* friends view */}
        {view === 'privacy' && ( 
          <Box>
              <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                color:'#1E293B',
                fontSize:'36px',
                letterSpacing:'-1.4%',
                borderBottom:'1px solid #D4D4D8'

              }}
            >
              Post audience
            
              <IconButton onClick={() => setView('add-post')}  sx={{
                backgroundColor:'#E5E5E5',
                color:'#1E1E1E'
              }}>
                  <ArrowBackIcon color='#1E1E1E'/>
              </IconButton>
            </DialogTitle>
            <PostAudiencePanel />
          </Box>
          
        )}



      </Dialog>
    </>
  );
}
