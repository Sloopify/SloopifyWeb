import React, { useState, useEffect,useRef } from 'react';
import { useUser } from '../../../context/UserContext';
import API from '../../../axios/axios';
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
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Switch,Typography, Avatar,Badge,
  Checkbox,
  FormControlLabel,

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
import ArrowContinue from '../../../assets/Home/icons/arrow-continue.png';

import  { audienceOptions } from '../../../data/audienceData';
import { margin } from '@mui/system';


// Api
const CREATE_POST_URL='/api/v1/post/create-post';


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    borderRadius: '50%',
    height: 10,
    minWidth: 10,
    margin:'0px 5px'
  },
}));


const IOSSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#14B8A6', // Active color
        opacity: 1,
        border: 0,
      },
    },
    '&.Mui-disabled': {
      '& + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E2E8F0', // Inactive color
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#fff',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#E2E8F0',
    borderRadius: '10px',
    '&:hover': {
      background: '#E2E8F0',
    }
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#E2E8F0 #fff',
};


export default function AddPostField() {
  const { userData } = useUser();
  const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim();
  const avatarUserUrl =  `${userData?.profileImage || ''}`;
  const activeStatus = `${userData?.active || ''}`;
  const [postContent, setPostContent] = useState('');
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState('post');
  const [isTemporary, setIsTemporary] = useState(false);


  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [selectedActivity, setSelectedActivities] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [audience, setAudience] = useState('public');
  const [specificFriends, setSpecificFriends] = useState([]);
  const [exceptFriends, setExceptFriends] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref foe Editor
  const editorRef = useRef(null);


  // feelings views
  const [feelingsPostType, setFeelingsPostType] = useState('feelings');
  const handleFeelingPostTypeChange = (newType) => {
    setFeelingsPostType(newType);
  };

  const getDialogTitle = () => {
    return feelingsPostType === 'feelings' ? 'What do you fell' : 'What do you do';
  };

  const [editorData, setEditorData] = useState(() => {
  const saved = JSON.parse(localStorage.getItem('editorState') || '{}');
  return {
    content: saved.content || '',
    bgColor: saved.bgColor || '#fff',
    bgGradient: saved.bgGradient || null,
    bgImage: saved.bgImage || null,
    hasBackgroundColor: saved.hasBackgroundColor ?? false,
    hasBackgroundImage: saved.hasBackgroundImage ?? false,
    textProperties: saved.textProperties || { color: '#475569', bold: false, italic: false, underline: false },

  };
});

const [images, setImages] = useState([]);
const [imageView, setImageView] = useState(false);

  
useEffect(() => {
  localStorage.setItem('editorState', JSON.stringify(editorData));
}, [editorData]);

useEffect(() => {
  // Create a new array reference to force update
  const newMediaFiles = images.map((img, i) => ({
    file: img.file,
    type: img.type || 'image', // Fallback to 'image' if type not specified
    order: i + 1,
  }));

  setPostData(prev => {
    // Only update if there's actually a change
    if (JSON.stringify(prev.mediaFiles) !== JSON.stringify(newMediaFiles)) {
      return {
        ...prev,
        mediaFiles: newMediaFiles
      };
    }
    return prev;
  });

  console.log("Images updated:", images);
  console.log("MediaFiles updated:", newMediaFiles);
}, [images]); // This will run every time images changes


const [postData, setPostData] = useState({
    content: '',
  textProperties: {},
  gifUrl: null,
  mediaFiles: [],
  hasBackgroundColor: false,
  bgColor: [],
  hasBackgroundImage: false,
  bgImage: null,
  privacy: audience,  
  disappears24h: isTemporary  
}
);

const specificFriendsRef = useRef(specificFriends);
useEffect(() => {
  specificFriendsRef.current = specificFriends;
}, [specificFriends]);


const exceptFriendsRef = useRef(exceptFriends);
useEffect(() => {
  exceptFriendsRef.current = exceptFriends;
}, [exceptFriends]);


const handlePostDataChange = (data) => {
  setPostData((prev) => {
    const updated = {
      ...prev,
      ...data,
      privacy: data.privacy !== undefined ? data.privacy : prev.privacy,
      disappears24h: data.disappears24h !== undefined ? data.disappears24h : prev.disappears24h,
      textProperties: {
        ...prev.textProperties,
        ...(data.textProperties || {}),
        color: data?.textProperties?.color || editorData?.textProperties?.color || prev.textProperties?.color || '#475569',
      },
      mentions: {
        friends: selectedFriends.map(f => f.id),
        place: selectedLocation?.id,
        activity: selectedActivity,
      },
      specificFriends: [...specificFriends],
      exceptFriends: [...exceptFriends],
      // Ensure background flags are properly set
      hasBackgroundColor: data.hasBackgroundColor !== undefined ? data.hasBackgroundColor : prev.hasBackgroundColor,
      hasBackgroundImage: data.hasBackgroundImage !== undefined ? data.hasBackgroundImage : prev.hasBackgroundImage,
    };

    return updated;
  });
};






 const [isTemporaryDialogOpen, setIsTemporaryDialogOpen] = useState(false);

  const handleTemporaryChange = (e) => {
    const isChecked = e.target.checked;
    setIsTemporary(isChecked);
    
    if (isChecked) {
      setIsTemporaryDialogOpen(true); // Show dialog when switched ON
    }
  };

// Ads options
const [selectedAdsType, setSelectedAdsType] = useState(null); 

// Handle Ads options
const handleSelect = (option) => {
    setSelectedAdsType((prev) => (prev === option ? null : option)); 
};
  



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
// remove friends
  const handleRemove = (id) => {
    setSelectedFriends(selectedFriends.filter(friend => friend.id !== id));
  };
// select feelings
 const handleSelectFeeling = (feeling) => {
    setSelectedFeeling(feeling);
    setView('add-post'); 
 };
//  remove feelings
const handleRemoveFeeling = () => {
  setSelectedFeeling(null);
};

// select feelings
 const handleSelectActivity = (activity) => {
    setSelectedActivities(activity);
    setView('add-post'); 
 };
 //  remove feelings
const handleRemoveActivity = () => {
  setSelectedActivities(null);
};
// select location

 const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setView('add-post'); 
 };
//  remove location
const handleRemovelocation = () => {
  setSelectedLocation(null);
};
// Post Payload
const buildPostPayload = () => {
  
  console.log('🔧 postData at build time:', postData);

  const {
    content,
    textProperties,
    gifUrl,
    mediaFiles,
    bgColor,
    hasBackgroundColor,
    hasBackgroundImage,
    bgGradient,
    bgImage,
    privacy,
    disappears24h,
    mentions,
    specificFriends,
    exceptFriends,
  } = postData;

  const basePayload = {
    type: 'regular',
    content: content || '',
    text_properties: textProperties || {},
    privacy: audience,
    disappears_24h: isTemporary,
    mentions: mentions,
    ...(audience === "specific_friends" && {
      specific_friends: postData?.specificFriends?.map((f) => f.id),
    }),
    ...(audience === "friend_except" && {
      friend_except: postData?.exceptFriends?.map((f) => f.id),
    }),
  };

  if (editorData.hasBackgroundColor && editorData.bgColor) {
    return {
      ...basePayload,
      background_color: Array.isArray(editorData.bgColor) ? editorData.bgColor : [editorData.bgColor],
    };
  }
   if (editorData.hasBackgroundColor && editorData.bgGradient) {
    const matches = editorData.bgGradient.match(/#([0-9a-fA-F]{6})/g);
    const gradientColors = matches ? matches.slice(0, 2) : [];
  
    return {
      ...basePayload,
      background_color:gradientColors,
    };
  }

  if (mediaFiles?.length) {
    return {
      ...basePayload,
      media: mediaFiles.map(({ file, type, order }) => ({
        file,
        type,
        order,
      })),
    };
  }

  if (gifUrl) {
    return {
      ...basePayload,
      gif_url: gifUrl,
    };
  }

  return basePayload;
};

// Handle SUBMIT POST

const handleSubmitPost = async () => {

  setIsSubmitting(true);

  try {
    const postPayload = buildPostPayload(); 
    console.log("Post submitted successfully", postPayload);
        console.log("specificFriends:",specificFriends);
         console.log("Latest specificFriends:", specificFriendsRef.current);
 
   

   const formData = new FormData();

formData.append('type', postPayload.type);
formData.append('content', postPayload.content || '');
formData.append('privacy', postPayload.privacy);

// ✅ Send raw booleans as strings: 'true' or 'false'

// ✅ Send text_properties as a proper array if your backend expects an array of strings or objects
if (Array.isArray(postPayload.text_properties)) {
  postPayload.text_properties.forEach((item, index) => {
    formData.append(`text_properties[${index}]`, item);
  });
} else {
  // fallback if it's just one object
  formData.append('text_properties[0]', JSON.stringify(postPayload.text_properties));
}

// ✅ background_color as array items
if (Array.isArray(postPayload.background_color)) {
  postPayload.background_color.forEach((color, index) => {
    formData.append(`background_color[${index}]`, color);
  });
}

// ✅ mentions
if (postPayload.mentions) {
  formData.append('mentions', JSON.stringify(postPayload.mentions));
}

// ✅ Specific friends
if (postPayload.specific_friends) {
  postPayload.specific_friends.forEach((id, index) => {
    formData.append(`specific_friends[${index}]`, id);
  });
}

// ✅ Friend except
if (postPayload.friend_except) {
  postPayload.friend_except.forEach((id, index) => {
    formData.append(`friend_except[${index}]`, id);
  });
}

// ✅ media files
if (postPayload.media && Array.isArray(postPayload.media)) {
  postPayload.media.forEach((mediaItem, index) => {
    formData.append(`media[${index}][file]`, mediaItem.file);
    formData.append(`media[${index}][type]`, mediaItem.type);
    formData.append(`media[${index}][order]`, mediaItem.order);
  });
}


    console.log("formated data", formData);

    const token = localStorage.getItem('token'); 

    const response = await API.post(CREATE_POST_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    

    if (editorRef.current) {
  editorRef.current.commands.clearContent();
  editorRef.current.commands.setColor('#475569');
  editorRef.current.commands.unsetAllMarks?.();
  editorRef.current.commands.blur();
}

setEditorData(() => ({
  content: '',
  textProperties: {},
  bgColor: null,
  bgGradient: null,
  bgImage: null,
  hasBackgroundColor: false,
  hasBackgroundImage: false,
}));

localStorage.removeItem('editorState');
// setImages([]);
// setImageView(false);
    console.log(editorRef.current.getText());

    localStorage.removeItem('editorState');
    
    setImages([]);
    setImageView(false);

    console.log("Post submitted successfully", response.data);

    // handleClose();

  } catch (err) {
    if (err.response) {
      console.error("Post failed", err.response.data);
    } else if (err.request) {
      console.error("No response received", err.request);
    } else {
      console.error("Unexpected error", err.message);
    }
  }
  finally {
    setIsSubmitting(false);
  }
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
      <Dialog disableScrollLock  open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" PaperProps={{
        sx: {
          borderRadius: '39px',
          width:{
            md: '600px',  
            xl: '730px' 
          },
          padding:{
            xs:'15px',
            md:'19px 39px'
          },
          maxHeight: '90vh', // Limit dialog height
          display: 'flex',
          flexDirection: 'column'
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
                fontSize:{
                  xs:'20px',
                  md:'36px'
                },
                padding:{
                  xs:'10px',
                  md:'15px'
                },
                letterSpacing:'-1.4%',
                borderBottom:'1px solid #D4D4D8'

              }}
            >
              Create post....
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
              margin:'10px 0px',
              height:'600px',
              position:'relative',
              overflowY: 'auto', // Enable vertical scrolling
              ...scrollbarStyles,
      
            }}>
              <Box sx={{display:'flex', marginTop:'20px',justifyContent:'space-between'}} >
                <Box  sx={{display:'flex'}}> 
                   <Box sx={{ position: 'relative', display: 'inline-block', width: 56, height: 55  }}>
                      <Avatar 
                          src={avatarUserUrl} 
                          alt="Avatar Img"
                          sx={{ 
                          width: 56, 
                          height: 55,
                          }}
                      />
                      {activeStatus === 'active' && (
                          <Box
                          sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: 12,
                              height: 12,
                              backgroundColor: '#4CAF50', // Green color
                              borderRadius: '50%',
                              border: '2px solid white', // White border to contrast with avatar
                          }}
                          />
                      )}
                    </Box>
              
                  <Box sx={{marginLeft:'5px'}}>
                    <Typography sx={{
                      fontFamily:'Plus Jakarta Sans',
                      
                      fontSize:{
                        xs:'12px',
                        md:'16px'
                      },

                      color:'#1E293B',
                      fontWeight:'700',
                      marginLeft:'5px',
                      textTransform:'capitalize'
                    }}>{fullName ? `${fullName}` : ''}</Typography>
                    <IconButton sx={{
                      backgroundColor:'#F1F5F9',
                      padding:'5px',
                      borderRadius:'12px',
                      marginTop:'5px'

                    }} onClick={() => setView('privacy')}>
                      <Box component={'img'}      src={audienceOptions.find(opt => opt.value === audience)?.icon}  sx={{
                        width:{
                          xs:'12px',
                          md:'20px'
                        }
                      }}/>
                      <Typography sx={{
                        fontFamily:'Plus Jakarta Sans',
                      fontSize:{
                        xs:'10px',
                        md:'12px'
                      },
                      color:'#475569',
                      fontWeight:'700',
                      marginLeft:'5px',
                      lineHeight:'20px'
                      }}>{audienceOptions.find(opt => opt.value === audience)?.label}</Typography>
                      <ArrowForwardIosIcon
                      sx={{
                         width:'12px',
                         
                      fontSize:{
                        xs:'10px',
                        md:'14px'
                      },
                        marginLeft:'10px'
                        
                      }} />

                    </IconButton>
                    {/* feeling / activity  */}
                    <Typography sx={{fontFamily:'Plus Jakarta Sans',
                      color:'#475569',
                      fontSize:'14px',
                      marginTop:'10px'

                    }}>
  {/* Activity */}
  {selectedActivity && (
    <Typography 
      component="span" 
      sx={{
        fontWeight: '700',
        cursor: 'pointer',
        fontFamily:'Plus Jakarta Sans',
                      color:'#475569',
                      fontSize:'14px',
        
      }}
      onClick={() => setView('feelings')}
    >
      {selectedActivity}
    </Typography>
  )}
  
  {/* Separator between activity and feeling */}
  {selectedActivity && selectedFeeling && " & "}
  
  {/* Feeling */}
  {selectedFeeling && (
    <>
      {"feeling "}
      <Typography 
        component="span" 
        sx={{
          fontWeight: '700',
          cursor: 'pointer',
         fontFamily:'Plus Jakarta Sans',
                      color:'#475569',
                      fontSize:'14px',
        }}
        onClick={() => setView('feelings')}
      >
        {selectedFeeling.name}
      </Typography>
    </>
  )}
  
  {/* Friends */}
  {selectedFriends?.length > 0 && (
    <>
      {" with "}
      <Typography 
        component="span" 
        sx={{
          fontWeight: '700',
          cursor: 'pointer',
          fontFamily:'Plus Jakarta Sans',
                      color:'#475569',
                      fontSize:'14px',
        }}
        onClick={() => setView('friends')}
      >
        {selectedFriends
          .slice(0, 3)
          .map((friend) => friend.name)
          .join(", ")}
        {selectedFriends.length > 3 &&
          ` & ${selectedFriends.length - 3} others`}
      </Typography>
    </>
  )}
  
  {/* Location */}
  {selectedLocation && (
    <>
      {" in "}
      <Typography 
        component="span" 
        sx={{
          fontWeight: '700',
          cursor: 'pointer',
         fontFamily:'Plus Jakarta Sans',
                      color:'#475569',
                      fontSize:'14px',
        }}
        onClick={() => setView('locations')}
      >
        {selectedLocation.name}
      </Typography>
    </>
  )}
</Typography>



                  </Box>
                </Box>
                
                  <Box display="flex" justifyContent="flex-end" alignItems="top" sx={{with:'100%'} }>
                    <Typography sx={{
                      fontFamily:'Plus Jakarta Sans',
                      fontWeight:'600',
                       
                      fontSize:{
                        xs:'12px',
                        md:'14px'
                      },
                      color:'#1E293B',
                      margin:'0px 10px'
                    }}>Temporary Post</Typography>
                    <IOSSwitch 
                      checked={isTemporary}
                      onChange={handleTemporaryChange}
                    />

                  </Box>
                  {/* Temporary Dialog */}
                    <Dialog 
                      open={isTemporaryDialogOpen} 
                      onClose={() => setIsTemporaryDialogOpen(false)}
                      maxWidth="md"
                      sx={{
                         cursor: 'pointer',
                          boxShadow: 'none',
                          '& .MuiPaper-root': {
                            width:'456px',
                            border: '1px solid #E2E8F0',
                            padding:{
                              xs:'15px',
                              md: '40px 60px'},
                            borderRadius: '39px'
                          },
                      }}
                    >
                      <DialogTitle sx={{
                        fontFamily:'Plus Jakarta Sans',
                        fontSize:{ 
                          xs:'20px',
                          md:'36px'},
                        fontWeight:'800',
                        lineHeight:'44px',
                        color:'rgba(30, 41, 59, 1)'
                      }}>Temporary Post
                      
                      <IconButton onClick={() => {
                          setIsTemporaryDialogOpen(false);
                          setIsTemporary(false); // Turn switch back off if canceled
                              }} size="small" sx={{
                              backgroundColor:'#F5F5F5',
                              color:'#64748B',
                              position:'absolute',
                              right:'25px'

                            }}>
                         <CloseIcon />
                      </IconButton></DialogTitle>
                      <DialogContent>
                        <Typography sx={{
                          fontFamily:'Plus Jakarta Sans',
                          fontSize:{
                            xs:'14px',
                            md:'20px'},
                          fontWeight:'400',
                          lineHeight:{
                            xs:'30px',
                            md:'44px'},
                          color:'#475569'
                        }}>
                          Disappears automatically after 24 hours
                        </Typography>
                        <Box sx={{
                          border:'1px solid #E5E5E5',
                          padding:'12px 20px',
                          borderRadius:'12px'
                        }}>
                          <Typography sx={{
                             fontFamily:'Plus Jakarta Sans',
                            fontSize:{
                              xs:'12px',
                              md:'18px'},
                            fontWeight:'600',
                            lineHeight:'24px',
                            color:'#1E293B',
                            marginBottom:'15px'
                          }}>One-time View Only</Typography>
                          <Typography sx={{
                             fontFamily:'Plus Jakarta Sans',
                           fontSize:{
                              xs:'12px',
                              md:'18px'},
                            fontWeight:'600',
                            lineHeight:'24px',
                            color:'#1E293B',
                             marginBottom:'15px'
                          }}>Enable Screenshot Blocking</Typography>
                          <Typography sx={{
                             fontFamily:'Plus Jakarta Sans',
                            fontSize:{
                              xs:'12px',
                              md:'18px'},
                            fontWeight:'600',
                            lineHeight:'24px',
                            color:'#1E293B'
                          }}>Enable Screenshot Notifications</Typography>
                        </Box>
                      </DialogContent>
                      <DialogActions>
                      
                        <Button 
                          onClick={() => setIsTemporaryDialogOpen(false)} 
                           sx={{ 
                              fontFamily:'Plus Jakarta Sans',
                                fontSize:{
                                xs:'12px',
                                md:'14px'},
                                fontWeight:'700',
                                lineHeight:'20px',
                                color:'#fff',
                                padding:'6px 12px',
                                border:'1px solid rgba(20, 184, 166, 1)',
                                borderRadius:'12px',
                                backgroundColor:'rgba(20, 184, 166, 1)'
                            }}
                        >
                          Confirm
                        </Button>
                      </DialogActions>
                    </Dialog>
                              


              </Box>
              
            {/* <Typography sx={{
              fontFamily:'Plus Jakarta Sans',
              color:'400',
              fontSize:'20px',
            marginTop:'30px'
            }}>Please select one only.</Typography> */}

            {/* <ToggleButtonGroup
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
            </ToggleButtonGroup> */}
            {/* Add post view */}
            {/* {postType === 'post' && <AddPost handleRemoveFeeling={handleRemoveFeeling} selectedFeeling={selectedFeeling}  selectedFriends={selectedFriends}  handleRemove={handleRemove}  setView={setView} 
              selectedLocation={selectedLocation} handleRemovelocation={handleRemovelocation} selectedActivity={selectedActivity} handleRemoveActivity={handleRemoveActivity} handleSelectActivity={handleSelectActivity} handleSubmitPost={handleSubmitPost}  onPostDataChange={handlePostDataChange}   isSubmitting={isSubmitting}
              editorData={editorData} setEditorData={setEditorData } images={images} setImages={setImages} imageView={imageView} setImageView={setImageView} postData={postData}  editorRef={editorRef}
              />} */}

            {/* Add Adds view */}
            {/* {postType === 'advertising' && (
              <Box>
                   <Typography sx={{
                    fontFamily:'Plus Jakarta Sans',
                    fontSize:'20px',
                    fontWeight:'400',
                    color:'#475569',
                    marginTop:'40px',
                    display:'block',
                    width:'100%'
                  }}>Please select one answer only.</Typography>
                <Box sx={{
                  padding:'20px 10px',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'space-between',
                
                }}>

               
                
                  {['Free', 'paid', 'Appointment Booking Ad'].map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={selectedAdsType === option}
                          onChange={() => handleSelect(option)}
                          sx={{
                              borderRadius:'3px',
                              color: '#14B8A6',
                              '&.Mui-checked': {
                                color: '#14B8A6',
                              },
                          }}  
                        />
                      }
                      label={option}
                  
                    />
                  ))}
                </Box>
                <Button sx={{
                   fontFamily:'Plus Jakarta Sans',
                    fontSize:'14px',
                    fontWeight:'700',
                    color:'#fff',
                    backgroundColor:'#14B8A6',
                    padding:'10px 16px',
                    borderRadius:'12px',
                    display:'block',
                    marginLeft:'auto',
                    marginRight:'0px'
                }}>Continue
                  <Box component='img'
                  sx={{
                    width:'8px',
                    marginLeft:'15px'
                  }}
                  src={ArrowContinue}/> 

                  
                </Button>
              </Box>
              
            )} */}
            <AddPost handleRemoveFeeling={handleRemoveFeeling} selectedFeeling={selectedFeeling}  selectedFriends={selectedFriends}  handleRemove={handleRemove}  setView={setView} 
              selectedLocation={selectedLocation} handleRemovelocation={handleRemovelocation} selectedActivity={selectedActivity} handleRemoveActivity={handleRemoveActivity} handleSelectActivity={handleSelectActivity} handleSubmitPost={handleSubmitPost}  onPostDataChange={handlePostDataChange}   isSubmitting={isSubmitting}
              editorData={editorData} setEditorData={setEditorData } images={images} setImages={setImages} imageView={imageView} setImageView={setImageView} postData={postData} setPostData={setPostData}  editorRef={editorRef}
              />
            
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
               
                fontSize:{
                  xs:'12px',
                  md:'36px'
                },
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
                 fontSize:{
                    xs:'20px',
                   md:'36px'},
                letterSpacing:'-1.4%',
                borderBottom:'1px solid #D4D4D8'

              }}
            >
             {getDialogTitle()}
            
              <IconButton onClick={() => setView('add-post')}  sx={{
                backgroundColor:'#E5E5E5',
                color:'#1E1E1E'
              }}>
                  <ArrowBackIcon color='#1E1E1E'/>
              </IconButton>
            </DialogTitle>
            <FeelingsView  onSelectFeeling={handleSelectFeeling} onSelectActivity={handleSelectActivity} postType={feelingsPostType} setPostType={setFeelingsPostType}
            onPostTypeChange={handleFeelingPostTypeChange} />
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
                 fontSize:{
                    xs:'20px',
                   md:'36px'},
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
            <LocationsView onSelectLoocation={handleSelectLocation} />
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
                 fontSize:{
                    xs:'20px',
                   md:'36px'},
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
            <FriendsView selected={selectedFriends} setSelected={setSelectedFriends} handleRemove={handleRemove}/>
          </Box>
          
        )}
         {/* Audience view */}
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
                fontSize:{
                    xs:'20px',
                   md:'36px'},
                letterSpacing:'-1.4%',
                borderBottom:'1px solid #D4D4D8',
                padding:{
                  sx:'10px',
                  md:'15px'
                }

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
            <PostAudiencePanel setAudience={setAudience}  audience={audience} specificFriends={specificFriends} setSpecificFriends={setSpecificFriends} exceptFriends={exceptFriends} setExceptFriends={setExceptFriends} />
          </Box>
          
        )}


        <DialogActions>
           
          
        </DialogActions>

      </Dialog>
    </>
  );
}
