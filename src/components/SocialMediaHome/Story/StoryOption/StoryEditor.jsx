import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Typography, IconButton, Stack, Popover, Button ,Dialog,
  DialogTitle,
  DialogContent,
DialogActions} from '@mui/material';
import { motion } from 'framer-motion';
import { useUser } from '../../../../context/UserContext';
import { Box, Grid } from '@mui/joy';
import { audienceOptions } from '../../../../data/audienceData';
// Api
import API from '../../../../axios/axios';
// form data
import { flattenObjectToFormData } from '../../../../utils/flattenObjectToFormData';
// assests
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import EastTwoToneIcon from '@mui/icons-material/EastTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import CropIcon from '../../../../assets/Home/icons/Crop.png';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import BarChartIcon from '@mui/icons-material/BarChart';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';


// Option Dialog
import StoryOptionDialog from './StoryOptionDialog';
// audience 
import PostAudiencePanel from '../../AddPostField/PostOptions/PostAudienceView';
// feelings
import FeelingsStoryOption from './stickerOption/StickerDialogOption/FeelingsOptions';
// location
import LocationsView from '../../AddPostField/PostOptions/LocationsView';
// friends
import FriendsView from '../../AddPostField/PostOptions/FriendsView';
// audio
import AudioStoryOption from './stickerOption/StickerDialogOption/AudioOptions';
// video

import VideoTrimmer from './VideoTrimmer';
// TipTap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import Italic from '@tiptap/extension-italic';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Extension } from '@tiptap/core';
import { ChromePicker } from 'react-color';
// stickers
import TimeSticker from './stickerOption/TimeSticker';
import TemperatureSticker from './stickerOption/TemperatureSticker';
import FeelingSticker from './stickerOption/FeelingSticker';
import LocationSticker from './stickerOption/LocationSticker';
import FriendSticker from './stickerOption/FriendSticker';
import PollSticker from './stickerOption/PollSticker';
import QuestionSticker from './stickerOption/QuestionSticker';
// Error Message
import AlertMessage from '../../../Alert/alertMessage';
// sticker theme
import { STICKER_THEMES } from '../../../../config/stickerThemes';


import {
    BoltOutlined,
  BuildOutlined,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Link as LinkIcon,
} from '@mui/icons-material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import DrawTwoToneIcon from '@mui/icons-material/DrawTwoTone';

// Create Story Api
const Create_Story_API = '/api/v1/stories/create-story'; 




const FontFamily = Extension.create({
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {};
              }
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontFamily: fontFamily => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily })
          .run();
      },
      unsetFontFamily: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily: null })
          .removeAllEmptyTextStyle()
          .run();
      },
    };
  },
});


const MAX_CHARS = 300;

// scrollbar css
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


const StoryEditor = ({storyaudience, setStoryAudience, storyType, imageBackground, imageFile, videoBackground, videoFile, setStoryType, setstoryDialogOpen, showConfirmation, setShowConfirmation,
  editorContent, setEditorContent, selectedFontFamily, setSelectedFontFamily, previewBackgroundOptions, previewBackground, setPreviewBackground, 
  showTimeSticker, setShowTimeSticker, showTemperatureSticker, setShowTemperatureSticker, showFeelingSticker , setShowFeelingSticker, tagFriendsStory, setTagFriendsStory,
  showLocationSticker , setShowLocationSticker, selectedStoryAudio, setSelectedStoryAudio, showPollSticker , setShowPollSticker, showQuestionSticker , setShowQuestionSticker
}) => {
    const { userData } = useUser();
    const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim();
    const userName = [userData?.firstName, userData?.lastName].join(' ');
    const avatarUserUrl =  `${userData?.profileImage || ''}`;
    const activeStatus = `${userData?.active || ''}`;

    // loading
    const [sharingLoading, setSharingLoading] = useState(false);
    // Errors
    const [error, setError] = useState('');
    // success
    const [success, setSuccess] = useState('');
    // audience
    const [isAudienceDialogOpen, setIsAudienceDialogOpen] = useState(false);
    const [specificFriends, setSpecificFriends] = useState([]);
    const [exceptFriends, setExceptFriends] = useState([]);
    // editor
    // color picker
   // Color picker state
    const [colorAnchorEl, setColorAnchorEl] = useState(null);
    const [tempColor, setTempColor] = useState('#000');
    const [appliedColor, setAppliedColor] = useState('#000');
    const [savedColors, setSavedColors] = useState([]);
    const [charCount, setCharCount] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [stickerExpanded, setStickerExpanded] = useState(false);
    // story sticker
    const previewRef = useRef(null);

      // time sticker

      const [currentTime, setCurrentTime] = useState('');
      const [themeIndex, setThemeIndex] = useState(0);
      const [timeStickerPosition, setTimeStickerPosition] = useState({ x: 30, y: 10 });
      const [timeStickersize, setTimeStickersize] = useState(null);
  

      // Temp sticker
      const [tempThemeIndex, setTempThemeIndex] = useState(0);
      const [tempStickerPosition, setTempStickerPosition] = useState({ x: 40, y: 20 });
      const [tempStickersize, setTempStickersize] = useState(null);
      const [temperature, setTemperature] = useState('--°C');
      const [weatherDetails, setWeatherDetails] = useState({
        weather_code: '',
        code: null,
        isDay: null,
      });

      // feeling sticker
      const [isFeelingsDialogOpen, setIsFeelingsDialogOpen] = useState(false);
      const [feelingStickerIndex, setFeelingStickerIndex] = useState(0);
      const [feelingStickerPosition, setFeelingStickerPosition] = useState({ x: 20, y: 70 });
      const [feelingStickersize, setFeelingStickersize] = useState(null);
      const [selectedStoryFeeling, setSelectedStoryFeeling] = useState(null);


      // location sticker
      const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
      const [selectedLocationStory, setSelectedLocationStory] = useState(null);
      const [locationStickerIndex, setLocationStickerIndex] = useState(0);
      const [locationStickerPosition, setLocationStickerPosition] = useState({ x: 20, y: 30 });
      const [locationStickersize, setLocationStickersize] = useState(null);

      // audio sticker
      const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
      const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
      const audioRef = useRef(null);
      const [progress, setProgress] = useState(0);



      // tag sticker
      const [isFriendsDialogOpen, setisFriendsDialogOpen] = useState(false);
      // const [tagStickerIndex, setTagStickerIndex] = useState(0);
      // const [tagStickerPosition, setTagStickerPosition] = useState({ x: 20, y: 30 });
      // const [tagStickersize, setTagStickersize] = useState(null);
      const [friendStickers, setFriendStickers] = useState({});
      const defaultThemeIndex = 0;
      
      // poll sticker 
      const [pollStickerPosition, setPollStickerPosition] = useState({ x: 50, y: 50 });
      const [pollStickerthemeIndex, setPollStickerthemeIndex] = useState(0);
      const [votes, setVotes] = useState({});
      const [ question, setQuestion] = useState("What's your favorite?");
      const [ options, setOptions] = useState(['Option 1', 'Option 2']);

      // question sticker
      const [question2, setQuestion2] = useState('');
      const [answers, setAnswers] = useState(['', '']); // Start with 2
      const [questionThemeIndex, setQuestionThemeIndex] = useState(0);
      const [questionPosition, setQuestionPosition] = useState({ x: 50, y: 50 });

    
 



     useEffect(() => {
      const newStickers = {};
      tagFriendsStory.forEach((friend, index) => {
        if (!friendStickers[friend.id]) {
          newStickers[friend.id] = {
            themeIndex: defaultThemeIndex,
            position: {
              x: 10 + (index * 5) % 80,
              y: 10 + (index * 3) % 80
            },
            size: null
          };
        }
      });
      setFriendStickers(prev => ({ ...prev, ...newStickers }));
    }, [tagFriendsStory]);

      // text on bg image
      const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
      const textStickerRef = useRef(null);
      const [showTextOnBg , setshowTextOnBg ] = useState(false);

      // video
      const videoRef = useRef(null);
      const [videoStart, setVideoStart] = useState(0);
      const [videoEnd, setVideoEnd] = useState(0);
      const [showTrimmer, setShowTrimmer] = useState(false);
      const [isPlaying, setIsPlaying] = useState(false);

      useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime = videoStart; // ✅ only set time
        // Do NOT auto play here
      }, [videoStart, videoEnd]);


      const togglePlayPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
          // If the current time is outside the trimmed range, reset to start
          if (video.currentTime < videoStart || video.currentTime >= videoEnd) {
            video.currentTime = videoStart;
          }
          video.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.warn('Play failed:', err));
        } else {
          video.pause();
          setIsPlaying(false);
        }
      };




    
        // current time
        useEffect(() => {
          const interval = setInterval(() => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            setCurrentTime(formattedTime);
          }, 1000);
      
          return () => clearInterval(interval);
        }, []);

        // current temp
          useEffect(() => {
          const fetchTemperature = async () => {
            try {
              const apiKey = '460b31eea31c4718939200634251307'; // ⏪ Replace this!
              const city = 'Damascus';
              const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
        
              const response = await fetch(url);
              const data = await response.json();
        
              if (data && data.current) {
                const temp = data.current.temp_c;
                const weatherCodeText = data.current.condition.text;
                const weatherCodeNumber = data.current.condition.code;
                const isDay = data.current.is_day === 1;
                setTemperature(`${temp.toFixed(1)}°C`);
                setWeatherDetails({
                  weather_code: weatherCodeText.toLowerCase(), // if you want it lower
                  code: weatherCodeNumber,
                  isDay: isDay,
                });
              } else {
                console.error('Unexpected API response:', data);
              }
            } catch (error) {
              console.error('Failed to fetch temperature:', error);
            }
          };
        
          fetchTemperature();
          const interval = setInterval(fetchTemperature, 60000); // update every minute
          return () => clearInterval(interval);
        }, []);

        // select feelings
        const handleSelectFeeling = (feeling) => {
            setSelectedStoryFeeling(feeling);
            setIsFeelingsDialogOpen(false); 
            setShowFeelingSticker(true);
            setFeelingStickerPosition({ x: 20, y: 70 })

        };

         // select audio
        const handleSelectAudio = (audio) => {
          if (selectedStoryAudio && selectedStoryAudio.id === audio.id) {
            // If already selected, unselect
            setSelectedStoryAudio(null);
          } else {
            // If not selected, select it
            setSelectedStoryAudio(audio);
        
          }
          
          console.log('audio', audio);
        };

        const handleCloseAudioDialog = () => {
          // Pause any playing audio
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
          setCurrentlyPlaying(null);
          setProgress(0);

          // Close the dialog
          setIsAudioDialogOpen(false);
        };


        // select location
         const handleSelectLocation = (location) => {
            setSelectedLocationStory(location);
            setShowLocationSticker(true);
            setIsLocationDialogOpen(false); 
         };

         // remove friends
         const handleRemove = (friendId) => {
          setTagFriendsStory(prev => prev.filter(f => f.id !== friendId));
          setFriendStickers(prev => {
            const newStickers = { ...prev };
            delete newStickers[friendId];
            return newStickers;
          });
        };
        
        // remove text on bg image
        const handleRemoveTextSticker = () => {
          setshowTextOnBg(false);
          editor?.commands.clearContent(); 
        };




    const fontFamilies = {
    english: [
        'Plus Jakarta Sans',
        'Plaster',
        'Gochi Hand',
        'Pinyon Script',
        'Oxanium',
        'Roboto',
        'Poltawski Nowy',
        'Playball'
    ],
    arabic:[
        'Rubik',
        'Reem Kufi Fun',
        'Playpen Sans Arabic',
        'Oi',
        'Marhey',
        'Lalezar',
        'Cairo',
        'Beiruti'
    ]

    };


   


  function extractColorsFromGradient(gradient) {
  // Matches all #hex colors in the string
  const matches = gradient.match(/#[0-9A-Fa-f]{6}/g);
  return matches || [];
}





const parsedColors = extractColorsFromGradient(previewBackground);




    const openColorPicker = Boolean(colorAnchorEl);

    const handleColorIconClick = (event) => {
    setColorAnchorEl(event.currentTarget);
    };

    const handleColorPickerClose = () => {
    setColorAnchorEl(null);
    };
    const applyTextColorToAll = (color) => {
    if (!editor) return;

    const { state, view } = editor;
    const { doc, tr } = state;

    doc.descendants((node, pos) => {
        if (node.isText && node.text && node.text.trim()) {
        const oldMarks = node.marks.find(mark => mark.type.name === 'textStyle');
        const oldFontFamily = oldMarks?.attrs.fontFamily || null;

        tr.addMark(
            pos,
            pos + node.nodeSize,
            state.schema.marks.textStyle.create({
            color,
            fontFamily: oldFontFamily,
            })
        );
        }
    });

    if (tr.docChanged) {
        view.dispatch(tr);
    }
    };


    const handleColorChange = (color) => {
    const hex = color.hex;
    setTempColor(hex);
    setAppliedColor(hex);
    applyTextColorToAll(hex);
    };



    const handleColorApply = () => {
    if (!savedColors.includes(tempColor)) {
        setSavedColors((prev) => [...prev, tempColor]);
    }
    handleColorPickerClose();
    };

    const handleUseSavedColor = (color) => {
    setAppliedColor(color);
    editor.chain().focus().setColor(color).run();
    };
  


   const applyFontFamilyToAll = (fontFamily) => {
  if (!editor) return;

  const { state, view } = editor;
  const { doc, tr } = state;

  doc.descendants((node, pos) => {
    if (node.isText && node.text && node.text.trim()) {
      const oldMarks = node.marks.find(mark => mark.type.name === 'textStyle');
      const oldColor = oldMarks?.attrs.color || null;

      tr.addMark(
        pos,
        pos + node.nodeSize,
        state.schema.marks.textStyle.create({
          color: oldColor,
          fontFamily,
        })
      );
    }
  });

  if (tr.docChanged) {
    view.dispatch(tr);
  }
};


    // handle FontFamily Chang
    const handleFontFamilyChange = (event) => {
    const selected = event.target.value;
    setSelectedFontFamily(selected);
    applyFontFamilyToAll(selected);
    };


  const [textStyles, setTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left',
  });


    // Setup TipTap editor
    const editor = useEditor({
        extensions: [
        StarterKit,
        FontFamily,
        Bold,
        Italic,
        Underline,
        TextStyle,
        Color,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
          const text = editor.state.doc.textContent.trim();
          setEditorContent(editor.getHTML());

          if (text.length > MAX_CHARS) {
            // Trim content to max length
            editor.commands.setContent(text.slice(0, MAX_CHARS));
            setCharCount(MAX_CHARS);
          } else {
            setCharCount(text.length);
          }

          // ✅ Show the text sticker if there’s text
          if (text.length > 0) {
            setshowTextOnBg(true);
          } else {
            setshowTextOnBg(false); // optional — auto-hide if empty
          }

          const isBold = editor.isActive('bold');
        const isItalic = editor.isActive('italic');
        const isUnderline = editor.isActive('underline');

        const alignment = editor.getAttributes('paragraph').textAlign || 'left';

          setTextStyles({
          bold: isBold,
          italic: isItalic,
          underline: isUnderline,
          alignment: alignment,
        });


        },

    });


//     useEffect(() => {
//     console.log('Story Audience changed to:', storyaudience);
//   }, [storyaudience]);

const handleShare  = async (e) => {
  // Build your API body
 const payload = {
  privacy: storyaudience,
  is_video_muted: 0,
  specific_friends: specificFriends.map(f => f.id),
  friend_except: exceptFriends.map(f => f.id),
  text_element: {
    text: editorContent,
    x: textPosition.x,
    y: textPosition.y,
    text_properties: {
      color: appliedColor,
      font_type: selectedFontFamily,
      bold: textStyles.bold ? 1 : 0,
      italic: textStyles.italic ? 1 : 0,
      Underline: textStyles.underline ? 1 : 0,
    },
  },
  background_color: parsedColors,
  mentions_elements: tagFriendsStory.map(friend => ({
    friend_id: friend.id,
    friend_name: `${friend.first_name} ${friend.last_name}`,
    x: friendStickers[friend.id]?.position?.x || 50,
    y: friendStickers[friend.id]?.position?.y || 50,
    theme: STICKER_THEMES[friendStickers[friend.id]?.themeIndex || 0]?.name || 'theme_1',
  })),
  clock_element: showTimeSticker
    ? {
        clock: currentTime,
        x: timeStickerPosition.x,
        y: timeStickerPosition.y,
        theme: STICKER_THEMES[themeIndex]?.name || 'theme_1',
      }
    : null,
  temperature_element: showTemperatureSticker
    ? {
        clock: temperature,
        x: tempStickerPosition.x,
        y: tempStickerPosition.y,
        theme: STICKER_THEMES[tempThemeIndex]?.name || 'theme_1',
        isDay:weatherDetails.isDay ?  1 : 0,
        code:weatherDetails.code,
      }
    : null,
  feeling_element: showFeelingSticker  ? {
        feeling_id: selectedStoryFeeling.id,
        feeling_name:selectedStoryFeeling.name,
        x: feelingStickerPosition.x,
        y: feelingStickerPosition.y,
        theme: STICKER_THEMES[feelingStickerIndex]?.name || 'theme_1',
      }
    : null,
   location_element: showLocationSticker  ? {
        id: selectedLocationStory.id,
        country_name:selectedLocationStory.country,
        city_name:selectedLocationStory.city,
        x: locationStickerPosition.x,
        y: locationStickerPosition.y,
        theme: STICKER_THEMES[locationStickerIndex]?.name || 'theme_1',
      }
    : null,
   audio_element: selectedStoryAudio  ? {
        audio_id: selectedStoryAudio.id,
        audio_name:selectedStoryAudio.name,
        x: '200',
        y: '200',
        theme:  'theme_1',
      }
    : null,
  media: [],
};

if (imageFile) {
  payload.media.push({
    file: imageFile,
    order: 1,
  });
}
if (videoFile) {
  payload.media.push({
    file: videoFile,
    order: 2,
  });
}
const formData = flattenObjectToFormData(payload);

// ✅ Debug it
for (const [key, value] of formData.entries()) {
  console.log(key, value);
}

  const resetForm = () => {
  // Reset text content
  setEditorContent('');
  if (editor) editor.commands.clearContent();
  setSelectedFontFamily('Plus Jakarta Sans')

  // Reset stickers
  setShowTimeSticker(false);
  setShowTemperatureSticker(false);
  setShowFeelingSticker(false);
  setShowLocationSticker(false);

  // Reset background (if applicable)
  setPreviewBackground(previewBackgroundOptions[0].value);

  // Reset audience settings
  setStoryAudience('public'); // Default audience
  setSpecificFriends([]);
  setExceptFriends([]);

  // Reset video trimming (if applicable)
  setVideoStart(0);
  setVideoEnd(0);

  // Reset any other relevant states
  setCharCount(0);

  // set mentions
  setTagFriendsStory([]);
};

  


  // POST it:
try {
  setSharingLoading(true);
  setError('');
  setSuccess('');




  const res = await API.post(Create_Story_API, formData, {
      headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
  });
  // when success
  console.log('Response:', res.data);
    
  // set success msg
    if (res.data?.success && res.data?.message) {

      resetForm(); 
      setSuccess(res.data.message);

    }

  // reset
  setCurrentTime('');

  } catch (error) {
      console.error('API Error:', error);

  
 
    // Fallback for unexpected format
  let errorMessage = 'Something went wrong';
  
  if (error.response?.data?.errors) {
    errorMessage = Object.values(error.response.data.errors).join('\n');
  } 
  else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  }
  else if (error.message) {
    errorMessage = error.message;
  }
  
  setError(errorMessage);
  

} finally {
  setSharingLoading(false);
}
};


// track state
// Store initial state for comparison
const initialStateRef = useRef({
    storyaudience: 'public',
    editorContent: null,
    selectedFontFamily: 'Plus Jakarta Sans',
    previewBackground: null,
    showTemperatureSticker: false,
    showTimeSticker: false,
    showFeelingSticker: false,
    tagFriendsStory: null,
    showLocationSticker: false,
    selectedStoryAudio: null,
   imageBackground,
   videoBackground
   
  });

 // Check if any of the tracked states have changed from their initial values
  const hasUnsavedChanges = () => {
    const currentState = {
      storyaudience,
      editorContent: editor?.getHTML() || null,
      selectedFontFamily: editor?.getAttributes('textStyle')?.fontFamily || 'Plus Jakarta Sans',
      previewBackground,
      showTemperatureSticker,
      showTimeSticker,
      showFeelingSticker,
      tagFriendsStory,
      showLocationSticker,
      selectedStoryAudio,
      imageBackground,
      videoBackground
    };

    return Object.keys(initialStateRef.current).some(key => {
      if (key === 'imageBackground' || key === 'videoBackground') {
        return JSON.stringify(currentState[key]) !== JSON.stringify(initialStateRef.current[key]);
      }
      return currentState[key] !== initialStateRef.current[key];
    });
  };

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges()) {
      setShowConfirmation(true);
    } else {
      handleConfirmClose(true);
    }
  };

   const handleConfirmClose = (shouldClose) => {
    if (shouldClose) {
      // Reset all states to initial values if discarding
      setStoryAudience(initialStateRef.current.storyaudience);
      if (editor) editor.commands.clearContent();
      setSelectedFontFamily(initialStateRef.current.selectedFontFamily);
      setPreviewBackground(initialStateRef.current.previewBackground);
      setShowTemperatureSticker(initialStateRef.current.showTemperatureSticker);
      setShowTimeSticker(initialStateRef.current.showTimeSticker);
      setShowFeelingSticker(initialStateRef.current.showFeelingSticker);
      setTagFriendsStory(initialStateRef.current.tagFriendsStory);
      setShowLocationSticker(initialStateRef.current.showLocationSticker);
      setSelectedStoryAudio(initialStateRef.current.selectedStoryAudio);
      setStoryType(null);
      setstoryDialogOpen(false);
    }
    setShowConfirmation(false);
  };

    

    return(
        <>
        <Box>  
            {/* Story option header */}
            <Grid container>
                {/* Editor */}
                <Grid item xs={12} md={4}
                component="div"
                sx={{
                    borderRight:'1px solid #D4D4D4',
                    height:'600px',
                    overflowY:'scroll',
                    ...scrollbarStyles
                }}
                >
                {/* Editor Header */}
                <Box  sx={{
                    display:'flex',
                    justifyContent:'space-between',
                    flexDirection:'row',
                    alignItems:'flex-start',
                  
                    padding:'20px 10px 30px 10px'
                }}>
                    <Box sx={{display:'flex'}}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar 
                        src={avatarUserUrl} 
                        alt="Avatar Img"
                        sx={{ 
                        width: {
                          md:35,
                          xl:55
                        }, 
                        height:  {
                          md:35,
                          xl:55
                        }, 
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
                    <Box component="div"
                    sx={{
                        paddingLeft:'10px'
                    }}
                    >
                    <Typography
                        sx={{
                            color:'  #1E293B',
                            fontFamily:'Plus Jakarta Sans',
                            fontSize:{
                              xs:'12px',
                              md:'13px',
                              xl:'14px'},
                            fontWeight:'700',

                            textTransform:'capitalize'
                        }}
                        >{fullName ? `${fullName}` : ''}</Typography>
                    
                    <Typography
                        sx={{
                            color:'  #475569',
                            fontFamily:'Plus Jakarta Sans',
                              fontSize:{
                              xs:'11px',
                              md:'12px',
                              xl:'13px'},
                            fontWeight:'400'
                        }}
                        >{userName ? `@ ${userName}` : ''}</Typography>
                        
                    </Box>
                </Box>
                <IconButton
                 onClick={
                    () => setIsAudienceDialogOpen(true)
                 }
                  sx={{
                      backgroundColor:'#F1F5F9',
                      padding:'5px',
                      borderRadius:'12px',
                      marginTop:'5px'

                    }} >
                      <Box component={'img'}      src={audienceOptions.find(opt => opt.value === storyaudience)?.icon}  sx={{
                        width:{
                          xs:'12px',
                          md:'15px',
                          xl:'20px',
                        }
                      }}/>
                      <Typography sx={{
                        fontFamily:'Plus Jakarta Sans',
                      fontSize:{
                        xs:'10px',
                        md:'11px',
                        xl:'11px'
                      },
                      color:'#475569',
                      fontWeight:'700',
                      marginLeft:'5px',
                      lineHeight:'20px'
                      }}>{audienceOptions.find(opt => opt.value === storyaudience)?.label}</Typography>
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
                </Box>
                {/* Divider */}
                <Box
                sx={{
                    width: '90%',
                    height: '1px',
                    backgroundColor: '#CBD5E1', // light gray, pick your color
                    margin: '16px auto', // centers horizontally with margin
                }}
                />
                {/* Toolbar container */}
                <Box
                 sx={{
                    width: '100%',
                    display:'flex',
                    justifyContent:'center',
                    flexDirection:'column',
                    alignItems:'center'
                }}
                >
                    <Box sx={{border:'1px solid #E2E8F0',borderRadius:'24px',width:'90%'}}>
                        {/* Toolbar */}
                        <Box sx={{ display: 'flex', gap: '5px',borderBottom:'1px solid #E2E8F0' }}>
                            <Box sx={{padding:'10px 5px',borderRight:'1px solid #E2E8F0'}}>
                                <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
                                    <FormatBold sx={{
                                    color: editor?.isActive('bold') ? '#14b8a6' : '#475569',
                                    fontSize:{
                                      md:'14px',
                                      xl:'20px'
                                    }
                                    }}/>
                                </IconButton>
                                <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
                                    <FormatItalic  sx={{
                                    color: editor?.isActive('italic') ? '#14b8a6' : '#475569',
                                    fontSize:{
                                      md:'14px',
                                      xl:'20px'
                                    }
                                    }}/>
                                </IconButton>
                                <IconButton onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                                    <FormatUnderlined sx={{
                                    color: editor?.isActive('underline') ? '#14b8a6' : '#475569',
                                    fontSize:{
                                      md:'14px',
                                      xl:'20px'
                                    }
                                    }} />
                                </IconButton>
                                <IconButton onClick={handleColorIconClick}>
                                    <DrawTwoToneIcon sx={{ 
                                      '& path:first-of-type': {
                                        fill: appliedColor, // The base color (opaque path)
                                      },
                                      '& path:last-of-type': {
                                        fill: '#475569', // The lighter path (has opacity)
                                      },
                                      color: appliedColor, fontSize:{
                                      md:'14px',
                                      xl:'20px'
                                    } }} />
                                </IconButton>

                            </Box>
                            <Box sx={{padding:'10px 5px'}}>
                                <IconButton onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                                    <FormatAlignLeftIcon sx={{color:'#475569', fontSize:{
                                      md:'13px',
                                      xl:'20px'
                                    }}}/>
                                </IconButton>
                                <IconButton onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                                    <FormatAlignCenterIcon  sx={{color:'#475569', fontSize:{
                                      md:'13px',
                                      xl:'20px'
                                    }}}/>
                                </IconButton>
                                <IconButton onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                                    <FormatAlignRightIcon  sx={{color:'#475569', fontSize:{
                                      md:'13px',
                                      xl:'20px'
                                    }}}/>
                                </IconButton>
                            </Box>
                            
                           
                        




                        <Popover  p={2}
                        open={openColorPicker}
                        anchorEl={colorAnchorEl}
                        onClose={handleColorPickerClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        sx={{
                        // This targets the root Popover element (positioning wrapper)
                        '& .MuiPopover-paper': {  // This targets the actual paper component inside
                        padding: 2,
                        borderRadius: '8px',
                        boxShadow: 'none', // Removes shadow
                        // Additional styling if needed:
                        border: '1px solid #e0e0e0', // Optional: adds subtle border
                        backgroundColor: 'background.paper', // Ensures proper background
                        }
                    }}
                        >
                        <Box>
                            <ChromePicker
                            color={tempColor}
                            onChange={handleColorChange}
                            disableAlpha={false} // transparency enabled
                             styles={{
                                default: {
                                picker: {
                                    boxShadow: "none", // Remove box shadow
                                },
                                },
                            }}
                                />

                          

                            {/* Saved colors */}
                            {savedColors.length > 0 && (
                            <>
                            <Typography sx={{
                                fontFamily:'Plus Jakarta Sans',
                                fontSize:'14px',
                                fontWeight:'600',
                                color:'#566174',
                            }} mt={1}>Saved Colors</Typography>
                           
                            <Stack direction="row" spacing={1} mt={1}>
                                {savedColors.map((color) => (
                                <Box
                                    key={color}
                                    onClick={() => handleUseSavedColor(color)}
                                    sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    border: '1px solid #ccc',
                                    cursor: 'pointer',
                                    }}
                                />
                                ))}
                            </Stack>
                            </>
                            )}
                        </Box>
                          <Button
                            variant="contained"
                            sx={{ mt: 2, width: '100%',
                                backgroundColor:'#E6E7EA',
                                padding:'8px',
                                borderRadius:'6px',
                                color:'#354259',
                                fontFamily:'Plus Jakarta Sans',
                                fontSize:'12px',
                                boxShadow:'none'
                             }}
                            onClick={handleColorApply}
                            >
                            Done
                            </Button>
                        </Popover>




                        </Box>
                        {/* TipTap Editor */}
                        <Box sx={{ padding: '0 10px 10px' }}>
                            <EditorContent editor={editor} />
                        </Box>
                        <Box style={{ marginTop: 0,padding:10, fontFamily:'Plus Jakarta Sans',fontSize: 12, color: charCount >= MAX_CHARS ? 'red' : '#CBD5E1' }}>
                            {charCount} / {MAX_CHARS} 
                        </Box>
                        
                    </Box>
                    {/* font family dropdown */}
                    <Box sx={{ padding: '0px',margin:'20px 0px',width:'90%' }}>
                        <Typography sx={{
                            fontFamily:'Plus Jakarta Sans',
                            fontWeight:'700',
                            fontSize:{
                              md:'12px',
                              xl:'14px'},
                            lineHeight:'20px',
                            color:'#475569',
                            marginBottom:'10px'
                        }}>Font  type</Typography>
                        <select
                            value={selectedFontFamily}
                            onChange={handleFontFamilyChange}
                            style={{
                            border: '1px solid #CBD5E1',
                            borderRadius:'123px',
                            outline: 'none',
                            fontFamily: selectedFontFamily,
                            fontSize:{
                              md:'12px',
                              xl:'14px'},
                            backgroundColor: 'transparent',
                            color: '#475569',
                            width:'100%',
                            padding:'10px'
                            }}
                        >
                             <optgroup label="English Fonts">
                                {fontFamilies.english.map((font) => (
                                <option key={font} value={font} style={{ fontFamily: font }}>
                                    {font}
                                </option>
                                ))}
                            </optgroup>
                             <optgroup label="Arabic Fonts">
                                {fontFamilies.arabic.map((font) => (
                                <option key={font} value={font} style={{ fontFamily: font }}>
                                    {font}
                                </option>
                                ))}
                            </optgroup>
                        </select>
                    </Box>

                    {/* bg color */}
                   { storyType == 'text' &&
                   (
                    <Box sx={{
                      width: '90%',
                      border: '1px solid #D4D4D4',
                      borderRadius: '20px',
                    }}>
                      <Typography sx={{
                        fontFamily: 'Plus Jakarta Sans',
                        fontWeight: '700',
                        fontSize:{
                              md:'12px',
                              xl:'14px'
                        },
                        lineHeight: '20px',
                        color: '#475569',
                        marginBottom: '10px',
                        padding: '10px'
                      }}>
                        Background
                      </Typography>

                      {/* CONTAINER WITH COLLAPSIBLE HEIGHT */}
                      <Box
                        sx={{
                          overflow: 'hidden',
                          maxHeight: expanded ? 'none' : '90px', // adjust height for 2 rows
                          transition: 'max-height 0.3s ease',
                        }}
                      >
                        <Grid container spacing={1} sx={{ mt: 0, padding: '10px' }}>
                          {previewBackgroundOptions.map((bg, index) => (
                            <Grid item xs={2} key={index}> {/* xs=2 → 6 columns */}
                              <Box
                                onClick={() => setPreviewBackground(bg.value)}
                                sx={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: '50%',
                                  background: bg.value,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  cursor: 'pointer',
                                  border: previewBackground === bg.value ? '2px solid #14b8a6' : '2px solid #fff',
                                  transition: 'border 0.2s ease',
                                }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      {/* SHOW MORE / LESS BUTTON */}
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          display: 'block',
                          margin: '0 auto',
                          mt: 1,
                          color:'#475569',
                          fontFamily: 'Plus Jakarta Sans',
                          fontSize: '16px',
                        }}
                        onClick={() => setExpanded(!expanded)}
                      >
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
                      </Button>
                    </Box>
                    )
                    } 

                     {/* crop button  */} 
                        {storyType == 'video' && 
                        <Button 
                         sx={{
                          width:'90%',
                          mb: 2,
                          backgroundColor: '#F8FAFC',
                          padding: '16px 24px',
                          border: '1px solid #475569',
                          borderRadius: '12px',
                          fontFamily: 'Plus Jakarta Sans',
                          fontWeight: '700',
                          fontSize:{
                              md:'14px',
                              xl:'18px'},
                          lineHeight: '24px',
                          color: '#475569',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onClick={()=> setShowTrimmer(!showTrimmer)}>
                            Crop 
                            <Box
                            component="img"
                            src={CropIcon}
                            alt="Crop Icon"
                              sx={{ marginLeft: '10px', width: 24, height: 24 }}
                            />
                        </Button>
                      }

                    {/* sticker option */}
                     <Box sx={{
                      width: '90%',
                      border: '1px solid #D4D4D4',
                      borderRadius: '20px',
                      mt:2,
                      mb:2,
                    }}>

                         <Typography sx={{
                        fontFamily: 'Plus Jakarta Sans',
                        fontWeight: '700',
                        fontSize:{
                              md:'12px',
                              xl:'14px'},
                        lineHeight: '20px',
                        color: '#475569',
                        marginBottom: '10px',
                        padding: '10px'
                      }}>
                        Sticker
                      </Typography>
                        
                        <Grid container  sx={{
                            overflow: 'hidden',
                            maxHeight: stickerExpanded ? 'none' : '50px', // adjust height for 2 rows
                            transition: 'max-height 0.3s ease',
                        }}>
                             {/* time sticker */}
                          <Grid item xs={4}>
                             <Button
                              sx={{
                                display: 'flex',
                                margin: '10px auto',
                                background:'transparent',
                                mt: 1,
                                color: showTimeSticker ? '#14b8a6' : '#475569',
                                fontFamily: 'Plus Jakarta Sans',
                                fontSize:{
                                md:'9px',
                                xl:'12px'},
                                borderRadius: '12px',
                                padding:{ 
                                  md:'8px 6px',
                                  xl:'8px 10px'
                                },
                                fontWeight:'600',
                                lineHeight:'22px',
                                textTransform: 'none',
                              }}
                              onClick={() => setShowTimeSticker(prev => !prev)}
                            >
                              {showTimeSticker ?   <>
                                <AccessTimeIcon sx={{
                                  fontSize:{
                                   md:'12px',
                                  xl:'15px'},
                                  marginRight:'5px'}}/>
                                {currentTime}


                                </> : (
                                <>
                                <AccessTimeIcon sx={{
                                   fontSize:{
                                  md:'12px',
                                  xl:'15px'},
                                  marginRight:'5px'}}/>
                                {currentTime}


                                </>
                              )}
                            </Button>
                          </Grid>
                        
                        {/* temp */}
                        <Grid item xs={4}>
                          <Button
                            sx={{
                              display: 'flex',
                              margin: '10px auto',
                              background:'transparent',
                              mt: 1,
                              color: showTemperatureSticker ? '#14b8a6' : '#475569',
                              fontFamily: 'Plus Jakarta Sans',
                               fontSize:{
                                md:'10px',
                                xl:'12px'},
                              borderRadius: '12px',
                               padding:{ 
                                  md:'8px 6px',
                                  xl:'8px 10px'
                                },
                              fontWeight:'600',
                              lineHeight:'22px',
                              textTransform: 'none',
                            }}
                            onClick={() => setShowTemperatureSticker(prev => !prev)}
                          >
                            <>
                            {weatherDetails.isDay ? (
                              <WbSunnyOutlinedIcon
                                sx={{
                                  fontSize: {
                                    md: '12px',
                                    xl: '15px'
                                  },
                                  marginRight:  '5px' 
                                }}
                              />
                            ) : (
                              <BedtimeIcon
                                sx={{
                                  fontSize: {
                                    md: '12px',
                                    xl: '15px'
                                  },
                                  marginRight:  '5px' 
                                }}
                              />
                            )}
                            {temperature}
                          </>

                          </Button>
                        </Grid>
                        
                        {/* feeling */}
                        <Grid  item xs={4}>
                          <Button
                            sx={{
                                display: 'flex',
                                margin: '10px auto',
                                background:'transparent',
                                mt: 1,
                                color: showFeelingSticker ? '#14b8a6' : '#475569',
                                fontFamily: 'Plus Jakarta Sans',
                                 fontSize:{
                                md:'10px',
                                xl:'12px'},
                                borderRadius: '12px',
                                 padding:{ 
                                  md:'8px 6px',
                                  xl:'8px 10px'
                                },
                                fontWeight:'600',
                                lineHeight:'22px',
                                textTransform: 'none',
                              }}
                            onClick={
                                  () => setIsFeelingsDialogOpen(true)
                              }
                            >
                              <SentimentSatisfiedAltIcon sx={{
                                 fontSize:{
                                   md:'12px',
                                  xl:'15px'},
                                marginRight:'5px'}}/>
                              Feelings
                            </Button>
                        </Grid>
                        
                        {/* location */}
                        <Grid item xs={4}>
                              <Button
                              sx={{
                                  display: 'flex',
                                  margin: '10px auto',
                                  background:'transparent',
                                  mt: 1,
                                  color: showLocationSticker ? '#14b8a6' : '#475569',
                                  fontFamily: 'Plus Jakarta Sans',
                                   fontSize:{
                                md:'10px',
                                xl:'12px'},
                                  borderRadius: '12px',
                                   padding:{ 
                                  md:'8px 6px',
                                  xl:'8px 10px'
                                },
                                  fontWeight:'600',
                                  lineHeight:'22px',
                                  textTransform: 'none',
                                }}
                              onClick={
                                    () => setIsLocationDialogOpen(true)
                                }
                              >
                                <PinDropOutlinedIcon sx={{
                                   fontSize:{
                                   md:'12px',
                                  xl:'15px'},
                                  marginRight:'5px'}}/>
                                Location
                              </Button>
                        </Grid>

                        {/* tag friends */}
                        <Grid item xs={4}>
                              <Button
                              sx={{
                                  display: 'flex',
                                  margin: '10px auto',
                                  background:'transparent',
                                  mt: 1,
                                  color: tagFriendsStory.length > 0 ? '#14b8a6' : '#475569',
                                  fontFamily: 'Plus Jakarta Sans',
                                   fontSize:{
                                md:'10px',
                                xl:'12px'},
                                  borderRadius: '12px',
                                   padding:{ 
                                  md:'8px 6px',
                                  xl:'8px 10px'
                                },
                                  fontWeight:'600',
                                  lineHeight:'22px',
                                  textTransform: 'none',
                                }}
                              onClick={
                                    () => setisFriendsDialogOpen(true)
                                }
                              >
                                <AlternateEmailIcon sx={{
                                   fontSize:{
                                   md:'12px',
                                  xl:'15px'},
                                  marginRight:'5px'}}/>
                                Tag
                              </Button>
                        </Grid>

                        {/* audio */}
                        <Grid item xs={4}>
                              <Button
                              sx={{
                                  display: 'flex',
                                  margin: '10px auto',
                                  background:'transparent',
                                  mt: 1,
                                  color: selectedStoryAudio ? '#14b8a6' : '#475569',
                                  fontFamily: 'Plus Jakarta Sans',
                                   fontSize:{
                                md:'10px',
                                xl:'12px'},
                                  borderRadius: '12px',
                                   padding:{ 
                                  md:'8px 6px',
                                  xl:'8px 10px'
                                },
                                  fontWeight:'600',
                                  lineHeight:'22px',
                                  textTransform: 'none',
                                }}
                              onClick={
                                    () => setIsAudioDialogOpen(true)
                                }
                              >
                                <MusicNoteOutlinedIcon sx={{
                                   fontSize:{
                                   md:'12px',
                                  xl:'15px'},
                                  marginRight:'5px'}}/>
                                Audio
                              </Button>
                        </Grid>

                           {/* Poll sticker */}
                        <Grid item xs={4}>
                             <Button
                              sx={{
                                display: 'flex',
                                margin: '10px auto',
                                background:'transparent',
                                mt: 1,
                                color: showPollSticker ? '#14b8a6' : '#475569',
                                fontFamily: 'Plus Jakarta Sans',
                                fontSize:{
                                md:'9px',
                                xl:'12px'},
                                borderRadius: '12px',
                                padding:{ 
                                  md:'8px 6px',
                                  xl:'8px 10px'
                                },
                                fontWeight:'600',
                                lineHeight:'22px',
                                textTransform: 'none',
                              }}
                              onClick={() => setShowPollSticker(prev => !prev)}
                            >
                             
                               <BarChartIcon  sx={{
                                  fontSize: {
                                    md: '12px',
                                    xl: '15px'
                                  },
                                  marginRight:  '5px' 
                                }}/> Poll 
                            </Button>
                          </Grid>

                           {/* Question sticker */}
                        <Grid item xs={4}>
                             <Button
                              sx={{
                                display: 'flex',
                                margin: '10px auto',
                                background:'transparent',
                                mt: 1,
                                color: showQuestionSticker ? '#14b8a6' : '#475569',
                                fontFamily: 'Plus Jakarta Sans',
                                fontSize:{
                                md:'9px',
                                xl:'12px'},
                                borderRadius: '12px',
                                padding:{ 
                                  md:'8px 6px',
                                  xl:'8px 10px'
                                },
                                fontWeight:'600',
                                lineHeight:'22px',
                                textTransform: 'none',
                              }}
                              onClick={() => setShowQuestionSticker(prev => !prev)}
                            >
                             
                               <ContactSupportOutlinedIcon  sx={{
                                  fontSize: {
                                    md: '12px',
                                    xl: '15px'
                                  },
                                  marginRight:  '5px' 
                                }}/> Question 
                            </Button>
                          </Grid>
                       


                        </Grid>

                       
                        {/* sticker expand */}
                          <Box 
                          sx={{
                                background: 'linear-gradient(to top, #2b282812 0%, #ffffff0a 100%)',
                                borderRadius: '0px 0px 20px 20px',
                          }}
                          >
                            <Button
                              variant="text"
                              size="small"
                              sx={{
                                display: 'block',
                                margin: '0 auto',
                                mt: 1,
                                color:'#475569',
                                fontFamily: 'Plus Jakarta Sans',
                                fontSize: '16px',
                              }}
                              onClick={() => setStickerExpanded(!stickerExpanded)}
                            >
                              {stickerExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
                          </Button>
                          </Box>

                     
                    </Box>
                    {/* Divider */}
                    <Box
                      sx={{
                          width: '90%',
                          height: '1px',
                          backgroundColor: '#CBD5E1', // light gray, pick your color
                          margin: '16px auto', // centers horizontally with margin
                      }}
                      />

                    {/* share button   */}
                    <Box sx={{
                      padding:'5px 0px 15px',
                
                    }}>
                      <Button
                       onClick={handleShare}
                       disabled={sharingLoading}
                       sx={{
                          fontFamily:'Plus Jakarta Sans',
                          fontWeight:'700',
                          fontSize:'14px',
                          lineHeight:'20px',
                          color:'#FFFFFF',
                          backgroundColor:'#14B8A6',
                          padding:'12px 20px',
                          borderRadius:'12px',
                             '&:disabled': {
                            backgroundColor: '#E2E8F0',
                            color: '#94A3B8'
                          }
                      }}>
                         {sharingLoading ? 'Sharing...' : 'Share'}
                        <EastTwoToneIcon sx={{marginLeft:'10px'}}/>
                      </Button>


                    </Box>
                 


                </Box>
                
                
                
                
             
                
                </Grid>
                {/* Preview */}
                <Grid item xs={12} md={8} sx={{
                    padding:{
                        sx:'10px',
                        md:'25px 35px'
                    },
                    position:'relative'
                }}>
                    <Box component='div' sx={{
                        border:'1px solid #D4D4D4',
                        borderRadius:'8px',
                        padding:'15px 10px',
                        // position:'fixed',
                       minWidth:{
                        md:'500px',
                        xl:'650px'}
                       
                    }}>
                        {!showTrimmer &&<Button sx={{
                            color:'  #475569',
                            fontFamily:'Plus Jakarta Sans',
                            fontSize:{
                              md:'13px',
                              xl:'16px'},
                            fontWeight:'700',
                            border:'1px solid #CBD5E1',
                            padding:'12px 20px',
                            borderRadius:'12px',
                            position:'absolute'
                        }}>Preview</Button>}

                        {/* Preview Box */}
                       {!showTrimmer && <Box
                        component='div'
                        sx={{
                            width: storyType !== 'text' ? 
                             {
                              md:'280px',
                              xl:'318px'}
                            :
                            {
                              md:'320px',
                              xl:'358px'},
                            height: storyType !== 'text' ? {
                              md:'440px',
                              xl:'480px'} : {
                              md:'370px',
                              xl:'440px'},
                            margin: '15px auto 30px',
                            overflow:'hidden',
                            background: storyType === 'image'
                            ? `url(${imageBackground})`
                            : storyType === 'text'
                              ? previewBackground
                              : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: storyType !== 'video'? '8px' : '0px',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                             position: 'relative', 
                            marginTop:storyType == 'text' ? '60px' : '20px',
                        }}
                        className="preview-container"
                        ref={previewRef}
                        >
                        {/* TEXT STORY */}
                        {storyType === 'text' && (
                          <Box
                            sx={{
                            color: '#475569',
                            fontSize: '20px',
                            width: '100%',
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            textAlign: 'center',
                            }}
                            dangerouslySetInnerHTML={{ __html: editorContent || 'Enter your main text here...' }}
                        />
                        )}

                        {/* IMAGE STORY */}
                        
                        {storyType === 'image' && editorContent?.trim() !== '' && showTextOnBg && (
                            <motion.div
                              drag
                              dragConstraints={previewRef}
                              dragMomentum={false}
                              onDragEnd={(event, info) => {
                                const previewWidth = 358;
                                const previewHeight = 471;

                                const sticker = textStickerRef.current?.getBoundingClientRect();
                                const stickerWidth = sticker?.width || 100;
                                const stickerHeight = sticker?.height || 50;

                                // Calculate new top-left corner
                                let x = info.point.x - stickerWidth / 2;
                                let y = info.point.y - stickerHeight / 2;

                                const safePadding = 10;

                                const minX = safePadding;
                                const minY = safePadding;
                                const maxX = previewWidth - stickerWidth - safePadding;
                                const maxY = previewHeight - stickerHeight - safePadding;

                                if (x < minX) x = minX;
                                if (y < minY) y = minY;
                                if (x > maxX) x = maxX;
                                if (y > maxY) y = maxY;

                                const xPercent = (x / previewWidth) * 100;
                                const yPercent = (y / previewHeight) * 100;

                                setTextPosition({ x: xPercent, y: yPercent });
                              }}
                              ref={textStickerRef}
                              style={{
                                position: 'absolute',
                                left: `${textPosition.x}%`,
                                top: `${textPosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                                cursor: 'grab',
                              }}
                            >
                              <Box   
                              sx={{
                                position:'relative',
                                  color: '#475569',
                                  fontSize: '20px',
                                  width: 'auto',
                                  maxWidth: '90%',
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  wordBreak: 'break-word',
                                  textAlign: 'center',
                                  userSelect: 'none',
                                  backgroundColor: 'rgba(255, 255, 255, 0)',
                                  border:'2px solid rgba(255, 255, 255, 0)',
                                  borderRadius: '0px',
                                  padding: '5px 10px',
                                  '&:hover .close-btn': {
                                      display: 'flex',
                                    },
                                  '&:hover': {
                                      border:'2px solid #FFFFFF',
                                  },
                                }}>
                               <Box 
                               sx={{
                                margin: 0,
                                '& *': {
                                  margin: 0, 
                                },
                              }}

                                dangerouslySetInnerHTML={{ __html: editorContent }}
                              />
                               <IconButton
                                        className="close-btn"
                                        onClick={handleRemoveTextSticker}
                                        sx={{
                                          position: 'absolute',
                                          top: '-12px',
                                          left: '-12px',
                                          color: '#475569',
                                          padding: '2px',
                                          width:'25px',
                                          height:'25px',
                                          borderRadius:'50%',
                                          background:'#f7ffff8f',
                                          fontSize: '16px',
                                          display: 'none', 
                                           '&:hover': {
                                              backgroundColor: '#fff', 
                                              color: '#333333', 
                                              },
                                                  }}
                                      >
                                        <CloseIcon sx={{ fontSize: '16px',  color: '#475569', }} />
                                      </IconButton>

                              </Box>
                      
                               
                                      
                            </motion.div>
                        )}

                        {/* VIDEO STORY */}
                         {storyType === 'video' && videoBackground &&  (
                          <>
                           {showTextOnBg && <motion.div
                              drag
                              dragConstraints={previewRef}
                              dragMomentum={false}
                              onDragEnd={(event, info) => {
                                const previewWidth = 358;
                                const previewHeight = 471;

                                const sticker = textStickerRef.current?.getBoundingClientRect();
                                const stickerWidth = sticker?.width || 100;
                                const stickerHeight = sticker?.height || 50;

                                // Calculate new top-left corner
                                let x = info.point.x - stickerWidth / 2;
                                let y = info.point.y - stickerHeight / 2;

                                const safePadding = 10;

                                const minX = safePadding;
                                const minY = safePadding;
                                const maxX = previewWidth - stickerWidth - safePadding;
                                const maxY = previewHeight - stickerHeight - safePadding;

                                if (x < minX) x = minX;
                                if (y < minY) y = minY;
                                if (x > maxX) x = maxX;
                                if (y > maxY) y = maxY;

                                const xPercent = (x / previewWidth) * 100;
                                const yPercent = (y / previewHeight) * 100;

                                setTextPosition({ x: xPercent, y: yPercent });
                              }}
                              ref={textStickerRef}
                              style={{
                                position: 'absolute',
                                left: `${textPosition.x}%`,
                                top: `${textPosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                                cursor: 'grab',
                                zIndex:'1000'
                              }}
                            >
                              <Box   
                              sx={{
                                position:'relative',
                                  color: '#475569',
                                  fontSize: '20px',
                                  width: 'auto',
                                  maxWidth: '90%',
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  wordBreak: 'break-word',
                                  textAlign: 'center',
                                  userSelect: 'none',
                                  backgroundColor: 'rgba(255, 255, 255, 0)',
                                  border:'2px solid rgba(255, 255, 255, 0)',
                                  borderRadius: '0px',
                                  padding: '5px 10px',
                                  '&:hover .close-btn': {
                                      display: 'flex',
                                    },
                                  '&:hover': {
                                      border:'2px solid #FFFFFF',
                                  },
                                }}>
                               <Box 
                               sx={{
                                margin: 0,
                                '& *': {
                                  margin: 0, 
                                },
                              }}

                                dangerouslySetInnerHTML={{ __html: editorContent }}
                              />
                               <IconButton
                                        className="close-btn"
                                        onClick={handleRemoveTextSticker}
                                        sx={{
                                          position: 'absolute',
                                          top: '-12px',
                                          left: '-12px',
                                          color: '#475569',
                                          padding: '2px',
                                          width:'25px',
                                          height:'25px',
                                          borderRadius:'50%',
                                          background:'#f7ffff8f',
                                          fontSize: '16px',
                                          display: 'none', 
                                           '&:hover': {
                                              backgroundColor: '#fff', 
                                              color: '#333333', 
                                              },
                                                  }}
                                      >
                                        <CloseIcon sx={{ fontSize: '16px',  color: '#475569', }} />
                                      </IconButton>

                              </Box>
                      
                               
                                      
                            </motion.div>}
                            <Box component='div' sx={{position:'relative',width: '100%', height: '100%'}}> 

                                  <video
                                  ref={videoRef}
                                  src={videoBackground}
                                  style={{ 
                                    width: "358px",       
                                    height: "545px",
                                    objectFit: "cover",  
                                  }}
                                  
                                  onLoadedMetadata={() => {
                                    const video = videoRef.current;
                                    if (video && videoEnd === 0) {
                                        setVideoEnd(video.duration);
                                    }
                                  }}
                                  onPlay={() => setIsPlaying(true)}
                                  onPause={() => setIsPlaying(false)}

                                  onTimeUpdate={() => {
                                    const video = videoRef.current;
                                    if (!video) return;
                                    if (video.paused) return;
                                    if (video.currentTime < videoStart) {
                                         video.currentTime = videoStart;
                                    }
                                    if (video.currentTime >= videoEnd) {
                                       video.currentTime = videoStart;
                                    }
                                  }}
                                   />

                                  <IconButton
                                    onClick={togglePlayPause}
                                    sx={{
                                      position: 'absolute',
                                      top: '20px',
                                      left: '20px',
                                      backgroundColor: 'rgba(0,0,0,0.5)',
                                      color: 'white',
                                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                    }}
                                  >
                                    {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
                                  </IconButton>

                            </Box>
                            
                          </>

                        
                        )}

                        {/* Other background logic for image or text here */}
                     
                   


                         {showTimeSticker && (
                            <TimeSticker
                              currentTime={currentTime}
                              setCurrentTime={setCurrentTime}
                              themeIndex={themeIndex}
                              setThemeIndex={setThemeIndex}
                              position={timeStickerPosition}
                              setPosition={setTimeStickerPosition}
                              size={timeStickersize}
                              setSize={setTimeStickersize}
                              containerRef={previewRef} // 👇 Pass the ref as prop
                              onRemove={() => setShowTimeSticker(false)}
                            />
                          )}

                          {showTemperatureSticker && (
                            <TemperatureSticker
                              temperature={temperature}
                              setTemperature={setTemperature}
                              themeIndex={tempThemeIndex}
                              setThemeIndex={setTempThemeIndex}
                              position={tempStickerPosition}
                              setPosition={setTempStickerPosition}
                              size={tempStickersize}
                              containerRef={previewRef}
                              onRemove={() => setShowTemperatureSticker(false)}
                              weatherDetails={weatherDetails}

                            />
                          )}

                          { showLocationSticker  && (
                            <LocationSticker
                              location={selectedLocationStory}
                              themeIndex={locationStickerIndex}
                              setThemeIndex={setLocationStickerIndex}
                              position={locationStickerPosition}
                              setPosition={setLocationStickerPosition}
                              size={locationStickersize}
                              containerRef={previewRef}
                              onRemove={() => setShowLocationSticker(false)}
                             />
                          )

                          }
                          {  showFeelingSticker && (
                            <FeelingSticker
                              feeling={selectedStoryFeeling}
                              themeIndex={feelingStickerIndex}
                              setThemeIndex={setFeelingStickerIndex}
                              position={feelingStickerPosition}
                              setPosition={setFeelingStickerPosition}
                              size={feelingStickersize}
                              containerRef={previewRef}
                              onRemove={() => setShowFeelingSticker(false)}

                             />
                          )

                          }
                          {/* Poll sticker */}
                          {showPollSticker && (
                            <PollSticker 
                            question={question}
                            setQuestion={setQuestion}
                            options={options}
                            setOptions={setOptions}
                            votes={votes}
                            setVotes={setVotes}
                            themeIndex={pollStickerthemeIndex}
                            setThemeIndex={setPollStickerthemeIndex}
                            position={pollStickerPosition}
                            setPosition={setPollStickerPosition}
                            containerRef={previewRef}
                            onRemove={() => setShowPollSticker(false)}
                            />
                          )}

                          {showQuestionSticker && (
                            <QuestionSticker 
                            question={question2}
                            setQuestion={setQuestion2}
                            answers={answers}
                            setAnswers={setAnswers}
                            themeIndex={questionThemeIndex}
                            setThemeIndex={setQuestionThemeIndex}
                            position={questionPosition}
                            setPosition={setQuestionPosition}
                            containerRef={previewRef}
                            onRemove={() => setShowQuestionSticker(false)}
                            />
                          )}
                          {/* friend sticker */}
                            {tagFriendsStory.map((friend, index) => {
                            // Use custom style if exists, otherwise use default
                            const stickerData = friendStickers[friend.id] || {
                              themeIndex: defaultThemeIndex,
                              position: {
                                x: 20 + (index * 15) % 70, // Auto-position new stickers
                                y: 20 + (index * 10) % 70
                              },
                              size: 120
                            };

                            return (
                              <FriendSticker
                                key={friend.id}
                                friend={friend}
                                themeIndex={stickerData.themeIndex}
                                setThemeIndex={(newIndex) => {
                                  // Only store in state when user customizes
                                  setFriendStickers(prev => ({
                                    ...prev,
                                    [friend.id]: {
                                      ...(prev[friend.id] || { 
                                        position: stickerData.position,
                                        size: stickerData.size
                                      }),
                                      themeIndex: newIndex
                                    }
                                  }))
                                }}
                                position={stickerData.position}
                                setPosition={(newPos) => setFriendStickers(prev => ({
                                  ...prev,
                                  [friend.id]: {
                                    ...(prev[friend.id] || {
                                      themeIndex: defaultThemeIndex,
                                      size: stickerData.size
                                    }),
                                    position: newPos
                                  }
                                }))}
                                size={stickerData.size}
                                containerRef={previewRef}
                                onRemove={() => handleRemove(friend.id)}
                              />
                            );
                          })}

                        </Box> }
 {showTrimmer && (
        <VideoTrimmer
          videoUrl={videoBackground}
          start={videoStart}
          end={videoEnd}
          onTrimChange={({ trimStart, trimEnd }) => {
            setVideoStart(trimStart);
            setVideoEnd(trimEnd);
          }}
          videoRef={videoRef} // ✅ share same ref
          onSave={({ trimStart, trimEnd }) => {
            setVideoStart(trimStart);
            setVideoEnd(trimEnd);
            setShowTrimmer(false);
          }}
          onCancel={() => setShowTrimmer(false)}
          onClose={() => setShowTrimmer(false)}
        />
      )}



                    </Box>
                </Grid>

                
            </Grid>
        </Box>

        {/* Audience option */}
        <StoryOptionDialog
            open={isAudienceDialogOpen}
            onClose={() => setIsAudienceDialogOpen(false)}
            title="Post audience"
            >
        <PostAudiencePanel
                audience={storyaudience}
                setAudience={setStoryAudience}
                specificFriends={specificFriends}
                setSpecificFriends={setSpecificFriends}
                exceptFriends={exceptFriends}
                setExceptFriends={setExceptFriends}
                apiUrls={{
                get: '/api/v1/stories/get-friends',
                search: '/api/v1/stories/search-friends',
              }} 

        />
        </StoryOptionDialog>

        {/* feelings option */}
        <StoryOptionDialog
          open={isFeelingsDialogOpen}
          onClose={() => setIsFeelingsDialogOpen(false)}
          title="What do you fell"
        >
        <FeelingsStoryOption
            onSelectFeeling={handleSelectFeeling}/>
        </StoryOptionDialog>

        {/* audio option */}
        <StoryOptionDialog
          open={isAudioDialogOpen}
          onClose={handleCloseAudioDialog}
          title="Audio"
        >
        <AudioStoryOption
            onSelectAudio={handleSelectAudio} selectedStoryAudio={selectedStoryAudio} currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} audioRef={audioRef} progress={progress} setProgress={setProgress}/>
        </StoryOptionDialog>


        {/* location  */}
        <StoryOptionDialog
          open={isLocationDialogOpen}
          onClose={() => setIsLocationDialogOpen(false)}
        >
          <LocationsView 
          apiUrls={{
                get: '/api/v1/stories/get-user-places',
                create: '/api/v1/stories/create-user-place',
                search: '/api/v1/stories/search-user-places',
                getById: '/api/v1/stories/get-user-place-by-id',
                update: '/api/v1/stories/update-user-place'
            }}
            onSelectLoocation={handleSelectLocation} 
          />
        </StoryOptionDialog>

        {/* Tag Friends */}
        <StoryOptionDialog
          open={isFriendsDialogOpen}
          onClose={() => setisFriendsDialogOpen(false)}
          title="mention people"
        >
          <FriendsView  selected={tagFriendsStory} setSelected={setTagFriendsStory}   handleRemove={handleRemove} 
           apiUrls={{
            get: '/api/v1/stories/get-friends',
            search: '/api/v1/stories/search-friends',
            }}
          />

        </StoryOptionDialog>



        {error && (
          <AlertMessage 
            severity="error" 
            onClose={() => setError('')} 
            title="Error"
          >
            {typeof error === 'object' 
              ? JSON.stringify(error, null, 2) 
              : error.toString()}
          </AlertMessage>
        )}

        {success && (
        <AlertMessage severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </AlertMessage>
      )}
          

    
        </>


    )
}

export default StoryEditor;