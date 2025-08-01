import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Input, FormControl } from '@mui/joy';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';

const QuestionSticker = ({
  question,
  setQuestion,
  answers,
  setAnswers,
  themeIndex,
  setThemeIndex,
  position,
  setPosition,
  size = 280,
  containerRef,
  onRemove,
}) => {
  const stickerRef = useRef(null);

  const handleDoubleClick = () => {
    const nextTheme = (themeIndex + 1) % 3;
    setThemeIndex(nextTheme);
  };

  const handleDragEnd = (_, info) => {
  // Add drag offset to existing position
  setPosition((prev) => ({
    x: prev.x + info.offset.x,
    y: prev.y + info.offset.y,
  }));
};


  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  return (
    <motion.div
      ref={stickerRef}
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      dragElastic={0.2}
      whileDrag={{ scale: 1.05, opacity: 0.9, cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'absolute',
        cursor: 'grab',
        width: `${size}px`,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: '12px',
          p: 2,
          fontFamily: 'Plus Jakarta Sans',
          userSelect: 'none',
          '&:hover .close-btn': {
            display: 'flex',
          },
        }}
      >
        <IconButton
          className="close-btn"
          onClick={onRemove}
          sx={{
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            color: '#475569',
            padding: '2px',
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            background: '#f7ffff8f',
            display: 'none',
            '&:hover': {
              backgroundColor: '#e0f2f1',
              color: '#333',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: '16px', color: '#475569' }} />
        </IconButton>

        {/* Question */}
        <Box sx={{
            padding:'15px',
            background: 'linear-gradient(to right, #14B8A6, #8CA8CF)',
            borderRadius:'12px 12px 0px 0px'
        }}>
            <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            variant="plain"
            sx={{
                fontFamily: 'Dosis',
                mb: 0,
                fontWeight: 500,
                fontSize: '14px',
                textAlign: 'center',
                background: 'transparent',
                border: '0px',
                boxShadow: 'none',
                color: '#FFFFFF',
                textTransform:'uppercase',
                '::before': { display: 'none' },
                '--Input-focusedHighlight': 'transparent',
                '&:focus-within': {
                outline: 'none',
                border: '1px solid #14B8A6',
                borderRadius: '4px',
                color:'#fff'
                },
            }}
            slotProps={{
                input: {
                sx: {
                    textAlign: 'center',
                    '::placeholder': {
                    textAlign: 'center',
                    color:'#fff',
                    opacity:'1'
                    },
                },
                },
            }}
            />
        </Box>
     

        {/* Answers */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, padding:'16px', backgroundColor:'#FFFFFF',borderRadius:'0px 0px 12px 12px' }}>
          {answers.map((answer, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <FormControl sx={{ flexGrow: 1 }}>
                <Input
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={`Answer ${index + 1}`}
                  variant="plain"
                  sx={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontWeight: 600,
                    
                    fontSize: '14px',
                    background: '#EFEFEF',
                    border: '0px solid #ccc',
                    borderRadius: '8px',
                    padding:'10px',
                    mb:1,
              
                    boxShadow: 'none',
                    '::before': { display: 'none' },
                    '--Input-focusedHighlight': 'transparent',
                    color: '#64748B',
                    '&:focus-within': {
                      border: '1px solid #94A3B8',
                      color:'#64748B'
                    },
                    '&:hover': {
                      color: '#64748B',
                    },

                    '& input:-webkit-autofill': {
                        boxSizing: 'border-box',
                      WebkitBoxShadow: '0 0 0 1000px #EFEFEF inset',
                      WebkitTextFillColor: '#1E293B',
                      transition: 'background-color 5000s ease-in-out 0s',
                    
                    },
                  }}
                />
                 {answers.length > 2 && (
                <IconButton
                  size="small"
                  onClick={() => {
                    const updated = answers.filter((_, i) => i !== index);
                    setAnswers(updated);
                  }}
                  sx={{
                    fontSize: '12px',
                    color: '#475569',
                    '&:hover': { color: '#000' },
                    position:'absolute',
                    right:'5px',
                    top:'7px'
                }}
                >
                  <HighlightOffSharpIcon fontSize="small" sx={{fontSize:'18px',color:'#94A3B8'}}/>
                </IconButton>
              )}
              </FormControl>
             
            </Box>
          ))}
            {/* Add Answer */}
        {answers.length < 5 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Typography
              onClick={() => setAnswers([...answers, ''])}
              sx={{
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                color: '#64748B',
                padding: '10px 12px',
                borderRadius: '6px',
                background: '#f8fafc',
                border:'1px dashed #94A3B8',
                '&:hover': {
                  background: '#f8fafc',
                },
                display:'flex',
                alignItems:'center',
                width:'100%',
                justifyContent:'center'
              }}
            >
              Add option <AddCircleOutlineSharpIcon sx={{fontSize:'18px', marginLeft:'10px'}}/>
            </Typography>
          </Box>
        )}
        </Box>

      
      </Box>
    </motion.div>
  );
};

export default QuestionSticker;
