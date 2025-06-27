import React, { useState, useRef } from 'react';
import {
  IconButton,
  Tooltip as MuiTooltip,
  Box
} from '@mui/material';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerButton = ({ editor }) => {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef(null);

  const handleEmojiClick = (emojiData, event) => {
    const emoji = emojiData.emoji;
    if (editor && emoji) {
      editor.commands.focus();
      editor.commands.insertContent(emoji);
      setVisible(false);
    }
  };

  return (
    <Tippy
      visible={visible}
      onClickOutside={() => setVisible(false)}
      interactive={true}
      placement="bottom-start"
      animation="scale"
      arrow={false}
      content={
        <Box sx={{ zIndex: 9999,
           backgroundColor: 'white',
            borderRadius: 2,
          '&.tippy-box':{
               backgroundColor: 'white',
          },
            padding: 0,
            maxWidth: 320,
            overflow: 'hidden',
         }}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            skinTonesDisabled={false}
            searchDisabled={false}
            previewConfig={{ showPreview: false }}
            lazyLoadEmojis
            height={350}
            width={300}
          />
        </Box>
      }
    >
      <div ref={buttonRef}>
        <MuiTooltip title="Insert emoji">
          <IconButton
            onClick={() => setVisible(!visible)}
            sx={{ color: visible ? '#14b8a6' : 'default' }}
          >
            <InsertEmoticonIcon />
          </IconButton>
        </MuiTooltip>
      </div>
    </Tippy>
  );
};

export default EmojiPickerButton;
