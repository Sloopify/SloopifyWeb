import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  Tooltip,
  Dialog, 
  DialogContent, 
  DialogTitle,  
  DialogActions,
  Typography,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import Emoji from '@tiptap/extension-emoji'

// emoji
import EmojiPickerButton from './EmojiPicker';


// Scroll
import { ScrollMenu, VisibilityContext, VisibilityItem} from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import BgToggleIcon from '../../../../assets/Home/icons/proicons_text-highlight-color.png';
import  BgModalToggle from '../../../../assets/Home/icons/bgcolorview.png';
import CheckIcon from '@mui/icons-material/Check';

// Enhanced debounce function with cancel and flush capabilities
const debounce = (func, delay) => {
  let timer;
  let lastArgs;
  let lastThis;
  
  const debounced = function(...args) {
    lastArgs = args;
    lastThis = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(lastThis, lastArgs);
      lastArgs = lastThis = undefined;
    }, delay);
  };
  
  debounced.cancel = () => {
    clearTimeout(timer);
    lastArgs = lastThis = undefined;
  };
  
  debounced.flush = () => {
    clearTimeout(timer);
    if (lastArgs) {
      const result = func.apply(lastThis, lastArgs);
      lastArgs = lastThis = undefined;
      return result;
    }
  };
  
  return debounced;
};

const bgColors = ['#FDA4AF', '#F0ABFC', '#C4B5FD', '#93C5FD', '#D9F99D','#BBF7D0','#5EEAD4', '#67E8F9', '#7DD3FC'];
const bgGradients = [
  'linear-gradient(to bottom, #FDA4AF, #976268)',
  'linear-gradient(to bottom, #F0ABFC, #D600FB)',
  'linear-gradient(to bottom, #F0ABFC, #8F6696)',
  'linear-gradient(to bottom, #C4B5FD, #756C97)',
  'linear-gradient(to bottom, #93C5FD, #587697)',
  'linear-gradient(to bottom, #D9F99D, #80935D)',
  'linear-gradient(to bottom, #BBF7D0, #6E917A)',
  'linear-gradient(to bottom, #5EEAD4, #358478)',
  'linear-gradient(to bottom, #67E8F9, #3D8993)',
  'linear-gradient(to bottom, #7DD3FC, #4A7E96)',
];
const bgImages = [
  '/assets/bgimages/Make2D__visible__lines.png',
  'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=800&q=60',
];
const textColors = [
  '#FFFFFF', 
  '#020617', 
  '#CBD5E1', 
  '#14B8A6', 
  '#22C55E',
  '#F59E0B',
  '#F43F5E', 
  '#3B82F6',
  '#A855F7',
];



// to detrmine the bg contracts
function isDarkColor(hex) {
  if (!hex || typeof hex !== 'string') return false;

  
  hex = hex.replace('#', '');

 
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }

  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Use sRGB luminance formula
  const [R, G, B] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  return luminance < 0.5; 
}

const setTextColorBasedOnBg = (bgColorOrType) => {
  if (!bgColorOrType || bgColorOrType === 'transparent') return '#ffffff';

  const isDark = isDarkColor(bgColorOrType);
  return isDark ? '#ffffff' : '#475569';
};


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

export default function PostComposer({ editorData, setEditorData, onPostDataChange,postData, editorRef, images = [] }) {
  const containerRef = useRef(null);
  const toolbarRef = useRef(null);
  const selectRef = useRef(null);

  const [bgModeVisible, setBgModeVisible] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [previewMode, setPreviewMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [showColorPickerPanel, setShowColorPickerPanel] = useState(false);



  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5] } }),
      TextStyle,
      FontFamily,
      Color,
      Emoji,
      Heading.configure({ levels: [1, 2, 3, 4, 5] }),
      Underline,
      Link.configure({ openOnClick: false }),
       Placeholder.configure({
      placeholder: "What's on your mind?",
      emptyEditorClass: 'is-editor-empty',
    }),
    ],
    content: editorData.content && editorData.content.trim() !== '' ? editorData.content : '',
    onFocus: () => setIsFocused(true),
    onUpdate: ({ editor }) => {
      saveEditorState(editor);
    },
    onBlur: ({ editor }) => {
      saveEditorState.cancel();
      saveEditorState(editor);
    },
  });


   const [isEmpty, setIsEmpty] = useState(true);
  
  useEffect(() => {
    if (editorRef && editor) {
      editorRef.current = editor;
    }
  }, [editor]);

   useEffect(() => {
    if (!editor) return;

    // Update empty state on content update
    const updateEmpty = () => {
      setIsEmpty(editor.isEmpty);
    };

    editor.on('update', updateEmpty);
    updateEmpty();

    return () => {
      editor.off('update', updateEmpty);
    };
  }, [editor]);
  
  // Initial content as HTML string with styling
  const initialContent = `
    <p style="font-size: 60px; color: #475569; font-family: 'Plus Jakarta Sans'">
      What's on your mind?
    </p>
  `;

  // Create debounced save function
  const saveEditorState = useCallback(debounce((editor) => {
    if (!editor) return;
    
    setIsSaving(true);
    
    // Get content as HTML string
    const content = editor.getHTML();
    const textProperties = {
      color: editor.getAttributes('textStyle').color || '#475569',
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
    };
    
    const newEditorData = {
      content, // Now storing as HTML string
      textProperties,
      bgColor: editorData.bgColor,
      bgGradient: editorData.bgGradient,
      bgImage: editorData.bgImage,
      hasBackgroundColor: editorData.hasBackgroundColor, 
      hasBackgroundImage: editorData.hasBackgroundImage,
    };
    
    setEditorData(newEditorData);
    onPostDataChange({
      ...newEditorData,
      contentString: content, // Send string version to API
      // contentJSON: editor.getJSON() // Keep JSON internally if needed
    });
    console.log('Saved editorData:', newEditorData);

    setTimeout(() => setIsSaving(false), 300);
  }, 500), [editorData, setEditorData, onPostDataChange]);


const applyTextColorToAll = (color) => {
  if (!editor) return;

  const finalColor = color || editorData?.textProperties?.color || '#475569';
  const { state, view } = editor;
  const { doc, tr } = state;

  doc.descendants((node, pos) => {
    if (node.isText && node.text && node.text.trim()) {
      tr.addMark(
        pos,
        pos + node.nodeSize,
        state.schema.marks.textStyle.create({ color: finalColor })
      );
    }
  });

  if (tr.docChanged) {
    view.dispatch(tr);
  }
};




const setBgColor = (color) => {
 const textColor = '#ffffff'; 

  editor?.commands.setColor(textColor);



 const newEditorData = {
    ...editorData,
    bgColor: color,
    bgGradient: null,
    bgImage: null,
    hasBackgroundColor: true, 
    hasBackgroundImage: false,
    textProperties: {
      ...editorData.textProperties,
      color: textColor,
    },
  };


  setEditorData(newEditorData);
  onPostDataChange({
    ...newEditorData,
    hasBackgroundColor: true,
    hasBackgroundImage: false,
    disappears24h: postData.disappears24h,
    textProperties: newEditorData.textProperties,
  });

  
  setTimeout(() => {
  applyTextColorToAll('#ffffff');
}, 300);

if (isBgModalOpen) {
    setIsBgModalOpen(false);
  }

};



 const setBgGradient = (gradient) => {
  const textColor = '#ffffff'; // always white on gradients
  editor?.commands.setColor(textColor);

  const newEditorData = {
  ...editorData,
  bgColor: null,
  bgImage: null,
  bgGradient: gradient,
  hasBackgroundColor: true, // ✅
  hasBackgroundImage: false, // ✅
  textProperties: {
    ...editorData.textProperties,
    color: textColor,
  },
};


  setEditorData(newEditorData);
  onPostDataChange({
    ...newEditorData,
    //  contentString: content,
  contentJSON: editor.getJSON(),

  });
    setTimeout(() => {
  applyTextColorToAll('#ffffff');
}, 300);


if (isBgModalOpen) {
    setIsBgModalOpen(false);
  }
};

  const setBgImage = (url) => {
  const textColor = '#ffffff'; // always white on image background
  editor?.commands.setColor(textColor);

  const newEditorData = {
    ...editorData,
    bgColor: 'transparent',
    bgGradient: null,
    bgImage: url,
    hasBackgroundColor: false,
    hasBackgroundImage: true,
    textProperties: {
      ...editorData.textProperties,
      color: textColor,
    },
  };

  setEditorData(newEditorData);
  onPostDataChange({
    ...postData,
    ...newEditorData,
    hasBackgroundColor: newEditorData.hasBackgroundColor,
    hasBackgroundImage: newEditorData.hasBackgroundImage,
    textProperties: newEditorData.textProperties,

  });

  if (isBgModalOpen) {
    setIsBgModalOpen(false);
  }
};


  // Handle outside clicks to blur editor
  useEffect(() => {
    const handleClickOutside = (event) => {
      const insideEditor = containerRef.current?.contains(event.target);
      const insideToolbar = toolbarRef.current?.contains(event.target);
      const insideMenu = event.target.closest('.MuiMenu-root');
      if (!insideEditor && !insideToolbar && !insideMenu) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  

  const hasInitialized = useRef(false);

useEffect(() => {
  if (!editor || !editorData || hasInitialized.current) return;

  console.log('✅ Setting content from editorData:', editorData);

  editor.commands.setContent(editorData.content || '');

  const { bold, italic, underline, color } = editorData.textProperties || {};
  if (bold) editor.commands.setBold();
  if (italic) editor.commands.setItalic();
  if (underline) editor.commands.setUnderline();
  if (color) editor.commands.setColor(color);

  hasInitialized.current = true;
}, [editor, editorData]);



  const handleBlockChange = (event) => {
    const type = event.target.value;
    setBlockType(type);
    if (!editor) return;
    if (type === 'paragraph') editor.chain().focus().setParagraph().run();
    else editor.chain().focus().setNode('heading', { level: parseInt(type[1]) }).run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') return editor.chain().focus().unsetLink().run();
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

 const editorStyle = {
  backgroundColor: editorData.hasBackgroundColor ? editorData.bgColor : 'transparent',
  backgroundImage: editorData.hasBackgroundImage
    ? `url(${editorData.bgImage})`
    : editorData.bgGradient || 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  textAlign: editorData.hasBackgroundColor || editorData.hasBackgroundImage ? 'center' : 'left',
  padding: '16px',
  borderRadius: '8px',
  minHeight: 200,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: '34px',
  fontWeight: 500,
  color: editorData?.textProperties?.color || '#475569',
  resize: 'vertical',
};

const resetBackgroundAndTextColor = () => {
  const defaultTextColor = '#475569';

  // Reset background data in editorData state
  const newEditorData = {
    ...editorData,
    bgColor: 'transparent',
    bgGradient: null,
    bgImage: null,
    hasBackgroundColor: false,
    hasBackgroundImage: false,
    textProperties: {
      ...editorData.textProperties,
      color: defaultTextColor,
    },
  };

  // Apply text color to entire editor content with a slight delay
  setTimeout(() => {
    editor?.commands.selectAll();
    editor?.commands.setColor(defaultTextColor);
    editor?.commands.setTextSelection(editor.state.doc.content.size);
  }, 100);

  setEditorData(newEditorData);
  onPostDataChange({
    ...newEditorData,
    hasBackgroundColor: false,
    hasBackgroundImage: false,
    disappears24h: postData.disappears24h,
    textProperties: newEditorData.textProperties,
  });
};

// scroll arrow
const ArrowLeft = () => {
  const { isFirstItemVisible, scrollPrev } = React.useContext(VisibilityContext);

  return (
    <IconButton 
      onClick={() => scrollPrev()} 
      disabled={isFirstItemVisible}
      sx={{
        visibility: isFirstItemVisible ? 'hidden' : 'visible',
         backgroundColor: '#F5F5F5',
        borderRadius: '8px',
        padding:'2px',
        margin: '0 4px',
        '&:hover': {
          backgroundColor: '#F5F5F5'
        }
      }}
    >
      <ChevronLeftIcon fontSize="small" />
    </IconButton>
  );
};

const ArrowRight = () => {
  const { isLastItemVisible, scrollNext, visibleElements } = React.useContext(VisibilityContext);

  // Hide right arrow if all items are visible
  const hideArrow = visibleElements && Object.keys(visibleElements).length >= bgColors.length + bgGradients.length;

  return (
    <IconButton 
      onClick={() => scrollNext()} 
      disabled={isLastItemVisible || hideArrow}
      sx={{
        visibility: isLastItemVisible || hideArrow ? 'hidden' : 'visible',
        backgroundColor: '#F5F5F5',
        borderRadius: '8px',
        padding:'2px',
        margin: '0 4px',
        '&:hover': {
          backgroundColor: '#F5F5F5'
        }
      }}
    >
      <ChevronRightIcon fontSize="12px" />
    </IconButton>
  );
};


  return (
    <Box ref={containerRef}>
      {isSaving && (
        <Box sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          Saving...
        </Box>
      )}

     

      <Box sx={{ my: 2 }}>
        {isFocused && (
          <Box
            ref={toolbarRef}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              mb: 1,
              zIndex: 10,
              backgroundColor: '#fff',
              borderRadius: 1,
              p: 0,
              boxShadow: 1,
            }}
          >
            <Select
              value={blockType}
              onChange={handleBlockChange}
              size="small"
              ref={selectRef}
              MenuProps={{ disablePortal: true }}
              sx={{
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: '700',
                color: '#475569',
                fontSize: '16px',
                borderRight: '1px solid #CBD5E1', 
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none', 
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none', 
                },
              }}
            >
              <MenuItem value="paragraph">Paragraph</MenuItem>
              <MenuItem value="h1">Heading 1</MenuItem>
              <MenuItem value="h2">Heading 2</MenuItem>
              <MenuItem value="h3">Heading 3</MenuItem>
              <MenuItem value="h4">Heading 4</MenuItem>
              <MenuItem value="h5">Heading 5</MenuItem>
            </Select>

            <Tooltip title="Bold">
              <IconButton 
                onClick={() => editor?.chain().focus().toggleBold().run()}  
                sx={{
                  color: editor?.isActive('bold') ? '#14b8a6' : 'default',
                }}
              >
                <FormatBold />
              </IconButton>
            </Tooltip>

            <Tooltip title="Italic">
              <IconButton 
                onClick={() => editor?.chain().focus().toggleItalic().run()}  
                sx={{
                  color: editor?.isActive('italic') ? '#14b8a6' : 'default',
                }}
              >
                <FormatItalic />
              </IconButton>
            </Tooltip>

            <Tooltip title="Underline">
              <IconButton 
                onClick={() => editor?.chain().focus().toggleUnderline().run()} 
                sx={{
                  color: editor?.isActive('underline') ? '#14b8a6' : 'default',
                }}
              >
                <FormatUnderlined />
              </IconButton>
            </Tooltip>
              <Tooltip title="Text Color">
                <IconButton 
                  onClick={() => setShowColorPickerPanel(!showColorPickerPanel)}
                  sx={{
                    color: showColorPickerPanel ? '#14b8a6' : 'default',
                  }}
                >
                  <DriveFileRenameOutlineRoundedIcon />
                </IconButton>
              </Tooltip>
            {/* <Tooltip title="Text Color">
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                {textColors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => {
                      editor?.commands.setColor(color);
                      applyTextColorToAll(color); // Apply to all text
                    }}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: editor?.getAttributes('textStyle')?.color === color 
                        ? '2px solid #14b8a6' 
                        : '2px solid transparent',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Tooltip> */}

            <Tooltip title="Add/Edit Link">
              <IconButton 
                onClick={setLink} 
                sx={{
                  color: editor?.isActive('link') ? '#14b8a6' : 'default',
                }}
              >
                <LinkIcon />
              </IconButton>
            </Tooltip>

            <EmojiPickerButton editor={editor} />

             
            
          </Box>
        )}

        {previewMode ? (
          
          <Box
            sx={{
              mt: 2,
              height: 200,
              backgroundColor: editorData.bgColor,
              backgroundImage: editorData.bgImage ? `url(${editorData.bgImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
             
            {editor?.getText() || "What's on your mind?"}
          </Box>
        ) : (
          <Box sx={editorStyle}>
              {showColorPickerPanel && <Tooltip title="Text Color">
               <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  {textColors.map((color) => (
                    <Box
                      key={color}
                      onClick={() => {
                        editor?.commands.setColor(color);
                        applyTextColorToAll(color);
                        setShowColorPickerPanel(!showColorPickerPanel);
                      }}
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: '2px solid #CBD5E1',
                        boxShadow: editor?.getAttributes('textStyle')?.color === color 
                          ? '0px 0px 0px 4px #4F46E540' 
                          : 'none',
                        cursor: 'pointer',
                        position: 'relative', // Needed for absolute positioning
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {editor?.getAttributes('textStyle')?.color === color && (
                        <CheckIcon
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: isDarkColor(color) ? '#FFFFFF' : '#475569',
                            fontSize: '16px',
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Tooltip>}
            <EditorContent editor={editor} />
          </Box>
        )}
         {images.length === 0 && (
        <Button
          sx={{ position: 'absolute', right: '10px', marginTop: '20px' }}
          size="small"
          onClick={() => setBgModeVisible(!bgModeVisible)}
        >
          <Box component="img" src={BgToggleIcon} alt="Background options" />
        </Button>
        
        )}
      </Box>
      <Box sx={{display: 'flex',justifyContent:'flex-end',marginRight:'0px',alignItems:'center',height:'30px', marginTop:'-55px' }}>
       {bgModeVisible && (
          <Box sx={{ display: 'flex', gap: 2,width: '100%', maxWidth: '556px', overflow: 'hidden',alignItems:'center' }}>
            <Tooltip title="Modal Background">
              <IconButton 
              
               onClick={() => setIsBgModalOpen(true)}
              > 
              <Box component='img'
              src={BgModalToggle}/>
              
              </IconButton>
            </Tooltip>
            <ScrollMenu 
              LeftArrow={<ArrowLeft />} 
              RightArrow={<ArrowRight />}
              wrapperClassName="scroll-menu-wrapper"
              scrollContainerClassName="scroll-menu-container"
              transitionDuration={300}
              scrollContainerStyle={{
                padding: '0 8px',
              }}
            >
            {bgColors.map((color) => (
              <div key={color} itemId={color}  style={{ scrollSnapAlign: 'center' }}>
              <Box
                onClick={() => {
                  setBgColor(color);
                  setBgModeVisible(false);
                }}
                sx={{
                  width: '27.5px',
                  height: '27.5px',
                  borderRadius: '8px',
                  backgroundColor: color,
                  border: editorData.bgColor === color ? '2px solid #fff' : '0px solid #ccc',
                  cursor: 'pointer',
                  margin: '0 10px',
                  flexShrink: 0,
                 
                  scrollSnapAlign: 'center'
                      }}
              />
              </div>
            ))}
           
            {bgGradients.map((gradient, index) => (
              <div key={`gradient-${index}`} itemId={`gradient-${index}`}  style={{ scrollSnapAlign: 'center' }}>
              <Box
                onClick={() => {
                  setBgGradient(gradient);
                  setBgModeVisible(false);
                }}

                 sx={{
                width: '27.5px',
                height: '27.5px',
                borderRadius: '8px',
                backgroundImage: gradient,
                border: editorData.bgGradient === gradient ? '2px solid #fff' : '0px solid #ccc',
                cursor: 'pointer',
               margin: '0 10px',
                  flexShrink: 0,
                  boxShadow: '0px 1px 4.5px 0px #00000033',
                scrollSnapAlign: 'center'
              }}
              />
              </div>
            ))}

              {bgImages.map((url, index) => (
              <div  key={`url-${index}`} itemId={`url-${index}`}  style={{ scrollSnapAlign: 'center' }}>
              <Box
                key={url}
                onClick={() => {
                  setBgImage(url);
                  setBgModeVisible(false);
                }}
                sx={{
                   width: '27.5px',
                  height: '27.5px',
                  borderRadius: '8px',
                  backgroundImage: `url(${url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: editorData.bgImage === url ? '2px solid #fff' : '0px solid #eee',
                  cursor: 'pointer',
                 margin: '0 10px',
                  flexShrink: 0,
                  boxShadow: '0px 1px 4.5px 0px #00000033',
                  scrollSnapAlign: 'center'
                }}
              />
              </div>
            ))}
             </ScrollMenu>
             <Tooltip title="Reset Background">
              <IconButton 
                onClick={resetBackgroundAndTextColor}
               sx={{color:'#fff'}}
              >
                <SyncOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
    
    
      )}
        </Box>


      {/* Modal BG */}
          <Dialog open={isBgModalOpen} onClose={() => setIsBgModalOpen(false)}  maxWidth="md"  sx={{
              cursor: 'pointer',
              boxShadow: 'none',
              '& .MuiPaper-root': {
              border: '1px solid #E2E8F0',
              padding: '40px 60px',
              borderRadius: '39px',
              width:'690px',
          padding:'39px 59px'
            }
              }}>
              <DialogTitle   sx={{
                    textAlign:'left',
                    color: '#1E293B',
                     fontSize:{
                    xs:'20px',
                   md:'36px'},
                    fontWeight: '800',
                    fontFamily: 'Plus Jakarta Sans',
                    padding:'10px 0px',
                borderBottom:'1px solid #D4D4D8',
                 position:'relative'
                  }}>Select  background</DialogTitle>
                 
                   <IconButton onClick={() => setIsBgModalOpen(false)}  sx={{
                                  backgroundColor:'#E5E5E5',
                                  color:'#1E1E1E',
                                  position:'absolute',
                                  right:'40px',
                                  top:'60px'
                                }}>
                                    <ArrowBackIcon color='#1E1E1E'/>
                                </IconButton>
              <DialogContent>
                {/* bg images */}
                {/* <Box sx={{ mt: 2 }}>
                  <Typography sx={{
                      color: '#475569',
                    fontSize: '20px',
                    fontWeight: '400',
                    fontFamily: 'Plus Jakarta Sans',
                  }} >Damascene pattern </Typography>

                  <Box sx={{display:'flex', marginTop:'20px',flexWrap:'wrap',gap:'10px 20px'}}>
                    {bgImages.map((url, index) => (
                    <div  key={`url-${index}`} itemId={`url-${index}`}  style={{ scrollSnapAlign: 'center' }}>
                    <Box
                      key={url}
                      onClick={() => {
                        setBgImage(url);
                        setBgModeVisible(false);
                      }}
                      sx={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '0px',
                        backgroundImage: `url(${url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        // border: editorData.bgImage === url ? '2px solid #000' : '2px solid #eee',
                        cursor: 'pointer',
                        margin: '0 4px',
                        flexShrink: 0,
                        scrollSnapAlign: 'center'
                      }}
                    />
                    </div>
                    ))}
                  </Box>

                  
              
                </Box> */}
                {/* bg colors */}
                 <Box sx={{ mt: 2 }}>
                  <Typography sx={{
                      color: '#475569',
                    fontSize: '20px',
                    fontWeight: '400',
                    fontFamily: 'Plus Jakarta Sans',
                  }} > Colors </Typography>

                  <Box sx={{display:'flex', marginTop:'20px',flexWrap:'wrap',gap:'10px 20px'}}>
                    {bgColors.map((color) => (
                      <div key={color} itemId={color}  style={{ scrollSnapAlign: 'center' }}>
                      <Box
                        onClick={() => {
                          setBgColor(color);
                          setBgModeVisible(false);
                        }}
                        sx={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '0px',
                          backgroundColor: color,
                          // border: editorData.bgColor === color ? '2px solid #000' : '2px solid #ccc',
                          cursor: 'pointer',
                        
                          flexShrink: 0,
                          scrollSnapAlign: 'center'
                              }}
                      />
                      </div>
                    ))}
                  </Box>

                  
              
                </Box>
                {/* bg gradients */}
                 <Box sx={{ mt: 4 }}>
                  <Typography sx={{
                      color: '#475569',
                    fontSize: '20px',
                    fontWeight: '400',
                    fontFamily: 'Plus Jakarta Sans',
                  }} > Gradientc Colors </Typography>

                  <Box sx={{display:'flex', marginTop:'20px',flexWrap:'wrap',gap:'10px 20px'}}>
                    {bgGradients.map((gradient, index) => (
                      <div key={`gradient-${index}`} itemId={`gradient-${index}`}  style={{ scrollSnapAlign: 'center' }}>
                      <Box
                        onClick={() => {
                          setBgGradient(gradient);
                          setBgModeVisible(false);
                        }}

                        sx={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '0px',
                        backgroundImage: gradient,
                        // border: editorData.bgGradient === gradient ? '2px solid #000' : '2px solid #ccc',
                        cursor: 'pointer',
                        
                        flexShrink: 0,
                        scrollSnapAlign: 'center'
                      }}
                      />
                      </div>
                    ))}
                  </Box>

                  
              
                </Box>
              </DialogContent>

      </Dialog>
    </Box>
  );
}



