import React, {useState, useEffect} from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Button,
  Avatar,

} from "@mui/material";
import WestIcon from "@mui/icons-material/West";



import API from "../../../../axios/axios";

const Friends_Request_API = "/api/v1/friends/get-received-requests";
const ACCEPT_FRIENDSHIP_URL = "/api/v1/friends/accept-friend-request";
const DECLINE_FRIENDSHIP_URL = "/api/v1/friends/decline-friend-request";



const FriendsRequestSidebar = ({friendsView, setFriendsView}) => {
      const [requests, setRequests] = useState([]);
      const [loading, setLoading] = useState(true);
      const [acceptLoading, setAcceptLoading] = useState(false);
      const [declineLoading, setDeclineLoading] = useState(false);

        // Fetch Friend Requests
  const fetchFriendRequests = async () => {
    try {
      const response = await API.post(
        Friends_Request_API,
        {
          page: "1",
          per_page: "3",
          sort_by: "name", // or "date_sent", "status"
          sort_order: "asc", // or "desc"
          status: "pending", // or "declined", "cancelled", "all"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setRequests(response.data.data.requests);
        console.log(response.data.data.requests);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (friendsView === "Friends_request") {
      fetchFriendRequests();
    }
  }, [friendsView]);


  const handleAccept = async () => {
    try {
      setAcceptLoading(true);
      const response = await API.post(
        ACCEPT_FRIENDSHIP_URL,
        {
          friendship_id: requests.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Friend request accepted:", response.data);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleDecline = async () => {
    try {
      setDeclineLoading(true);
      const response = await API.post(
        DECLINE_FRIENDSHIP_URL,
        {
          friendship_id: requests.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Friend request Declined:", response.data);
    } catch (error) {
      console.error("Error Declined friend request:", error);
    } finally {
      setDeclineLoading(false);
    }
  };
    return (
          <Box sx={{ padding: "32px 24px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: "20px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "Plus Jakarta Sans",
                          fontSize: "24px",
                          fontWeight: "600",
                          lineHeight: "32px",
                          color: "#1E293B",
                        }}
                      >
                        Friends request
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Plus Jakarta Sans",
                          fontSize: "14px",
                          fontWeight: "500",
                          lineHeight: "32px",
                          color: "#64748B",
                        }}
                      >
                        {requests.length} Friend request
                        {requests.length !== 1 ? "s" : ""}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => setFriendsView("Home")}>
                      <WestIcon sx={{ color: "#475569" }} />
                    </IconButton>
                  </Box>
                  {/* Request Card */}
        
                  {loading ? (
                    <Typography>Loading...</Typography>
                  ) : requests.length > 0 ? (
                    requests.map((request) => (
                      <Box
                        key={request.id}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2",
                          width: "100%",
                          marginTop: "20px",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Avatar src={request.image} sx={{ width: 60, height: 60 }} />
                          <Box
                            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                          >
                            <Typography
                              sx={{
                                fontFamily: "Plus Jakarta Sans",
                                fontSize: "15px",
                                fontWeight: "500",
                                lineHeight: "22px",
                                color: "#000000",
                                textTransform: "capitalize",
                              }}
                            >
                              {request?.first_name} {request?.last_name}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                onClick={handleAccept}
                                sx={{
                                  fontFamily: "Plus Jakarta Sans",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  lineHeight: "16px",
                                  color: "#FFFFFF",
                                  border: "1px solid #14B8A6",
                                  borderRadius: "8px",
                                  padding: "4px 10px",
                                  backgroundColor: "#14B8A6",
                                  width: "120px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {acceptLoading ? "Accepting..." : "Accept"}
                              </Button>
                              <Button
                                onClick={handleDecline}
                                sx={{
                                  fontFamily: "Plus Jakarta Sans",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  lineHeight: "16px",
                                  color: "#475569",
                                  border: "1px solid #CBD5E1",
                                  borderRadius: "8px",
                                  padding: "4px 10px",
                                  backgroundColor: "#fff",
                                  width: "120px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {declineLoading ? "Declining..." : "Decline"}
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography>No friend requests found</Typography>
                  )}
                </Box>
    )
}


export default FriendsRequestSidebar;