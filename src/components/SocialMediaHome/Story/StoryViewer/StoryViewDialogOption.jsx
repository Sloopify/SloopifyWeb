import React, { useState } from "react";
import {  
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Popover,
    Box 
} from "@mui/material";

// assests
import HideOptionIcon from '../../../../assets/Story/optionsIcon/EyeSlash.png';
import SnoozeOptionIcon from '../../../../assets/Story/optionsIcon/snooze.png';
import UnfriendOptionIcon from '../../../../assets/Story/optionsIcon/unfriend.png';
import HideAllPostOptionIcon from '../../../../assets/Story/optionsIcon/ReceiptX.png';
import RestrictOptionIcon from '../../../../assets/Story/optionsIcon/SpeakerSimpleSlash.png';
import RestrictNotfiOptionIcon from '../../../../assets/Story/optionsIcon/SpeakerSimpleX.png';
import ReportOptionIcon from '../../../../assets/Story/optionsIcon/SealWarning.png';

export default function StoryContent({ story, user, anchorEl, onClose, openOptions}) {

  return (
    <Popover
    open={openOptions}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{
         vertical: 'center',
  horizontal: 'left',
    }}
    transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
    }}
    PaperProps={{
    sx: {
      borderRadius: '24px 0px 24px 24px', 
      width:'290px'
    },
  }}
>
  <Box sx={{ p: 1 }}>
    {/* options for other users */}
   {!user.isOwn  && <List>
      <ListItem>
        <ListItemIcon  sx={{ width: 24,minWidth:'30px'
           
         }}><Box 
        component='img' 
        src={HideOptionIcon}
        sx={{ width: 20 }}
        /></ListItemIcon>
        <ListItemText
        primaryTypographyProps={{
            sx: {
                fontFamily: 'Plus Jakarta Sans',
                fontWeight:'700',
                fontSize:'13px',
                color:'#1E293B'
             }
        }}
         primary="Hide Story" />
      </ListItem>
      <ListItem>
        <ListItemIcon  sx={{ width: 24,minWidth:'30px'
           
         }}><Box 
        component='img' 
        src={SnoozeOptionIcon}
        sx={{ width: 20 }}
        /></ListItemIcon>
        <ListItemText
        primaryTypographyProps={{
            sx: {
                fontFamily: 'Plus Jakarta Sans',
                fontWeight:'700',
                fontSize:'13px',
                color:'#1E293B'
             }
        }}
         primary="Snooze This Person for 30 Days" />
      </ListItem>
      <ListItem>
        <ListItemIcon  sx={{ width: 24,minWidth:'30px'
           
         }}><Box 
        component='img' 
        src={UnfriendOptionIcon}
        sx={{ width: 20 }}
        /></ListItemIcon>
        <ListItemText
        primaryTypographyProps={{
            sx: {
                fontFamily: 'Plus Jakarta Sans',
                fontWeight:'700',
                fontSize:'13px',
                color:'#1E293B'
             }
        }}
         primary="Unfriend" />
      </ListItem>
      <ListItem>
        <ListItemIcon  sx={{ width: 24,minWidth:'30px'
           
         }}><Box 
        component='img' 
        src={HideAllPostOptionIcon}
        sx={{ width: 20 }}
        /></ListItemIcon>
        <ListItemText
        primaryTypographyProps={{
            sx: {
                fontFamily: 'Plus Jakarta Sans',
                fontWeight:'700',
                fontSize:'13px',
                color:'#1E293B'
             }
        }}
         primary="Hide All Posts from This Person" />
      </ListItem>
       <ListItem>
        <ListItemIcon  sx={{ width: 24,minWidth:'30px'
           
         }}><Box 
        component='img' 
        src={RestrictOptionIcon}
        sx={{ width: 20 }}
        /></ListItemIcon>
        <ListItemText
        primaryTypographyProps={{
            sx: {
                fontFamily: 'Plus Jakarta Sans',
                fontWeight:'700',
                fontSize:'13px',
                color:'#1E293B'
             }
        }}
         primary="Restrict Notifications from this person for 30 days" />
      </ListItem>
       <ListItem>
        <ListItemIcon  sx={{ width: 24,minWidth:'30px'
           
         }}><Box 
        component='img' 
        src={RestrictNotfiOptionIcon}
        sx={{ width: 20 }}
        /></ListItemIcon>
        <ListItemText
        primaryTypographyProps={{
            sx: {
                fontFamily: 'Plus Jakarta Sans',
                fontWeight:'700',
                fontSize:'13px',
                color:'#1E293B'
             }
        }}
         primary="Restrict Notifications Permanently" />
      </ListItem>
      <ListItem>
        <ListItemIcon  sx={{ width: 24,minWidth:'30px'
           
         }}><Box 
        component='img' 
        src={ReportOptionIcon}
        sx={{ width: 20 }}
        /></ListItemIcon>
        <ListItemText
        primaryTypographyProps={{
            sx: {
                fontFamily: 'Plus Jakarta Sans',
                fontWeight:'700',
                fontSize:'13px',
                color:'#1E293B'
             }
        }}
         primary="Report " />
      </ListItem>
    </List>}
  </Box>
</Popover>

  );
}
