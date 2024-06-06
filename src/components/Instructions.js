import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Instructions = ({ instructions }) => {
  // returns title and given instructions below it
  return (
    <Box sx={{ width: '100%', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography tabIndex={0} variant="h1">
        Intersectional Storyteller
      </Typography>
      <Typography tabIndex={0}>
        {instructions}
      </Typography>
    </Box>
  );
};

export default Instructions;
