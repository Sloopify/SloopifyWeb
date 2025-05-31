import React from 'react';
import {
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  Paper,
  Divider,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '../../../assets/Chat/icons/search.svg'

const sidebarWidth = '100%';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    borderRadius: '50%',
    height: 10,
    minWidth: 10,
  },
}));

const chatData = {
  conversations: [
    {
      name: 'Alice Johnson',
      message: 'Hey, are we still meeting today?',
      time: '10:45 AM',
      online: true,
    },
    {
      name: 'Bob Smith',
      message: "Don't forget to check the report.",
      time: '9:30 AM',
      online: false,
    },
  ],
  groups: [
    {
      name: 'React Devs',
      message: 'Code review scheduled for today.',
      time: 'Yesterday',
      online: false,
    },
  ],
  channels: [
    {
      name: '#general',
      message: 'Welcome new members!',
      time: '2 days ago',
      online: false,
    },
  ],
};

const ChatUI = () => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleTabChange = (event, newValue) => setTabIndex(newValue);
  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const chatListKey = ['conversations', 'groups', 'channels'][tabIndex];
  const fullChatList = chatData[chatListKey];

  const filteredChats = fullChatList.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm) ||
      chat.message.toLowerCase().includes(searchTerm)
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%', position: 'relative' }}>
      <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5' }} />

      <Box
        sx={{
          width: sidebarWidth,
          borderTop: '1px solid #E5E5E5',
          
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box 
        sx={{
            padding:'24px 16px'
        }}
        >
            <Typography
            sx={{
                color:'#1E293B',
                fontFamily:'Plus Jakarta Sans',
                fontSize:'24px',
                lineHeight:'32px',
                fontWeight:'800',
                letterSpacing:'-1.2%',
                marginBottom:'20px'
            }}
            >My Chats</Typography>
            <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            fullWidth
            onChange={handleSearchChange}
            value={searchTerm}
             sx={{
                input: { color: '#475569', 
                        padding:'12px',
                        border:'0px',
                        borderRadius: '123px',
                        backgroundColor:'#fff'
                        },
                        '& .MuiOutlinedInput-root': {
                        borderRadius: '123px',
                        border: '0px solid #CBD5E1',
                                  
                        Height:'48px',
                        backgroundColor:'#fff',
                        marginBottom:'0px',
                        '&.Mui-focused': {
                         boxShadow: 'none',
                        },
                    },
                    }}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start" >
                            <Box
                            component="img"
                            src={SearchIcon}
                            alt="Search Icon"
                        />
                        </InputAdornment>
                        ),
                }}
            />
        </Box>
        

       
        <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ 
        '& .MuiTabs-list':{
          justifyContent:'space-between',
          marginTop:'30px',
          
                },
                '& .MuiTab-root': {
            borderBottom: '2px solid #CBD5E1',
            color:'#1E293B',
            fontSize:'14px',
            fontFamily:'Plus Jakarta Sans',
            fontWeight:'700'
            },
            '& .Mui-selected':{
                color:'#1E293B',
            fontSize:'14px',
            fontFamily:'Plus Jakarta Sans',
            fontWeight:'700'
            },
            '& .MuiTabs-indicator': {
               color:'#1E293B',
            height:'0px',
            borderBottom: '2px solid #14B8A6', // active tab
            },
            'MuiButtonBase-root-MuiTab-root.Mui-selected':{
               color:'#1E293B',

            }

                
       }}>
          <Tab label="Conversations" />
          <Tab label="Groups" />
          <Tab label="Channels" />
        </Tabs>


        <Box sx={{ mt: 1, overflowY: 'auto', flexGrow: 1 }}>
          <List>
            {filteredChats.map((chat, idx) => (
              <ListItem
                key={idx}
                button
                onClick={() => setSelectedChat(chat)}
                alignItems="flex-start"
                sx={{
                    borderBottom:'1px solid #E2E8F0'
                }}
              >
                <ListItemAvatar>
                  {chat.online ? (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                    >
                      <Avatar>{chat.name[0]}</Avatar>
                    </StyledBadge>
                  ) : (
                    <Avatar>{chat.name[0]}</Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight="bold" sx={{
                        fontFamily:'Plus Jakarta Sans',
                        fontSize:'16px',
                        color:'#1E293B',
                        lineHeight:'22px'
                      }}>{chat.name}</Typography>
                      <Typography variant="caption" sx={{
                         fontFamily:'Plus Jakarta Sans',
                        fontSize:'14px',
                        color:'#94A3B8',
                        lineHeight:'22px',
                        fontWeight:'400'
                      }}>
                        {chat.time}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2"  noWrap sx={{
                         fontFamily:'Plus Jakarta Sans',
                        fontSize:'14px',
                        color:'#475569',
                        lineHeight:'22px',
                        fontWeight:'500'
                      }}>
                      {chat.message}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

    
      {selectedChat && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 300,
            maxHeight: 500,
            p: 2,
            borderRadius: 2,
            boxShadow: 6,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold">
              {selectedChat.name}
            </Typography>
            <IconButton onClick={() => setSelectedChat(null)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            This is the chat content with <strong>{selectedChat.name}</strong>.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ChatUI;
