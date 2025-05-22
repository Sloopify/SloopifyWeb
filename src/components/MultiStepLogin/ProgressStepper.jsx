import { Box } from '@mui/material';

const ProgressStepper = ({ activeStep, steps }) => {
  return (
    <Box sx={{ width: '100%', my: 4 , display:'flex', gap:'6px',justifyContent:'center',alignItems:'center'}}>
      {steps.map((_, index) => (
        <Box
          key={index}
          sx={{
            height: '8px',
           
            width:'36px',
            borderRadius: 5,
            backgroundColor: index <= activeStep ? '#14B8A6' : '#E2E8F0',
           
            transition: 'background-color 0.3s ease',
          }}
        />
      ))}
    </Box>
  );
};

export default ProgressStepper;
