import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Typography, IconButton, Stack, Popover, Button } from '@mui/material';
import { useUser } from '../../../../context/UserContext';
import { Box, Grid } from '@mui/joy';
import { audienceOptions } from '../../../../data/audienceData';
// assests
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// Option Dialog
import StoryOptionDialog from './StoryOptionDialog';
// audience 
import PostAudiencePanel from '../../AddPostField/PostOptions/PostAudienceView';
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

import {
    BoltOutlined,
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
    // editor
    const [editorContent, setEditorContent] = useState('');
    // color picker
   // Color picker state
    const [colorAnchorEl, setColorAnchorEl] = useState(null);
    const [tempColor, setTempColor] = useState('#000');
    const [appliedColor, setAppliedColor] = useState('#000');
    const [savedColors, setSavedColors] = useState([]);
    const [charCount, setCharCount] = useState(0);
    const [expanded, setExpanded] = useState(false);
    // story sticker
    const previewRef = useRef(null);

      // time sticker

      const [currentTime, setCurrentTime] = useState('');
      const [themeIndex, setThemeIndex] = useState(0);
      const [timeStickerPosition, setTimeStickerPosition] = useState({ x: 90, y: 10 });
      const [timeStickersize, setTimeStickersize] = useState(120);
      const [showTimeSticker, setShowTimeSticker] = useState(false);

      // Temp sticker
      const [tempThemeIndex, setTempThemeIndex] = useState(0);
      const [tempStickerPosition, setTempStickerPosition] = useState({ x: 40, y: 20 });
      const [tempStickersize, setTempStickersize] = useState(90);
      const [showTemperatureSticker, setShowTemperatureSticker] = useState(false);
      const [temperature, setTemperature] = useState('--°C');


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
                setTemperature(`${temp.toFixed(1)}°C`);
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

    const [selectedFontFamily, setSelectedFontFamily] = useState('Plus Jakarta Sans');

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
    { type: 'image', value: 'url(assets/bgimages/storybg.jpg)' },
  

    ];


const [previewBackground, setPreviewBackground] = useState(previewBackgroundOptions[0].value);



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
        setEditorContent(editor.getHTML());
        const text = editor.state.doc.textContent;
        if (text.length > MAX_CHARS) {
            // Trim the content to max length
            editor.commands.setContent(text.slice(0, MAX_CHARS));
            setCharCount(MAX_CHARS);
        } else {
            setCharCount(text.length);
        }
        },
    });


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
                                    }}/>
                                </IconButton>
                                <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
                                    <FormatItalic  sx={{
                                    color: editor?.isActive('italic') ? '#14b8a6' : '#475569',
                                    }}/>
                                </IconButton>
                                <IconButton onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                                    <FormatUnderlined sx={{
                                    color: editor?.isActive('underline') ? '#14b8a6' : '#475569',
                                    }} />
                                </IconButton>
                                <IconButton onClick={handleColorIconClick}>
                                    <DriveFileRenameOutlineRoundedIcon sx={{ color: appliedColor }} />
                                </IconButton>

                            </Box>
                            <Box sx={{padding:'10px 5px'}}>
                                <IconButton onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                                    <FormatAlignLeftIcon sx={{color:'#475569'}}/>
                                </IconButton>
                                <IconButton onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                                    <FormatAlignCenterIcon  sx={{color:'#475569'}}/>
                                </IconButton>
                                <IconButton onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                                    <FormatAlignRightIcon  sx={{color:'#475569'}}/>
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
                            fontSize:'14px',
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
                            fontSize: '14px',
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
                    <Box sx={{
                      width: '90%',
                      border: '1px solid #D4D4D4',
                      borderRadius: '20px',
                    }}>
                      <Typography sx={{
                        fontFamily: 'Plus Jakarta Sans',
                        fontWeight: '700',
                        fontSize: '14px',
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

                    {/* sticker option */}
                     <Box sx={{
                      width: '90%',
                      border: '1px solid #D4D4D4',
                      borderRadius: '20px',
                      mt:2
                    }}>
                         <Typography sx={{
                        fontFamily: 'Plus Jakarta Sans',
                        fontWeight: '700',
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#475569',
                        marginBottom: '10px',
                        padding: '10px'
                      }}>
                        Sticker
                      </Typography>
                        
                        <Box sx={{display:'flex'}}>
                             {/* time sticker */}
                         <Button
                          sx={{
                            display: 'flex',
                            margin: '10px auto',
                            background:'transparent',
                            mt: 1,
                            color: showTimeSticker ? '#14b8a6' : '#475569',
                            fontFamily: 'Plus Jakarta Sans',
                            fontSize: '14px',
                            borderRadius: '12px',
                            padding: '8px 20px',
                            fontWeight:'600',
                            lineHeight:'22px',
                            textTransform: 'none',
                          }}
                          onClick={() => setShowTimeSticker(prev => !prev)}
                        >
                          {showTimeSticker ?   <>
                            <AccessTimeIcon sx={{marginRight:'10px'}}/>
                            {currentTime}


                            </> : (
                            <>
                            <AccessTimeIcon sx={{marginRight:'10px'}}/>
                            {currentTime}


                            </>
                          )}
                        </Button>
                        {/* temp */}
                            <Button
                          sx={{
                            display: 'flex',
                            margin: '10px auto',
                            background:'transparent',
                            mt: 1,
                            color: showTemperatureSticker ? '#14b8a6' : '#475569',
                            fontFamily: 'Plus Jakarta Sans',
                            fontSize: '14px',
                            borderRadius: '12px',
                            padding: '8px 20px',
                            fontWeight:'600',
                            lineHeight:'22px',
                            textTransform: 'none',
                          }}
                          onClick={() => setShowTemperatureSticker(prev => !prev)}
                        >
                          {showTemperatureSticker ?   <>
                            <WbSunnyOutlinedIcon sx={{marginRight:'10px'}}/>
                            {temperature}


                            </> : (
                            <>
                            <WbSunnyOutlinedIcon sx={{marginRight:'10px'}}/>
                            {temperature}


                            </>
                          )}
                        </Button>


                        </Box>
                     
                    </Box>
                 


                </Box>
                
                
                
             
                
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
                       <Box
                        component='div'
                        sx={{
                            width: '358px',
                            height: '471px',
                            margin: '15px auto 30px',
                            overflow:'hidden',
                            background: previewBackground,
                            borderRadius: '8px',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                             position: 'relative', 
                        }}
                        className="preview-container"
                        ref={previewRef}
                        >
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
                            />
                          )}
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