import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



// OptionDialog.js
const StoryOptionDialog = ({ open, onClose, title, children}) => {
  return (
    <Dialog open={open} onClose={onClose}  sx={{
    '& .MuiDialog-paper': {  
      width: {
        xs:'320px',
        md:'760px'},         
      maxWidth: '900px',     
      borderRadius: '39px', 
      padding: {
        xs:'10px',
        md:'39px 59px'},       
      backgroundColor: '#fff',
      border:'1px solid #A1A1AA',
      boxShadow:'0px 4px 4px 0px #00000040',

    }
  }}>
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
              {title}
               <IconButton   
               onClick={onClose}  sx={{
                  backgroundColor:'#E5E5E5',
                  color:'#1E1E1E'
                  }}>
                     <ArrowBackIcon color='#1E1E1E'/>
               </IconButton>

            
        </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default StoryOptionDialog;

