import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import PromptResponse from '../components/PromptResponse';

const prompts = ["Story Topic", "Number of Pages for Story", "Cultural Details to Include", "Disability Details to Include", "Additional Details"];

const StartScreen = () => {
  const [responses, setResponses] = React.useState(Array(prompts.length).fill(''));

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const Instructions = () => {
    return (
      <Container sx={{ paddingTop: '30vh' }} display="flex" flexDirection="column">
        <Typography variant="h1" fontSize={'10vh'}>
          Share your Story Ideas
        </Typography>
        <Typography>
          Make sure to highlight the cultural and disability aspects you want to preserve!
        </Typography>
      </Container>
    )
  };

  const StoryPrompts = () => {
    return (
      <Container display="flex" flexDirection="column">
        {prompts.map((prompt, index) => (
          <div key={prompt}>
            <Typography>{prompt}</Typography>
            <PromptResponse
              prompt={prompt}
              value={responses[index]}
              onChange={(textValue) => handleResponseChange(index, textValue)}
            />
          </div>
        ))}
      </Container>
    );
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Box display="flex">
        <Box style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '35%', overflowY: 'auto' }}>
          <Instructions />
        </Box>
        <Box style={{ marginLeft: '50%', width: '55%', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
          <StoryPrompts />
          <Button sx={{ marginTop: 2 }} variant="contained">Generate Summary</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StartScreen;
