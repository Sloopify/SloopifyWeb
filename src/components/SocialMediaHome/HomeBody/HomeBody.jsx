import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

// icons
import { ReactComponent as HomeIcon } from '../../../assets/Home/icons/home.svg';
import { ReactComponent as FriendsIcon } from '../../../assets/Home/icons/UsersThree.svg';
import { ReactComponent as StoreIcon } from '../../../assets/Home/icons/store.svg';
import { ReactComponent as VideoIcon } from '../../../assets/Home/icons/Video.svg';
// story component
import StoriesBar from '../Story/Story'; 
// Add Post Field Component
import AddPostField from '../AddPostField/AddPostFile';
import Post from '../PostBox/Post';
// Post data
import postsData from '../../../data/posts.json'






function SettingsContent() {
  return <div>Settings go here</div>;
}

function InfoContent() {
  return <div>Some information content</div>;
}

// Simple TabPanel helper
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

export default function IconTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '90%' }}>
      <Tabs value={value} onChange={handleChange}  variant="fullWidth"  centered sx={{ 
        '& .MuiTabs-list':{
          justifyContent:'space-between',
          marginTop:'30px'
        },
        '& .MuiTab-root': {
      borderBottom: '2px solid #CBD5E1',
    },
    '& .MuiTabs-indicator': {
      height:'0px',
      borderBottom: '2px solid #14B8A6', // active tab
    },

        
       }}>
        <Tab icon={<HomeIcon />} 
       
        aria-label="Home" />
        <Tab icon={<FriendsIcon />} aria-label="Friends" />
        <Tab icon={<StoreIcon />} aria-label="Store" />
        <Tab icon={<VideoIcon />} aria-label="Video" />

      </Tabs>

      <TabPanel value={value} index={0}sx={{ padding: 0 }}>
        <StoriesBar />
        <AddPostField />
         {postsData.map((post) => (
        <Post
          key={post.id}
          user={post.user}
          content={post.content}
          image={post.image}
          postedAt={post.postedAt}
          companyName={post.company}
          positio={post.position}
        />
      ))}
      
      </TabPanel>
      <TabPanel value={value} index={1}><SettingsContent /></TabPanel>
      <TabPanel value={value} index={2}><InfoContent /></TabPanel>
    </Box>
  );
}
