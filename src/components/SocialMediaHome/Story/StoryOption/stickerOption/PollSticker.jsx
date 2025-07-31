import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Input, FormControl  } from '@mui/joy';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const PollSticker = ({
  question,
  setQuestion,
  options,
  setOptions,
  votes,
  setVotes,
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
    const container = containerRef.current;
    if (!container) return;

    const previewWidth = container.offsetWidth || 358;
    const previewHeight = container.offsetHeight || 471;

    const sticker = stickerRef.current?.getBoundingClientRect();
    const stickerWidth = sticker?.width || size;
    const stickerHeight = sticker?.height || 50;

    let x = info.point.x - stickerWidth / 2;
    let y = info.point.y - stickerHeight / 2;

    const safePadding = 10;
    const minX = safePadding;
    const minY = safePadding;
    const maxX = previewWidth - stickerWidth - safePadding;
    const maxY = previewHeight - stickerHeight - safePadding;

    if (x < minX) x = minX;
    if (y < minY) y = minY;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    const xPercent = (x / previewWidth) * 100;
    const yPercent = (y / previewHeight) * 100;

    setPosition({ x: xPercent, y: yPercent });
  };

  const handleVote = (option) => {
    setVotes((prev) => ({
      ...prev,
      [option]: (prev[option] || 0) + 1,
    }));
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
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
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
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

        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Your question..."
          variant="plain"
            sx={{
                fontFamily: 'Plus Jakarta Sans',
                mb: 1,
                fontWeight: 700,
                fontSize: '16px',
                textAlign: 'center',
                background: 'transparent',
                border: '0px',
                boxShadow: 'none',
                color: '#000000',
                '::before': {
                display: 'none',
                },
                '--Input-focusedHighlight': 'transparent',
                '&:focus-within': {
                outline: 'none',
                border: '1px solid #14B8A6',
                borderRadius: '4px',
                },
            }}
            slotProps={{
                input: {
                sx: {
                    textAlign: 'center',
                    '::placeholder': {
                    textAlign: 'center',
                    },
                },
                },
            }}

        />

        <Box sx={{ display: 'flex', flexDirection: 'row' ,alignItems:'center',justifyContent:'center'}}>
          {options.map((opt, index) => (
            <Box
              key={index}
              sx={{
               
                 borderRight: index === 0 ? '3px solid #000' : 'none',
               
              }}
            >
           <FormControl sx={{ width: '100%'}}>
            <Input
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              sx={{
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 700,
                fontSize: '14px',
                padding:'15px',
                width:'100px',
                textAlign: 'center',
                background: 'transparent',
                border: '0px',
                borderRadius: index === 0 ? '100px 0px 0px 100px' : '0px 100px 100px 0px',
                boxShadow: 'none',
                color: '#000000',
                '&::before': {
                  display: 'none',
                },
                '&:focus-within': {
                  outline: 'none',
                  border: '0px solid #14B8A6',
                  borderRadius: index === 0 ? '100px 0px 0px 100px' : '0px 100px 100px 0px',
                },
                backgroundColor:'#fff',

              }}
              slotProps={{
                input: {
                sx: {
                    textAlign: 'center',
                    '::placeholder': {
                    textAlign: 'center',
                    },
                },
                },
            }}
            />
          </FormControl>
             
            </Box>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PollSticker;
