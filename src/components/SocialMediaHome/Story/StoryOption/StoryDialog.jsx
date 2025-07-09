import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from '@mui/material';
import StoryTypeSelector from './StoryTypeSelector';
import StoryEditor from './StoryEditor';




const StoryDialog = ({setstoryDialogOpen, storyDialogOpen}) => {
  // story type state
  const [storyType, setStoryType] = useState(null);
  const [storyaudience, setStoryAudience] = useState('public');

  return (
 
    <Dialog disableScrollLock open={storyDialogOpen} onClose={() => setstoryDialogOpen(false)}  fullWidth maxWidth="md"  sx={{
    '& .MuiDialog-paper': {  
      width: {
        xs:'320px',
        md:'1100px'},         
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
        {!storyType && <StoryTypeSelector onSelect={setStoryType} />}
        {storyType && <StoryEditor setStoryAudience={setStoryAudience}  storyaudience={storyaudience}/>}
      </DialogContent>
      
    </Dialog>

  );
};

export default StoryDialog