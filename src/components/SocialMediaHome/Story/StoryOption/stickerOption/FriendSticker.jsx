import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { STICKER_THEMES } from '../../../../../config/stickerThemes';
import { Box } from '@mui/joy';
import IconButton from '@mui/material/IconButton';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';



const FriendSticker = ({
  friend,
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
    const nextTheme = (themeIndex + 1) % STICKER_THEMES.length;
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

  return (
    <motion.div
      ref={stickerRef}
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      dragElastic={0.3}
      dragPropagation={false}
      whileDrag={{ scale: 1.1, opacity: 0.9, cursor: 'grabbing' }}
    
      onDragEnd={handleDragEnd}
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'grab',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          padding: {
            xs: '5px 8px',
            md: '10px 8px',
            xl: '15px 10px'
          },
          borderRadius: '10px',
          cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: {
            xs: '12px',
            md: '14px',
            xl: '18px'
          },
          fontWeight: 700,
          userSelect: 'none',
          width: `${size}px`,
          ...STICKER_THEMES[themeIndex].style,
          textAlign: 'center',
          lineHeight: '25px',
          display: 'flex',
          alignItems: 'center',
          '&:hover .close-btn': {
            display: 'flex',
          },
            cursor: 'inherit',
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
            fontSize: '16px',
            display: 'none',
            '&:hover': {
              backgroundColor: '#e0f2f1',
              color: '#333333',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: '16px', color: '#475569' }} />
        </IconButton>
        <AlternateEmailIcon
          sx={{
            fontSize: '25px',
            color: themes[themeIndex]?.colors?.[3],
            marginRight: '10px',
          }}
        />
        {friend?.first_name || 'Friend'}
      </Box>
    </motion.div>
  );
};

export default FriendSticker;