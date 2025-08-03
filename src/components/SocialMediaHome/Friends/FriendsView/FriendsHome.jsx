import React from "react";
// ui 
import { Box } from "@mui/material";
// component 
import HomeFriendsView from "./HomeFriendsView";


const FriendsHome = ({friendsView, setFriendsView}) =>{
    return(
        <>
   
         <Box>
      {friendsView === 'Home' && (<HomeFriendsView />)}
      {friendsView === 'all' && <div>All Friends List</div>}
      {friendsView === 'requests' && <div>Friend Requests</div>}
      {friendsView === 'mayKnow' && <div>People You May Know</div>}
    </Box>
        </>
       
    )
}

export default FriendsHome;