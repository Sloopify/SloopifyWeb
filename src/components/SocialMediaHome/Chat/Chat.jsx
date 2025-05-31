import React, {useState} from 'react';
// UI
import { Drawer, Box, Avatar, IconButton, Typography,FormControl, FormLabel, TextField, Stack } from '@mui/material';
// Images 
import RepeatIcon from '../../../assets/Chat/icons/Repeat.svg';
import UserAvatar from '../../../assets/Chat/AvatarUser.png';

// Icons
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import FeaturedVideoOutlinedIcon from '@mui/icons-material/FeaturedVideoOutlined';
// Chat Compenont 
import ChatList from './Chatlists';


const drawerWidth = 370;
const drawerWidthMd = 300;


export default function ChatHome() {

    return(
          <Drawer
            variant="permanent"
            anchor="right"
            sx={{
                width: {
                    md: drawerWidthMd,  
                    xl: drawerWidth    
                },
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                width: {
                    md: drawerWidthMd,  
                    xl: drawerWidth    
                },
                boxSizing: 'border-box',
                backgroundColor: '#F8FAFC',  // <-- here
                overflow: 'auto',
              
              
                '&::-webkit-scrollbar': { display: 'none' },
                },
                
            }}
            >
            <Box component={'div'} padding={'32px 24px'}
               >
                <Box component={'div'} sx={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    flexDirection:'column',
                    border:'1px solid #D4D4D4',
                    borderRadius:'12px',
                    padding:'12px 20px',
                    }}>
                    <Box component={'div'}
                    sx={{position:'relative'}}>
                         <Avatar
                        src={UserAvatar}
                        alt={'User Avatar'}
                        sx={{ 
                            width: 96, 
                            height: 96,

                        }}
                        variant="circle"
                        />
                        
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                             sx={{ 
                            backgroundColor:'#fff',
                            width: 30, 
                            height: 30,
                            position:'absolute',
                            bottom:'0px',
                            right:'0px',
                            padding:'5px'
                         
                        }}
                            
                        >
                        <Box 
                        component={'img'}
                        src={RepeatIcon}
                        alt='Refresh'
                        ></Box>
                            
                        </IconButton>
                      
                    </Box>
                    <Typography sx={{
                        color:'#1E293B',
                        fontSize:'20px',
                        fontFamily:'Plus Jakarta Sans',
                        fontWeight:'800',
                        lineHeight:'28px',
                        letterSpacing:'-1%',
                        margin:'15px 0px'
                    }}>
                        X_AE_C-921
                    </Typography>
                    <FormControl>
                        <FormLabel
                         sx={{
                            textAlign:'center',
                            fontSize:'16px',
                            fontWeight:'500',
                            color:'#1E293B',
                            fontFamily:'Plus Jakarta Sans',
                            letterSpacing:'-0.6%',
                            lineHeight:'20px',
                             marginBottom:'10px',
                         }}
                         htmlFor="status">Enter tour status today ..</FormLabel>
                        <TextField
                            required
                            fullWidth
                            className="field password-field"
                            name="status"
                            placeholder="Write something..."
                            type="text"
                            id="status"
                            variant="outlined"
                            sx={{
                                    input: { color: '#475569', 
                                        padding:'12px',
                                        border:'0px',
                                        borderRadius: '123px',
                                        backgroundColor:'#fff'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                    borderRadius: '123px',
                                    border: '0px solid #CBD5E1',
                                  
                                    Height:'48px',
                                    backgroundColor:'#fff',
                                    marginBottom:'0px',
                                    '&.Mui-focused': {
                                        boxShadow: 'none',
                                    },
                                    },
                                }}
                        />
                    </FormControl>
                    <Stack direction="row" alignItems="center" justifyContent={'space-between'} spacing={2} mb={1}mt={3} sx={{width:'100%'}}>
                        <IconButton sx={{
                            border:'1px solid #CBD5E1',
                            borderRadius:'1px solid #CBD5E1',
                            position:'relative',
                            width:'48px',
                            height:'48px'
                            }}>
                           <ChatOutlinedIcon sx={{color:'#14B8A6'}} />
                           <Box component={'span'} 
                           sx={{
                            width:'16px',
                            height:'16px',
                            position:'absolute',
                            bottom:'0px',
                            right:'-5px',
                            backgroundColor:'#F43F5E',
                            fontSize:'10px',
                            color:'#fff',
                            lineHeight:'15px',
                            borderRadius:'50%',
                            fontFamily:'Plus Jakarta Sans',
                           }}
                           >2</Box>
                        
                        </IconButton>
                        <IconButton sx={{
                            border:'1px solid #CBD5E1',
                            borderRadius:'1px solid #CBD5E1',
                            position:'relative',
                            width:'48px',
                            height:'48px'
                            }}>
                           <NotificationsNoneOutlinedIcon sx={{color:'#475569'}} />
                           <Box component={'span'} 
                           sx={{
                            width:'16px',
                            height:'16px',
                            position:'absolute',
                            bottom:'0px',
                            right:'-5px',
                            backgroundColor:'#F43F5E',
                            fontSize:'10px',
                            color:'#fff',
                            lineHeight:'15px',
                            borderRadius:'50%',
                            fontFamily:'Plus Jakarta Sans',
                           }}
                           >1</Box>
                        
                        </IconButton>
                        <IconButton sx={{
                            border:'1px solid #CBD5E1',
                            borderRadius:'1px solid #CBD5E1',
                            position:'relative',
                            width:'48px',
                            height:'48px'
                            }}>
                           <FeaturedVideoOutlinedIcon sx={{color:'#475569'}} />
                           <Box component={'span'} 
                           sx={{
                            width:'16px',
                            height:'16px',
                            position:'absolute',
                            bottom:'0px',
                            right:'-5px',
                            backgroundColor:'#F43F5E',
                            fontSize:'10px',
                            color:'#fff',
                            lineHeight:'15px',
                            borderRadius:'50%',
                            fontFamily:'Plus Jakarta Sans',
                           }}
                           >10</Box>
                        
                        </IconButton>
                    </Stack>
                    
                    
                   
                  
                </Box>
            </Box>
            <ChatList />
            </Drawer>

    )
    
}