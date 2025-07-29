import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../../components/SocialMediaHome/SideBar/Sidebar';
import IconTabs from '../../components/SocialMediaHome/HomeBody/HomeBody';
import ChatHome from '../../components/SocialMediaHome/Chat/Chat';
// import { useUser } from '../../context/UserContext';



export default function Layout() {

  // const { userData } = useUser();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const completed_on_boarding = {
  //     interests: userData.interests,
  //     gender: userData.gender,
  //     birthday: userData.birthday,
  //     image: userData.image,
  //   };

  //   const hasIncompleteStep = completed_on_boarding
  //     ? Object.values(completed_on_boarding).some((step) => step === false)
  //     : false;

  //   if (hasIncompleteStep) {
  //     navigate('/user-info');
  //   }
  // }, [userData, navigate]);


  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <IconTabs />
      <ChatHome />

      
    </Box>
  );
}
