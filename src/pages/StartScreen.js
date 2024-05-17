import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '../components/Button';
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
            <Typography variant='h2'>{prompt}</Typography>
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

  const DownloadButton = () => {
    // handles logic for sending user input to gpt and going to edit screen
    // TODO:
    return (
        <Button label='generate story'/>
    )
  }

  return (
    <Container maxWidth="sm" minHeight='100vh'>
      <Box display="flex">
        <Box style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '35%', overflowY: 'auto' }}>
          <Instructions />
        </Box>
        <Box style={{ marginLeft: '50%', width: '55%', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
          {/* TODO: add clear input button */}
          <StoryPrompts />
          <DownloadButton />
        </Box>
      </Box>
    </Container>
  );
};

export default StartScreen;
