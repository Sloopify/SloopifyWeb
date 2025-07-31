import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography
} from '@mui/material';
import StoryTypeSelector from './StoryTypeSelector';
import StoryEditor from './StoryEditor';




const StoryDialog = ({setstoryDialogOpen, storyDialogOpen}) => {
  // story type state
  const [storyType, setStoryType] = useState(null);
  const [uploadedImage, setUploadedImage] = useState({ preview: '', file: null });
  const [videoBackground, setVideoBackground] = useState({ preview: '', file: null });
  const [storyaudience, setStoryAudience] = useState('public');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [selectedFontFamily, setSelectedFontFamily] = useState('Plus Jakarta Sans');
  const [showTimeSticker, setShowTimeSticker] = useState(false);
  const [showTemperatureSticker, setShowTemperatureSticker] = useState(false);
  const [showFeelingSticker , setShowFeelingSticker ] = useState(false);
  const [tagFriendsStory, setTagFriendsStory] = useState([]);
  const [selectedStoryAudio, setSelectedStoryAudio] = useState(null);
  const [showLocationSticker , setShowLocationSticker ] = useState(false);
  const [showPollSticker , setShowPollSticker ] = useState(false);
  const [showQuestionSticker , setShowQuestionSticker ] = useState(false);

  
  
  const previewBackgroundOptions = [
    // Gradients
  { type: 'gradient', value: 'linear-gradient(135deg, #72D6EC 0%, #B6FAE1 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #FDE68A 0%, #FCA5A5 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #FDBA74 0%, #F472B6 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #A5B4FC 0%, #818CF8 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #FBCFE8 0%, #F9A8D4 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #FECACA 0%, #F87171 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #86EFAC 0%, #4ADE80 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #F0ABFC 0%, #E879F9 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #5EEAD4 0%, #2DD4BF 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #A7F3D0 0%, #34D399 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #C7D2FE 0%, #818CF8 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #FBCFE8 0%, #EC4899 100%)' },
    // Images
    // { type: 'image', value: 'url(assets/bgimages/storybg.jpg)' },
  

    ];
    const [previewBackground, setPreviewBackground] = useState(previewBackgroundOptions[0].value);

  
  
  

 const handleImageSelect = (imageObject) => {
  setUploadedImage(imageObject);
};

const handleVideoSelect = (videoObject) => {
  setVideoBackground(videoObject);
};

 const initialStateRef = useRef({
    storyaudience: 'public',
    editorContent: '',
    selectedFontFamily: 'Plus Jakarta Sans',
    previewBackground: previewBackgroundOptions[0].value,
    uploadedImage: { preview: '', file: null },
    videoBackground: { preview: '', file: null },
    showTimeSticker:false,
    showTemperatureSticker:false,
    showFeelingSticker:false,
    tagFriendsStory:[],
    showLocationSticker:false,
    selectedStoryAudio:null,
    showPollSticker:false,
    showLocationSticker:false
  });



  // Check if any of the tracked states have changed from their initial values
  const hasUnsavedChanges = () => {
    const currentState = {
      storyaudience,
      editorContent,
      selectedFontFamily,
      previewBackground,
      uploadedImage,
      videoBackground,
      showTimeSticker,
      showTemperatureSticker,
      showFeelingSticker,
      tagFriendsStory,
      showLocationSticker,
      selectedStoryAudio,
      showPollSticker,
      showQuestionSticker
    };

    return Object.keys(initialStateRef.current).some(key => {
      if (key === 'uploadedImage' || key === 'videoBackground') {
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
      setEditorContent(initialStateRef.current.editorContent);
      setSelectedFontFamily(initialStateRef.current.selectedFontFamily);
      setPreviewBackground(initialStateRef.current.previewBackground);
      setUploadedImage(initialStateRef.current.uploadedImage);
      setVideoBackground(initialStateRef.current.videoBackground);
      setStoryType(null);
      setstoryDialogOpen(false);
      setShowTimeSticker(false);
      setShowTemperatureSticker(false);
      setShowFeelingSticker(false);
      setTagFriendsStory([]);
      setShowLocationSticker(false);
      setSelectedStoryAudio(null);
      setShowPollSticker(false);
      setShowQuestionSticker(false)
    }
    setShowConfirmation(false);
  };


  return (
    <>
 
    <Dialog disableScrollLock open={storyDialogOpen} onClose={handleCloseAttempt}  fullWidth  sx={{
    '& .MuiDialog-paper': {  
      width: {
        xs:'320px',
        md:'1100px'
      }, 
      minHeight: storyType ?'600px' : 'auto',                
      maxWidth: '1100px',     
      borderRadius: '8px', 
      padding: '0px',       
      backgroundColor: '#F8FAFC',
      border:'1px solid #D4D4D4',
      boxShadow:'0px 4px 4px 0px #00000040',
     '& .MuiDialogContent-root': {
      padding: storyType ? 0 : '20px 24px',
    }

    }
  }}
  >
     
      <DialogContent>
        {!storyType && <StoryTypeSelector onSelect={setStoryType} onImageSelect={handleImageSelect} handleVideoSelect={handleVideoSelect} videoBackground={videoBackground}/>}
        {storyType && <StoryEditor setStoryAudience={setStoryAudience}  storyaudience={storyaudience} storyType={storyType} imageBackground={uploadedImage.preview} videoBackground={videoBackground.preview}  imageFile={uploadedImage.file}  videoFile={videoBackground.file}
        showConfirmation ={showConfirmation} setShowConfirmation={setShowConfirmation} editorContent={editorContent} setEditorContent={setEditorContent}
        selectedFontFamily={selectedFontFamily} setSelectedFontFamily={setSelectedFontFamily} previewBackground={previewBackground} setPreviewBackground={setPreviewBackground}
        previewBackgroundOptions={previewBackgroundOptions} showTimeSticker={showTimeSticker} setShowTimeSticker={setShowTimeSticker}
        showTemperatureSticker={showTemperatureSticker} setShowTemperatureSticker={setShowTemperatureSticker} showFeelingSticker={showFeelingSticker} setShowFeelingSticker={setShowFeelingSticker}
        tagFriendsStory={tagFriendsStory} setTagFriendsStory={setTagFriendsStory} showLocationSticker={showLocationSticker} setShowLocationSticker={setShowLocationSticker} selectedStoryAudio={selectedStoryAudio} setSelectedStoryAudio={setSelectedStoryAudio}
        showPollSticker={showPollSticker} setShowPollSticker={setShowPollSticker} showQuestionSticker={showQuestionSticker} setShowQuestionSticker={setShowQuestionSticker}
        />}
      </DialogContent>
      
    </Dialog>
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}   sx={{
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
          <Button onClick={() => handleConfirmClose(false)}
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
            >Keep Editing</Button>
          <Button 
            onClick={() => handleConfirmClose(true)} 
            color="primary"
            variant="contained"
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
            Discard Story
          </Button>
        </DialogActions>
      </Dialog>
    </>
    

  );
};

export default StoryDialog