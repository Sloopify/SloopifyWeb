import React from "react";
// ui
import { Box } from "@mui/material";
// component
import HomeFriendsView from "./HomeFriendsView";
import ProfilePreview from "./ProfilePreview";

const FriendsHome = ({ friendsView, setFriendsView }) => {
  return (
    <>
      <Box>
        {friendsView === "Home" && <HomeFriendsView />}
        {friendsView === "Friends_request" && <ProfilePreview />}
        {friendsView === "Sent_Requests" && <ProfilePreview />}
        {friendsView === "requests" && <div>Friend Requests</div>}
        {friendsView === "All_Friends" && <ProfilePreview />}
      </Box>
    </>
  );
};

export default FriendsHome;
