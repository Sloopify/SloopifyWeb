import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { STICKER_THEMES } from '../../../../../config/stickerThemes';
import { Box } from '@mui/joy';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const FeelingSticker = ({
  feeling,
  themeIndex,
  setThemeIndex,
  position,
  setPosition,
  size,
  containerRef,
  onRemove,
}) => {
  const themes = STICKER_THEMES;
  const stickerRef = useRef(null);

  const handleDoubleClick = () => {
    const nextTheme = (themeIndex + 1) % themes.length;
    setThemeIndex(nextTheme);
  };

  const handleDragEnd = (event, info) => {
    const previewWidth = 358;
    const previewHeight = 471;

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

  return (
    <motion.div
      ref={stickerRef}
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >

<Box
        sx={{
          position: 'relative',
          padding: '15px 10px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: '18px',
          fontWeight: 700,
          userSelect: 'none',
          width: `${size}px`,
          ...themes[themeIndex].style,
          textAlign: 'center',
          lineHeight: '25px',
          display: 'flex',
          alignItems: 'center',
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
            width:'25px',
            height:'25px',
            borderRadius:'50%',
            background:'#f7ffff8f',
            fontSize: '16px',
            display: 'none', 
             '&:hover': {
                backgroundColor: '#e0f2f1', 
                color: '#333333', 
                },
                    }}
        >
          <CloseIcon sx={{ fontSize: '16px',  color: '#475569', }} />
        </IconButton>
        <Box component='img' src={feeling?.web_icon} sx={{
            width:'25px',
            marginRight:'10px'
        }}/>
      {feeling?.name || 'Select a feeling'}
        </Box>
    </motion.div>
  );
};

export default FeelingSticker;
