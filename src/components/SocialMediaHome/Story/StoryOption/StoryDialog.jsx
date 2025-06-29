import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from '@mui/material';


const StoryDialog = ({setstoryDialogOpen, storyDialogOpen}) => {

  return (
    <Dialog open={storyDialogOpen} onClose={() => setstoryDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Create a Story</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
          
          </Grid>
          <Grid item xs={8}>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StoryDialog