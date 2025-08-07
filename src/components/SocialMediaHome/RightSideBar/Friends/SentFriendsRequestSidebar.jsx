import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Button, Avatar } from "@mui/material";
import WestIcon from "@mui/icons-material/West";

// Alert
import AlertMessage from "../../../Alert/alertMessage";

import API from "../../../../axios/axios";

const SENT_Friends_Request_API = "/api/v1/friends/get-sent-requests";
const CANCEL_FRIEND_REQUEST_API = "/api/v1/friends/cancel-friend-request";

const SentFriendsRequestSidebar = ({ friendsView, setFriendsView }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch Friend Requests
  const fetchSentFriendRequests = async () => {
    try {
      const response = await API.post(
        SENT_Friends_Request_API,
        {
          page: "1",
          per_page: "3",
          sort_by: "name",
          sort_order: "asc",
          status: "pending",
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
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (friendsView === "Sent_Requests") {
      fetchSentFriendRequests();
    }
  }, [friendsView]);

  const handleCancel = async (friend_id) => {
    try {
      setAcceptLoading(true);
      const response = await API.post(
        CANCEL_FRIEND_REQUEST_API,
        { friend_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Friend request accepted:", response.data);
      setSuccess(response.data.message);
      fetchSentFriendRequests();
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setAcceptLoading(false);
    }
  };

  //   try {
  //     setDeclineLoading(true);
  //     const response = await API.post(
  //       DECLINE_FRIENDSHIP_URL,
  //       { friendship_id },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log("Friend request Declined:", response.data);
  //     setSuccess(response.data.message);
  //     fetchFriendRequests();
  //   } catch (error) {
  //     console.error("Error declining friend request:", error);
  //     setError(error.message || "Something went wrong");
  //   } finally {
  //     setDeclineLoading(false);
  //   }
  // };

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
            sx={{ fontSize: "24px", fontWeight: "600", color: "#1E293B" }}
          >
            Sent Requests
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "#64748B" }}>
            {requests.length} Sent request{requests.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <IconButton onClick={() => setFriendsView("Home")}>
          <WestIcon sx={{ color: "#475569" }} />
        </IconButton>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : requests.length > 0 ? (
        requests.map((request) => {
          const friend_id = request.id;
          return (
            <Box
              key={request.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                marginTop: "20px",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Avatar src={request.image} sx={{ width: 60, height: 60 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "500",
                      color: "#000",
                      textTransform: "capitalize",
                    }}
                  >
                    {request?.first_name} {request?.last_name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {request.status === "pending" && (
                      <Button
                        onClick={() => handleCancel(friend_id)}
                        sx={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: "#475569",
                          border: "1px solid #CBD5E1",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          backgroundColor: "#fff",
                          width: "240px",
                          textTransform: "capitalize",
                        }}
                      >
                        {acceptLoading
                          ? "Canceling request..."
                          : "Cancel request"}
                      </Button>
                    )}
                    {/* <Button
                    
                      sx={{
                        fontSize: "12px",
                        fontWeight: "500",
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
                    </Button> */}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })
      ) : (
        <Typography>No friend requests found</Typography>
      )}

      {error && (
        <AlertMessage
          severity="error"
          onClose={() => setError("")}
          title="Error"
        >
          {error}
        </AlertMessage>
      )}

      {success && (
        <AlertMessage severity="success" onClose={() => setSuccess("")}>
          {success}
        </AlertMessage>
      )}
    </Box>
  );
};

export default SentFriendsRequestSidebar;
