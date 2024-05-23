import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Instructions = ({ instructions }) => {
    // returns the instructions and welcome message
    return (
      <Container sx={{ width: '100%', marginBottom: '20px' }} display="flex" flexDirection="column">
        <Typography tabIndex={0} variant="h1">
          Intersectional Storyteller
        </Typography>
        <Typography tabIndex={0}>
          {instructions}
        </Typography>
      </Container>
    )
  };

export default Instructions;