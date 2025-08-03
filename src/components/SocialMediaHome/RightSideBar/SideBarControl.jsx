import React from "react";
// sidebars
import ChatHome from "./Chat/Chat";
import FriendsSideBar from "./Friends/FriendsSideBar";

export default function SideBarControl({ activeTab, friendsView, setFriendsView }) {
  const sidebars = [
    <ChatHome key="home" />,
    <FriendsSideBar key="friends" friendsView={friendsView} setFriendsView={setFriendsView}/>,
  ];

  return (
    <div style={{ width: '25%' }}>
      {sidebars[activeTab]}
    </div>
  );
}