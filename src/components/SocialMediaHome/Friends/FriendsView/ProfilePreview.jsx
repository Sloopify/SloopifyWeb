import React from "react";
// UI
import { Box, Typography} from "@mui/material";
import ProfileViewImage from '../../../../assets/Friends/profile-view.png';


const ProfilePreview = () => {
    return(
        <>
        {/* Preview */}
        <Box sx={{display:'flex',alignItems:'center',minHeight:'90vh',
            flexDirection:'column',justifyContent:'center'
            
        }}>
            <Typography sx={{
                   fontFamily: "Plus Jakarta Sans",
                    fontSize: "30px",
                    fontWeight: "600",
                    lineHeight: "44px",
                    color: "#334155",
            }}>Select people's names to preview their profile.</Typography>
            <Box component='img' src={ProfileViewImage} sx={{width:'350px'}}/>
        </Box>
        </>
    )
}

export default ProfilePreview;