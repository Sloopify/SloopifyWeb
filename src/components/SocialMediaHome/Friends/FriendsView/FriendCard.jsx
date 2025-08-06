import React, { useState } from "react";
import API from "../../../../axios/axios";
// ui
import { Box, Typography, Button, Avatar } from "@mui/material";
// assets
import UserImage from "../../../../assets/Friends/userimg.png";

const ACCEPT_FRIENDSHIP_URL = "/api/v1/friends/accept-friend-request";
const DECLINE_FRIENDSHIP_URL = "/api/v1/friends/decline-friend-request";

const FriendCard = ({ request }) => {
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const handleAccept = async () => {
    try {
      setAcceptLoading(true);
      const response = await API.post(
        ACCEPT_FRIENDSHIP_URL,
        {
          friendship_id: request.id,
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
          friendship_id: request.id,
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
    <Box
      sx={{
        width: "150px",
        boxShadow: "0px 4px 4px 0px #00000040",
        borderRadius: "8px",
      }}
    >
      <Box
        component="img"
        src={request.image}
        sx={{
          width: "100%",
          height: "94px",
          objectFit: "cover",
          borderRadius: "8px 8px 0px 0px",
        }}
      />
      {/* contain */}
      <Box
        sx={{
          padding: "7px",
        }}
      >
        {/* Friend Name */}
        <Typography
          sx={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "600",
            fontSize: "14px",
            color: "#475569",
            margin: "0px 0px",
            textTransform: "capitalize",
          }}
        >
          {request.first_name} {request.last_name}
        </Typography>

        {/* Mutual Friends */}

        {request.mutual_friends.count !== 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "40px" }}>
              {request.mutual_friends.friends.map((avatar, index) => (
                <Avatar
                  key={avatar.name}
                  alt={avatar.name}
                  src={avatar.src}
                  sx={{
                    width: 18,
                    height: 18,
                    border: "2px solid white",
                    zIndex: request.mutual_friends.friends.length + index,
                    marginLeft: index === 0 ? 0 : "-8px", // overlap
                  }}
                />
              ))}
            </Box>
            <Typography
              sx={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: "10px",
                fontWeight: "400",
                color: "#475569",
              }}
            >
              {request.mutual_friends.count} Mutual Friends
            </Typography>
          </Box>
        )}
        {/* Button */}
        <Box sx={{ marginTop: "15px" }}>
          {/* Accept / Request button */}
          <Button
            onClick={handleAccept}
            sx={{
              backgroundColor: "#14B8A6",
              color: "#FFFFFF",
              padding: "4pxx 10px",
              border: "1px solid #14B8A6",
              fontSize: "10px",
              fontWeight: "700",
              width: "100%",
            }}
          >
            {acceptLoading ? "Accepting..." : "Accept"}
          </Button>
          {/* Delete Button */}
          <Button
            onClick={handleDecline}
            sx={{
              backgroundColor: "#fff",
              color: "#475569",
              padding: "4pxx 10px",
              border: "1px solid #CBD5E1",
              fontSize: "10px",
              fontWeight: "700",
              width: "100%",
              marginTop: "5px",
            }}
          >
            {declineLoading ? "Declining..." : "Decline"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FriendCard;
