import React, {useEffect} from 'react';
import { Alert, AlertTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { keyframes } from '@mui/system';

const slideUpFadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const VARIANT_STYLES = {
  success: {
    backgroundColor: '#d4edda',
    color: '#22C55E',
    border: '1px solid #c3e6cb',
    borderRadius:'16px',
  },
  error: {
    backgroundColor: '#FFF1F2',
    color: '#F43F5E',
    border: '1px solid #FECDD3',
    borderRadius:'16px',
  },
  info: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
    border: '1px solid #bee5eb',
    borderRadius:'16px',
  },
  warning: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeeba',
    borderRadius:'16px',
  },
  custom: {
    backgroundColor: '#e2e3e5',
    color: '#383d41',
    border: '1px solid #d6d8db',
  },
};

const AlertMessage = ({
  severity,
  children,
  onClose,
  showTitle = true,
  title,
}) => {
  const variantStyle = VARIANT_STYLES[severity] || VARIANT_STYLES.info;

    useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose(); // Trigger the close function
    }, 5000); // 5000ms = 5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [onClose]);

 
  const capitalized = severity
    ? severity.charAt(0).toUpperCase() + severity.slice(1)
    : '';

  return (
    <Alert
      icon={<ErrorOutlineIcon sx={{ color: variantStyle.color }} />}
      sx={{
        mb: 2,
        width:{
            xs:'250px',
            md:'600px'},
        border: variantStyle.border,
        backgroundColor: variantStyle.backgroundColor,
        borderRadius:variantStyle.borderRadius,
        color: '#475569',
        fontSize:'14px',
        fontWeight:'600',
        fontFamily:'Plus Jakarta Sans',
        position:'fixed',
        bottom:'40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex:'999',
        animation: `${slideUpFadeIn} 0.5s ease forwards`,

      }}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onClose}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      {showTitle && <AlertTitle sx={{ 
        color: '#1E293B',
        fontSize:'16px',
        fontWeight:'800',
        fontFamily:'Plus Jakarta Sans',
       }}>{title || capitalized}</AlertTitle>}
      {children}
    </Alert>
  );
};

export default AlertMessage;
