import React, {useState, useEffect} from "react";
// ui
import { Box, Typography, Button } from "@mui/material";
// components
import FriendCard from "./FriendCard";
// assests
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// axioS
import API from "../../../../axios/axios";

const Friends_Request_API = '/api/v1/friends/get-received-requests';





const HomeFriendsView = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

   const fetchFriendRequests = async () => {
  try {
    const response = await API.post(
      Friends_Request_API,
      {
        page: "1",
        per_page: "3",
        sort_by: "name",       // or "date_sent", "status"
        sort_order: "asc",     // or "desc"
        status: "pending"      // or "declined", "cancelled", "all"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (response.data.success) {
      setRequests(response.data.data.requests);
        console.log(response.data.data.requests)
    }
  
  } catch (error) {
    console.error("Error fetching friend requests:", error);
  } finally {
    setLoading(false);
    
  }
};


    useEffect(() => {
        fetchFriendRequests();
    }, []);
    


    return(
        <>
        <Box sx={{borderBottom:'1px solid #CACACA'}}>
            <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'10px 0px'}}>
                <Typography sx={{
                    fontFamily:'Plus Jakarta Sans',
                    fontSize:'24px',
                    fontWeight:'600',
                    lineHeight:'32px',
                    color:'#000000'
                }}>Friends request</Typography>
                <Button sx={{
                    fontFamily:'Plus Jakarta Sans',
                    fontSize:'14px',
                    fontWeight:'600',
                    lineHeight:'32px',
                    color:'#64748B'
                }}>View All</Button>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {loading ? (
                <Typography>Loading...</Typography>
                ) : requests.length > 0 ? (
                requests.map((req) => <FriendCard key={req.id} request={req} fetchFriendRequests={fetchFriendRequests} friendship_id={req.friendship_info.friendship_id}/>)
                ) : (
                <Typography>No friend requests</Typography>
                )}
            </Box>
            <Box sx={{width:'100%'}}>
                <Button sx={{
                    fontFamily:'Plus Jakarta Sans',
                    fontSize:'14px',
                    fontWeight:'700',
                    lineHeight:'32px',
                    color:'#475569',
                    display:'block',
                    margin:'20px auto'
                }}

                >View more <ExpandMoreIcon sx={{width:'20px', color:'#94A3B8', marginLeft:'10px'}}/></Button>
            </Box>
        </Box>
        </>
    )
}

export default HomeFriendsView;