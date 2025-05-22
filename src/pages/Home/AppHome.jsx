import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../../components/SocialMediaHome/SideBar/Sidebar';
import IconTabs from '../../components/SocialMediaHome/HomeBody/HomeBody';
import ChatHome from '../../components/SocialMediaHome/Chat/Chat';

export default function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <IconTabs />
      <ChatHome />

      
    </Box>
  );
}
