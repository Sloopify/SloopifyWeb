import React, { useState, useEffect } from "react";
// ui materials
import { Box, IconButton, Stack, Typography, Button } from "@mui/material";

// api

// Icons
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FeaturedVideoOutlinedIcon from "@mui/icons-material/FeaturedVideoOutlined";
import RequestIcon from "../../../../assets/Friends/request-icon.svg";
import PeopleYouKnow from "../../../../assets/Friends/may-know.svg";
import DeletedRequestIcon from "../../../../assets/Friends/deleted-request.svg";
import AllFriendsIcon from "../../../../assets/Friends/all-friends.svg";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

// components
import AllFriendsSidebar from "./AllFriendsSideBar";
import FriendsRequestSidebar from "./FriendsRequestSidebar";
import SentFriendsRequestSidebar from "./SentFriendsRequestSidebar";

const FriendsSideBar = ({ friendsView, setFriendsView }) => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* friends sidebar header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={"space-evenly"}
        spacing={2}
        pb={"13px"}
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

      {/* Home Page view sidebar */}
      {friendsView === "Home" && (
        <>
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
          <Box sx={{ backgroundColor: "#F8FAFC", padding: "0px 24px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                width: "100%",
                gap: 2,
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#FFFFFF",
                  padding: "10px 12px",
                  borderRadius: "4px",
                  width: "90%",
                  textAlign: "left",
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "22px",
                  color: "#1E293B",
                  justifyContent: " flex-start",
                  textTransform: "capitalize",
                }}
                onClick={() => setFriendsView("Home")}
              >
                Home page
              </Button>
              <Button
                onClick={() => setFriendsView("Friends_request")}
                sx={{
                  fontFamily: "Plus Jakarta Sans",
                  width: "90%",
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "22px",
                  color: "#1E293B",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={RequestIcon}
                    sx={{ width: "24px", marginRight: "10px" }}
                  />
                  Friends request
                </Box>
                <ArrowForwardIosOutlinedIcon sx={{ color: "#94A3B8" }} />
              </Button>
              <Button
                onClick={() => setFriendsView("Sent_Requests")}
                sx={{
                  fontFamily: "Plus Jakarta Sans",
                  width: "90%",
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "22px",
                  color: "#1E293B",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={RequestIcon}
                    sx={{ width: "24px", marginRight: "10px" }}
                  />
                  Sent Requests
                </Box>
                <ArrowForwardIosOutlinedIcon sx={{ color: "#94A3B8" }} />
              </Button>
              {/* <Button
                onClick={() => setFriendsView("People_You_May_Know")}
                sx={{
                  fontFamily: "Plus Jakarta Sans",
                  width: "90%",
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "22px",
                  color: "#1E293B",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={PeopleYouKnow}
                    sx={{ width: "24px", marginRight: "10px" }}
                  />
                  People You May Know
                </Box>
                <ArrowForwardIosOutlinedIcon sx={{ color: "#94A3B8" }} />
              </Button> */}
              {/* <Button
                onClick={() => setFriendsView("Deleted_Requests")}
                sx={{
                  fontFamily: "Plus Jakarta Sans",
                  width: "90%",
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "22px",
                  color: "#1E293B",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={DeletedRequestIcon}
                    sx={{ width: "24px", marginRight: "10px" }}
                  />
                  Deleted Requests
                </Box>
                <ArrowForwardIosOutlinedIcon sx={{ color: "#94A3B8" }} />
              </Button> */}
              <Button
                onClick={() => setFriendsView("All_Friends")}
                sx={{
                  fontFamily: "Plus Jakarta Sans",
                  width: "90%",
                  fontSize: "16px",
                  fontWeight: "700",
                  lineHeight: "22px",
                  color: "#1E293B",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={AllFriendsIcon}
                    sx={{ width: "24px", marginRight: "10px" }}
                  />
                  All Friends
                </Box>
                <ArrowForwardIosOutlinedIcon sx={{ color: "#94A3B8" }} />
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Friend Request or Friends' suggestions */}
      {friendsView === "Friends_request" && (
        <FriendsRequestSidebar
          friendsView={friendsView}
          setFriendsView={setFriendsView}
        />
      )}

      {/* Friend Request or Friends' suggestions */}
      {friendsView === "All_Friends" && (
        <AllFriendsSidebar
          friendsView={friendsView}
          setFriendsView={setFriendsView}
        />
      )}

      {/* Friend Request or Friends' suggestions */}
      {friendsView === "Sent_Requests" && (
        <SentFriendsRequestSidebar
          friendsView={friendsView}
          setFriendsView={setFriendsView}
        />
      )}
    </Box>
  );
};

export default FriendsSideBar;
