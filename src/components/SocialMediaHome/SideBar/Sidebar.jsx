import React, {useState} from 'react';
// ui
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Box, Alert, IconButton, Collapse, Typography,Button  } from '@mui/material';
import { TextField, InputAdornment } from '@mui/material';

// images
import logoImage from '../../../assets/Sidebar/Logomark.png'
import SearchIcon from '../../../assets/Sidebar/icons/search.svg';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '../../../assets/Sidebar/icons/warningIcon.svg';
import AvatarImg from '../../../assets/Sidebar/Avatar.png';
import LogoutIcon from '../../../assets/Sidebar/icons/logout.svg'

// List Images
import HomeIcon from '../../../assets/Sidebar/icons/HouseSimple.svg';
import CalendarIcon from '../../../assets/Sidebar/icons/calendar.svg';
import SchedualIcon from '../../../assets/Sidebar/icons/ClockCountdown.svg';
import AppointmentIcon from '../../../assets/Sidebar/icons/Cupe.svg';
import SubscriptionIcon from '../../../assets/Sidebar/icons/CreditCard.svg';
import SettingsIcon from '../../../assets/Sidebar/icons/GearSix.svg';
import SupportIcon from '../../../assets/Sidebar/icons/ChatTeardropDots.svg';


// List Item

const menuItems = [
  { text: 'Home', icon: HomeIcon },
  { text: 'My Calendar', icon: CalendarIcon },
  { text: 'Scheduled post', icon: SchedualIcon},
  { text: 'Appointment ', icon: AppointmentIcon },
  { text: 'Subscription ', icon: SubscriptionIcon },
  { text: 'Settings ', icon: SettingsIcon },
  { text: 'Help & Support ', icon: SupportIcon },
];


const drawerWidth = 340;

export default function Sidebar() {
    const [open, setOpen] = useState(true);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
          '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: '#F8FAFC',  // <-- here
             },
        
      }}
    >

      <Box sx={{ overflow: 'auto',
        background:'#F8FAFC',
        padding:'20px',
        '&::-webkit-scrollbar': { display: 'none' },
      }} >
                <Box
                component="img"
                src={logoImage}
                alt="Logo"
                sx={{
                    width: {
                    xs: '80px',
                    md: '80px',
                    },
                    maxWidth: '100%',
                    height: 'auto',
                    margin:'20px 0px'
                }}
                />

                {/* search input */}
                 <TextField
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    sx={{ 
                        width: '100%', 
                        display:'block',
                        border:'0px ',
                        '& .MuiInputBase-root':{
                            border:'1px solid #CBD5E1',
                            borderRadius:'123px',
                            color:'#475569'
                        },
                        '& .MuiInputBase-input':{
                            border:'0px'
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color:'#475569',
                            opacity:'1',
                            fontFamily:'Plus Jakarta Sans',
                            fontWeight:'500'
                        }
                    }}
                    
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                             <Box
                                component="img"
                                src={SearchIcon}
                                alt="Search Icon"
                                sx={{
                                    width:'20px',
                                    maxWidth: '100%',
                                    height: 'auto',
                                }}
                            />
                        </InputAdornment>
                        ),
                    }}
                />
                <List sx={{
                    margin:'40px 0px'
                }}>
                {menuItems.map((item) => (
                    <ListItem 
                    sx={{
                        margin:'10px 0px'
                    }}
                    button key={item.text}>
                    <ListItemIcon
                        sx={{
                            minWidth:'35px'
                        }}
                    >
                        <Avatar
                        src={item.icon}
                        alt={item.text}
                        sx={{ 
                            width: 24, 
                            height: 24,

                        }}
                        variant="square"
                        />
                    </ListItemIcon>
                   <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                        sx: {
                        fontFamily: 'Plus Jakarta Sans',
                        color: '#1E293B',
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '22px',
                        },
                    }}
                    />

                    </ListItem>
                ))}
                </List>
                 <Collapse in={open}>
                    <Alert
                        icon={false}
                        action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setOpen(false)}
                        >
                            <CloseIcon fontSize="inherit" sx={{color:'#94A3B8'}}/>
                        </IconButton>
                        }
                        sx={{
                        mb: 2,
                        borderRadius: '24px',
                        fontFamily: 'Plus Jakarta Sans',
                        background:'#FFFFFF',
                        padding:'16px'

                        }}
                    >     
                    <Box
                    component="img"
                    src={WarningIcon}
                    alt="Warning Icon"
                    sx={{
                        width: {
                        xs: '40px',
                        md: '40px',
                        },
                        maxWidth: '100%',
                        height: 'auto',
                       
                    }}
                    />
                    <Typography
                        sx={{
                            fontFamily:'Plus Jakarta Sans',
                            fontSize:'14px',
                            fontWeight:'400',
                            color:'#475569',
                            margin:'10px 0px'

                        }}
                    >
                        Enjoy unlimited access to our app with only a small price monthly.
                    </Typography>
                        <Button
                        sx={{
                            fontFamily:'Plus Jakarta Sans',
                            fontWeight:'700',
                            fontSize:'14px',
                            lineHeight:'20px',
                            color:'#475569',
                            padding:'0px',
                            marginTop:'10px'
                        }}
                         variant="text" onClick={() => setOpen(false)}>Dismiss</Button>
                         <Button
                            sx={{
                                fontFamily:'Plus Jakarta Sans',
                                fontWeight:'700',
                                fontSize:'14px',
                                lineHeight:'20px',
                                color:'#14B8A6',
                                padding:'0px',
                                marginTop:'10px',
                                paddingLeft:'20px'
                            }}
                            variant="text" >Go Pro</Button>

                    
                        
                    </Alert>
                </Collapse>

                {/* user logged in */}
                <Box
                component="div"
                sx={{
                    display:'flex',
                    marginTop:'20px',
                    paddingTop:'30px',
                    borderTop:'1px solid #E2E8F0'
                }}
                >
                
                 <Avatar src={AvatarImg} alt={'Avatar Img'}
                    sx={{ 
                        width: 40, 
                        height: 40,

                    }}
                    variant="circle"
                />
                <Box component="div"
                sx={{
                    paddingLeft:'10px'
                }}
                >
                <Typography
                    sx={{
                        color:'  #475569',
                        fontFamily:'Plus Jakarta Sans',
                        fontSize:'16px',
                        fontWeight:'700'
                    }}
                    >Azunyan U. Wu</Typography>
                
                <Typography
                    sx={{
                        color:'  #475569',
                        fontFamily:'Plus Jakarta Sans',
                        fontSize:'14px',
                        fontWeight:'400'
                    }}
                    >Basic Member</Typography>
                    
                </Box>
                <Box
                    component="img"
                    src={LogoutIcon}
                    alt="Logout Icon"
                    sx={{
                        width:'20px',
                        maxWidth: '100%',
                        height: 'auto',
                        display:'block',
                        marginLeft:'auto',
                        marginRight:'0px'
                        }}
                />
            </Box>

      </Box>
    </Drawer>
  );
}
