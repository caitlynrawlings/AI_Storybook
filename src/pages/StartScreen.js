import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '../components/Button';
import ClearButton from '../components/ClearButton';
import PromptResponse from '../components/PromptResponse';
import { useNavigate } from "react-router-dom";

// prompts about story for user to fill in
const prompts = ["Story Topic", "Number of Pages for Story", "Cultural Details to Include", "Disability Details to Include", "Additional Details"];

// Returns the first screen users see when using the app where the welcome message and initial prompts are
const StartScreen = () => {

  const navigate = useNavigate()
  const [responses, setResponses] = React.useState(Array(prompts.length).fill(''));  // user responses to prompts

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const clearAllInputs = () => {
    setResponses(Array(prompts.length).fill(''));
  };

  const Instructions = () => {
    // returns the instructions and welcome message
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
    // returns all the prompts and response boxes
    return (
      <Container display="flex" flexDirection="column">
        {prompts.map((prompt, index) => (
          <div key={prompt}>
            <Typography variant='h2' padding='10px'>{prompt}</Typography>
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

  const GenerateStoryButton = () => {
    // handles logic for sending user input to gpt and going to edit screen
    const navigateToEditScreen = () => {
      navigate("/edit");
    }

    return (
        <Button onClick={navigateToEditScreen} label='generate story'/>
    )
  }

  return (
    <Container maxWidth="sm" minheight='100vh'>
      <Box display="flex">
        <Box style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '35%', overflowY: 'auto' }}>
          <Instructions />
        </Box>
        <Box style={{ marginLeft: '50%', width: '55%', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
          <ClearButton onClick={clearAllInputs} label="clear all inputs"/>
          <StoryPrompts />
          <GenerateStoryButton />
        </Box>
      </Box>
    </Container>
  );
};

export default StartScreen;
