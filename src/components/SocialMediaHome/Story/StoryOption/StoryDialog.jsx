import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from '@mui/material';
import StoryTypeSelector from './StoryTypeSelector';



const StoryDialog = ({setstoryDialogOpen, storyDialogOpen}) => {
  // story type state
  const [storyType, setStoryType] = useState(null);

  return (
 
    <Dialog open={storyDialogOpen} onClose={() => setstoryDialogOpen(false)}  fullWidth maxWidth="md"  sx={{
    '& .MuiDialog-paper': {  
      width: {
        xs:'320px',
        md:'758px'},         
      maxWidth: '900px',     
      borderRadius: '8px', 
      padding: {
        xs:'10px',
        md:'20px'},       
      backgroundColor: '#F8FAFC',
      border:'1px solid #D4D4D4',
      boxShadow:'0px 4px 4px 0px #00000040',

    }
  }}>
     
      <DialogContent>
        {!storyType && <StoryTypeSelector onSelect={setStoryType} />}
      </DialogContent>
    </Dialog>

  );
};

export default StoryDialog