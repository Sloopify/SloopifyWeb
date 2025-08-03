import React, {useState} from 'react';
// import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../../components/SocialMediaHome/SideBar/Sidebar';
import IconTabs from '../../components/SocialMediaHome/HomeBody/HomeBody';
import SideBarControl from '../../components/SocialMediaHome/RightSideBar/SideBarControl';
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

  const [activeTab, setActiveTab] = useState(1);
  const [friendsView, setFriendsView] = useState('all'); 

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };



  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar/>
      <IconTabs activeTab={activeTab} onTabChange={handleTabChange} friendsView={friendsView} setFriendsView={setFriendsView}/>
      <SideBarControl activeTab={activeTab} friendsView={friendsView} setFriendsView={setFriendsView}/>
    </Box>
  );
}
