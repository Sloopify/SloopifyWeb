import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { STICKER_THEMES } from '../../../../../config/stickerThemes';

const TimeSticker = ({
  onChange,
  currentTime,
  setCurrentTime,
  themeIndex,
  setThemeIndex,
  position,
  setPosition,
  size,
  setSize,
  containerRef, // 👈 NEW!
}) => {
  const themes = STICKER_THEMES;

  // Update time every second
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

  const handleClick = () => {
    const nextTheme = (themeIndex + 1) % themes.length;
    setThemeIndex(nextTheme);
  };

  const handleDragEnd = (event, info) => {
    const container = containerRef.current?.getBoundingClientRect();
    const sticker = info.point;

    if (container) {
      const xPercent = ((sticker.x - container.left) / container.width) * 100;
      const yPercent = ((sticker.y - container.top) / container.height) * 100;

      setPosition({ x: xPercent, y: yPercent });
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        padding: '8px 16px',
        borderRadius: '24px',
        cursor: 'pointer',
        fontFamily: 'Plus Jakarta Sans',
        fontSize: `${size}px`,
        fontWeight: 700,
        userSelect: 'none',
        ...themes[themeIndex].style,
      }}
      onClick={handleClick}
    >
      {currentTime}
    </motion.div>
  );
};

export default TimeSticker;
