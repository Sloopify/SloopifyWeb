import React from "react";
// ui materials
import { Box, IconButton, Stack, Typography, Button } from "@mui/material";
// Icons
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FeaturedVideoOutlinedIcon from "@mui/icons-material/FeaturedVideoOutlined";

const FriendsSideBar = ({ friendsView, setFriendsView }) => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* friends sidebar header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={"space-evenly"}
        spacing={2}
        pb={"12px"}
        mt={3}
        sx={{
          backgroundColor: "#fff",
          width: "100%",
          borderBottom: "2px solid #CBD5E1",
        }}
      >
        <IconButton
          sx={{
            border: "1px solid #CBD5E1",
            borderRadius: "1px solid #CBD5E1",
            position: "relative",
            width: "48px",
            height: "48px",
          }}
        >
          <ChatOutlinedIcon sx={{ color: "#14B8A6" }} />
          <Box
            component={"span"}
            sx={{
              width: "16px",
              height: "16px",
              position: "absolute",
              bottom: "0px",
              right: "-5px",
              backgroundColor: "#F43F5E",
              fontSize: "10px",
              color: "#fff",
              lineHeight: "15px",
              borderRadius: "50%",
              fontFamily: "Plus Jakarta Sans",
            }}
          >
            2
          </Box>
        </IconButton>
        <IconButton
          sx={{
            border: "1px solid #CBD5E1",
            borderRadius: "1px solid #CBD5E1",
            position: "relative",
            width: "48px",
            height: "48px",
          }}
        >
          <NotificationsNoneOutlinedIcon sx={{ color: "#475569" }} />
          <Box
            component={"span"}
            sx={{
              width: "16px",
              height: "16px",
              position: "absolute",
              bottom: "0px",
              right: "-5px",
              backgroundColor: "#F43F5E",
              fontSize: "10px",
              color: "#fff",
              lineHeight: "15px",
              borderRadius: "50%",
              fontFamily: "Plus Jakarta Sans",
            }}
          >
            1
          </Box>
        </IconButton>
        <IconButton
          sx={{
            border: "1px solid #CBD5E1",
            borderRadius: "1px solid #CBD5E1",
            position: "relative",
            width: "48px",
            height: "48px",
          }}
        >
          <FeaturedVideoOutlinedIcon sx={{ color: "#475569" }} />
          <Box
            component={"span"}
            sx={{
              width: "16px",
              height: "16px",
              position: "absolute",
              bottom: "0px",
              right: "-5px",
              backgroundColor: "#F43F5E",
              fontSize: "10px",
              color: "#fff",
              lineHeight: "15px",
              borderRadius: "50%",
              fontFamily: "Plus Jakarta Sans",
            }}
          >
            10
          </Box>
        </IconButton>
      </Stack>
      {/* friends title */}
      <Box
        sx={{
          padding: "32px 24px",
          backgroundColor: "#F8FAFC",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: "24px",
            fontWeight: "700",
            lineHeight: "32px",
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: "15px",
          }}
        >
          Friends
        </Typography>
      </Box>
      {/* friends Menu */}
      <Box sx={{  backgroundColor: "#F8FAFC" }}>
     
        <Box sx={{ padding: "0px 24px", display:'flex',
          flexDirection:'column',
          alignItems:'start',
          width:'100%'
         }}>
          <Button sx={{
            backgroundColor:'#FFFFFF',
            padding:'10px 12px',
            borderRadius:'4px',
            width:'100%',
            textAlign:'left',
            fontFamily: "Plus Jakarta Sans",
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "22px",
            color:'#1E293B',
            justifyContent:' flex-start'

          }} onClick={() => setFriendsView("Home")}>Home page</Button>
          <Button onClick={() => setFriendsView("all")}>All Friends</Button>
          <Button onClick={() => setFriendsView("requests")}>Requests</Button>
          <Button onClick={() => setFriendsView("mayKnow")}>
            People You May Know
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FriendsSideBar;
