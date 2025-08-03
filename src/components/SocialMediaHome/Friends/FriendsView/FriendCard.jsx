import React from "react";
// ui
import { Box, Typography, Button, Avatar } from "@mui/material";
// assets
import UserImage from "../../../../assets/Friends/userimg.png";

// Mutual friends
const avatars = [
  { name: "Alice", src: "https://i.pravatar.cc/150?img=1" },
  { name: "Bob", src: "https://i.pravatar.cc/150?img=2" },

];

const FriendCard = () => {
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
        src={UserImage}
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
          fadi danhash
        </Typography>

        {/* Mutual Friends */}
        <Box sx={{
            display:'flex',
            alignItems:'center'
        }}>
          <Box sx={{ display: "flex", alignItems: "center", width:'40px' }}>
            {avatars.map((avatar, index) => (
              <Avatar
                key={avatar.name}
                alt={avatar.name}
                src={avatar.src}
                sx={{
                  width: 18,
                  height: 18,
                  border: "2px solid white",
                  zIndex: avatars.length + index,
                  marginLeft: index === 0 ? 0 : '-8px', // overlap
                }}
              />
            ))}
          </Box>
          <Typography sx={{
            fontFamily:'Plus Jakarta Sans',
            fontSize:'10px',
            fontWeight:'400',
            color:'#475569'
          }}>20 Mutual Friends</Typography>
        </Box>
        {/* Button */}
        <Box sx={{marginTop:'15px'}}>
            {/* Accept / Request button */}
            <Button sx={{
                backgroundColor:'#14B8A6',
                color:'#FFFFFF',
                padding:'4pxx 10px',
                border:'1px solid #14B8A6',
                fontSize:'10px',
                fontWeight:'700',
                width:'100%'
            }}>Accept</Button>
            {/* Delete Button */}
            <Button sx={{
                backgroundColor:'#fff',
                color:'#475569',
                padding:'4pxx 10px',
                border:'1px solid #CBD5E1',
                fontSize:'10px',
                fontWeight:'700',
                width:'100%',
                marginTop:'5px'
            }}>Delete</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FriendCard;
