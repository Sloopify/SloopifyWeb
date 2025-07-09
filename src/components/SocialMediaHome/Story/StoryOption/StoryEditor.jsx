import React, { useState, useEffect } from 'react';
import { Avatar, Typography, IconButton, Stack, Badge, Button } from '@mui/material';
import { useUser } from '../../../../context/UserContext';
import { Box, Grid } from '@mui/joy';
import { audienceOptions } from '../../../../data/audienceData';
// assests
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// Option Dialog
import StoryOptionDialog from './StoryOptionDialog';
// audience 
import PostAudiencePanel from '../../AddPostField/PostOptions/PostAudienceView';


const StoryEditor = ({storyaudience, setStoryAudience}) => {
    const { userData } = useUser();
    const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim();
    const userName = [userData?.firstName, userData?.lastName].join(' ');
    const avatarUserUrl =  `${userData?.profileImage || ''}`;
    const activeStatus = `${userData?.active || ''}`;
    // audience
    const [isAudienceDialogOpen, setIsAudienceDialogOpen] = useState(false);
    const [specificFriends, setSpecificFriends] = useState([]);
    const [exceptFriends, setExceptFriends] = useState([]);

//     useEffect(() => {
//     console.log('Story Audience changed to:', storyaudience);
//   }, [storyaudience]);

    

    return(
        <>
        <Box>  
            {/* Story option header */}
            <Grid container>
                {/* Editor */}
                <Grid item xs={12} md={4}
                component="div"
                sx={{
                    borderRight:'1px solid #D4D4D4'
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
                    <Box component="div"
                    sx={{
                        paddingLeft:'10px'
                    }}
                    >
                    <Typography
                        sx={{
                            color:'  #1E293B',
                            fontFamily:'Plus Jakarta Sans',
                            fontSize:'18px',
                            fontWeight:'700',

                            textTransform:'capitalize'
                        }}
                        >{fullName ? `${fullName}` : ''}</Typography>
                    
                    <Typography
                        sx={{
                            color:'  #475569',
                            fontFamily:'Plus Jakarta Sans',
                            fontSize:'16px',
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
                <Box
                sx={{
                    width: '90%',
                    height: '1px',
                    backgroundColor: '#CBD5E1', // light gray, pick your color
                    margin: '16px auto', // centers horizontally with margin
                }}
                />
                
                
             
                
                </Grid>
                {/* Preview */}
                <Grid item xs={12} md={8} sx={{
                    padding:{
                        sx:'10px',
                        md:'30px 40px'
                    }
                }}>
                    <Box component='div' sx={{
                        border:'1px solid #D4D4D4',
                        borderRadius:'8px',
                        padding:'15px 10px'
                    }}>
                        <Button sx={{
                            color:'  #475569',
                            fontFamily:'Plus Jakarta Sans',
                            fontSize:'16px',
                            fontWeight:'700',
                            border:'1px solid #CBD5E1',
                            padding:'12px 20px',
                            borderRadius:'12px',

                        }}>Preview</Button>

                        {/* Preview Box */}
                        <Box component='div' sx={{
                            width:'358px',
                            height:'471px',
                            display:'block',
                            margin:'15px auto 30px',
                            background: 'linear-gradient(135deg, #72D6EC 0%, #B6FAE1 100%)',
                            borderRadius:'8px',
                            padding:'10px',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center'
                        }}>
                            <Typography sx={{
                                color:'  #475569',
                                fontFamily:'Plus Jakarta Sans',
                                fontSize:'20px',
                                fontWeight:'700',
                                textAlign:'center'
                            }}>Enter your main text here...</Typography>
                        </Box>

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
        />
        </StoryOptionDialog>


        </>

    )
}

export default StoryEditor;