import React from "react";
// ui
import { Box, Typography, Button } from "@mui/material";
// components
import FriendCard from "./FriendCard";
// assests
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';




const HomeFriendsView = () => {
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
            <Box>
                <FriendCard />

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