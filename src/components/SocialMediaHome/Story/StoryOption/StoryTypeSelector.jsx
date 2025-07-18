import React from "react";
import {
  Button
} from '@mui/material';
import { Box } from "@mui/joy";

// assets
import TextOptionImage from '../../../../assets/Story/text-story-img.png';
import ImageOptionImage from '../../../../assets/Story/image-story-img.png';
import VideoTap from '../../../../assets/Story/video-tap.png';
import Fluencer from '../../../../assets/Story/fluencer.png';
import VideoStick from '../../../../assets/Story/video-stick.png';
import monitor from '../../../../assets/Story/monitor.svg';


const StoryTypeSelector = ({ onSelect }) => (
  <Box>
    <Box  sx={{display:'flex',
            gap:3,
            justifyContent:'center',
            width:'100%',
            flexWrap:'wrap'
        }}>
          <Box sx={{
            padding:'24px',
            border:'1px solid #CBD5E1',
            borderRadius:'24px',    
            width:{
                xs:'100%',
                md:'250px'
            }
        }}>
            <Box component='img' src={TextOptionImage} sx={{
                width:'100%',
                height:'192px',
                objectFit:'contain'
            }}/>
            <Button sx={{
                fontFamily:'Plus Jakarta Sans',
                fontSize:{
                    xs:'13px',
                    md:'16px'
                },
                fontWeight:'700',
                lineHeight:'22px',
                border:'1px solid #CBD5E1',
                borderRadius:'12px',
                padding:'12px 20px',
                color:'#475569',
                display:'block',
                margin:'15px auto 0px',
                textTransform:'capitalize',
                '&:hover': {
                    borderColor: '#14B8A6',    
                    color: '#14B8A6',         
                },
                
                '&:focus': {
                    outline: 'none',
                   
                }
            }}
            onClick={() => onSelect('text')}>
                Add Text
            </Button>

        </Box>
  
   
        <Box sx={{
            padding:'24px',
            border:'1px solid #CBD5E1',
            borderRadius:'24px',    
             width:{
                xs:'100%',
                md:'250px'
            }
        }}>
            <Box component='img' src={ImageOptionImage} sx={{
                width:'100%',
                height:'192px',
                objectFit:'contain'
            }}/>
            <Button sx={{
                fontFamily:'Plus Jakarta Sans',
                fontSize:{
                    xs:'13px',
                    md:'16px'
                },
                fontWeight:'700',
                lineHeight:'22px',
                border:'1px solid #CBD5E1',
                borderRadius:'12px',
                padding:'12px 20px',
                color:'#475569',
                display:'block',
                margin:'15px auto 0px',
                textTransform:'capitalize',
                '&:hover': {
                    borderColor: '#14B8A6',    
                    color: '#14B8A6',         
                },
                
                '&:focus': {
                    outline: 'none',
                   
                }
            }}
           onClick={() => onSelect('image')}>
                Add Image
            </Button>

        </Box>
    </Box>
    <Box sx={{display:'flex',
            justifyContent:'center',
            width:'100%',

        }}>
        <Box sx={{
            padding:'5px',
            border:'1px solid #CBD5E1',
            borderRadius:'24px',    
            width:{
                xs:'100%',
                md:'421px'},
            mt:3,
            position:'relative',
            display:'flex',
          
        }}>
            <Box component='img' src={VideoTap} sx={{
                position:'absolute',
                top:'3px',
                left:'5px',
                width:{
                    xs:'40px',
                    md:'auto'
                }

            }}/>
            <Box component='img' src={Fluencer} sx={{
                width:{
                    xs:'120px',
                    md:'auto'
                },
                height:{
                    xs:'120px',
                    md:'auto'
                },
                objectFit:'cover'
            }}/>
            <Box component='img' src={VideoStick} sx={{
                marginLeft:'-30px',
                width:{
                    xs:'40px',
                    md:'auto'
                },
                height:{
                    xs:'120px',
                    md:'auto'
                },
                objectFit:'contain'
            }}/>
            <Box>
                <Box component='img' src={monitor} sx={{
                     width:{
                        xs:'80px',
                        md:'auto'
                    },
                    display:'block',
                    margin:{
                        xs:'20px auto 20px',
                        md:'20px auto 40px'}
                }}/>
                <Button sx={{
                fontFamily:'Plus Jakarta Sans',
                fontSize:{
                    xs:'13px',
                    md:'16px'
                },
                fontWeight:'700',
                lineHeight:'22px',
                border:'1px solid #CBD5E1',
                borderRadius:'12px',
                padding:'12px 20px',
                color:'#475569',
                display:'block',
                margin:'15px auto 0px',
                textTransform:'capitalize',
                '&:hover': {
                    borderColor: '#14B8A6',    
                    color: '#14B8A6',         
                },
                
                '&:focus': {
                    outline: 'none',
                   
                }
            }}
            >
                Add Video
            </Button>

            </Box>

            
        </Box>

    </Box>
      
 
 
  </Box>
);

export default StoryTypeSelector;