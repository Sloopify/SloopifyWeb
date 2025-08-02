// components/GIFSticker.jsx
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Box, IconButton } from '@mui/joy'
import CloseIcon from '@mui/icons-material/Close'

const GIFSticker = ({
  gifUrl,
  position,
  setPosition,
  size = 200,
  containerRef,
  onRemove,
}) => {
  const handleDragEnd = (_, info) => {
    setPosition((prev) => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y,
    }))
  }

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      dragElastic={0.2}
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      style={{
        position: 'absolute',
        cursor: 'grab',
        width: `${size}px`,
      }}
    >
      <Box
    sx={{
          position: 'relative',
         
          borderRadius: '10px',
        
          
   
          width: `${size}px`,
          textAlign: 'center',
    
          display: 'flex',
          alignItems: 'center',
          cursor: 'inherit',
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
                minWidth:'25px',
                minHeight:'25px',
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
         
        <img
          src={gifUrl}
          alt="GIF Sticker"
          style={{ display: 'block', width: '100%', height: 'auto' , pointerEvents: 'none'}}
        />
      </Box>
    </motion.div>
  )
}

export default GIFSticker
