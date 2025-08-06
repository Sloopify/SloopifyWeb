import React, { useState, useEffect } from "react";
// ui materials
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WestIcon from "@mui/icons-material/West";
import SearchIcon from "../../../../assets/Sidebar/icons/search.svg";
import UnfriendIcon from "../../../../assets/Friends/unfriend.svg";
import BlockIcon from "../../../../assets/Friends/block.svg";

import API from "../../../../axios/axios";

const FETCH_FRIENDS_URL = "/api/v1/friends/get-friends";
const UNFRIEND_URL = "/api/v1/friends/delete-friend-ship";
const BLOCK_URL = "/api/v1/friends/block-friend";

const AllFriendsSidebar = ({ friendsView, setFriendsView }) => {
  const [friends, setFriends] = useState([]);

  const [totalFriends, setTotalFriends] = useState(0);
  const [friendSearchTerm, setFriendSearchTerm] = useState("");
  const [friendSearchResults, setFriendSearchResults] = useState([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [friendName, setFriendName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unfriendLoading, setUnfriendLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);

  // Fetch All Friend
  const fetchAllFriends = async () => {
    try {
      const response = await API.post(
        FETCH_FRIENDS_URL,
        {
          page: "1",
          per_page: "3",
          sort_by: "name", // or "date_sent", "status"
          sort_order: "asc", // or "desc"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setFriends(response.data.data.friends);
        setTotalFriends(response.data.data.total_friends);
        console.log(response.data.data.requests);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (friendsView === "All_Friends") {
      fetchAllFriends();
    }
  }, [friendsView]);

  // Search Friends
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (friendSearchTerm.trim()) {
        searchFriends(friendSearchTerm);
      } else {
        fetchAllFriends();
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [friendSearchTerm]);

  const searchFriends = async (term) => {
    try {
      setLoading(true);
      const response = await API.post(
        "/api/v1/friends/search-friends",
        {
          search: term,
          page: 1,
          per_page: 3,
          sort_by: "name",
          sort_order: "asc",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setFriendSearchResults(response.data.data.friends);
        setSearchTotal(response.data.data.total_friends);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoreClick = (event, friendId, friendFirstName) => {
    setAnchorEl(event.currentTarget);
    setSelectedFriendId(friendId);
    setFriendName(friendFirstName);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedFriendId(null);
  };

  const open = Boolean(anchorEl);

  const handleUnfriend = async () => {
    setUnfriendLoading(true);
    try {
      const res = await API.post(
        UNFRIEND_URL,
        {
          friend_id: selectedFriendId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Unfriended successfully:", res.data);

      handleClose();
      fetchAllFriends();

      setFriends((prev) =>
        prev.filter((friend) => friend.id !== selectedFriendId)
      );
    } catch (error) {
      console.error("Failed to unfriend:", error);
    } finally {
      setUnfriendLoading(false);
    }
  };

  const handleBlock = async () => {
    setBlockLoading(true);
    try {
      const response = await API.post(
        BLOCK_URL,
        {
          friend_id: selectedFriendId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Friend blocked successfully", response.data);
      fetchAllFriends();
      // Optional: update UI or close popover
      handleClose();
    } catch (error) {
      console.error("Failed to block friend:", error);
    } finally {
      setBlockLoading(true);
    }
  };

  return (
    <>
      <Box sx={{ padding: "32px 24px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "20px",
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
              All Friends
            </Typography>

            <Typography
              sx={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "32px",
                color: "#64748B",
              }}
            ></Typography>
          </Box>
          <IconButton onClick={() => setFriendsView("Home")}>
            <WestIcon sx={{ color: "#475569" }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: "15px",
            marginBottom: "15px",
          }}
        >
          {/* search input */}
          <TextField
            value={friendSearchTerm}
            onChange={(e) => setFriendSearchTerm(e.target.value)}
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{
              width: "100%",
              display: "block",
              border: "0px ",
              "& .MuiInputBase-root": {
                border: "1px solid #CBD5E1",
                borderRadius: "123px",
                color: "#475569",
                width: "100%",
              },
              "& .MuiInputBase-input": {
                border: "0px",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#475569",
                opacity: "1",
                fontFamily: "Plus Jakarta Sans",
                fontWeight: "500",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    component="img"
                    src={SearchIcon}
                    alt="Search Icon"
                    sx={{
                      width: "20px",
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Typography
          sx={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: "16px",
            fontWeight: "600",
            lineHeight: "22px",
            color: "#1E293B",
            textTransform: "capitalize",
          }}
        >
          {friendSearchTerm.trim()
            ? `${searchTotal} Friends Found`
            : `${totalFriends} Friends`}
        </Typography>
        {/* Request Card */}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (friendSearchTerm ? friendSearchResults : friends).length > 0 ? (
          (friendSearchTerm ? friendSearchResults : friends).map((friend) => (
            <Box
              key={friend.id}
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Avatar src={friend.image} sx={{ width: 60, height: 60 }} />
                <Box>
                  <Typography sx={{ fontWeight: 500 }}>
                    {friend.first_name} {friend.last_name}
                  </Typography>
                  {friend.mutual_friends?.count > 0 && (
                    <Typography sx={{ fontSize: "14px", color: "#475569" }}>
                      {friend.mutual_friends.count} Mutual Friends
                    </Typography>
                  )}
                </Box>
              </Box>
              <IconButton
                onClick={(e) =>
                  handleMoreClick(e, friend.id, friend.first_name)
                }
              >
                <MoreVertIcon sx={{ color: "#000000" }} />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography>No friends found</Typography>
        )}
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            borderRadius: "24px 0px 24px 24px",
            width: "290px",
            padding: "10px",
          },
        }}
      >
        <List>
          <ListItem button onClick={handleUnfriend} sx={{ cursor: "pointer" }}>
            <ListItemText
              primaryTypographyProps={{
                sx: {
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "700",
                  fontSize: "16px",
                  color: "#475569",
                },
              }}
              primary={
                unfriendLoading
                  ? `Unfriending ${friendName ?? ""}...`
                  : `Unfriend ${friendName ?? ""}`
              }
            />
            <ListItemIcon sx={{ width: 24, minWidth: "30px" }}>
              <Box component="img" src={UnfriendIcon} sx={{ width: 20 }} />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={handleBlock} sx={{ cursor: "pointer" }}>
            <ListItemText
              primaryTypographyProps={{
                sx: {
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: "700",
                  fontSize: "16px",
                  color: "#475569",
                },
              }}
              primary={
                blockLoading
                  ? `Blocking ${friendName ?? ""}...`
                  : `Block ${friendName ?? ""}`
              }
            />
            <ListItemIcon sx={{ width: 24, minWidth: "30px" }}>
              <Box component="img" src={BlockIcon} sx={{ width: 20 }} />
            </ListItemIcon>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default AllFriendsSidebar;
