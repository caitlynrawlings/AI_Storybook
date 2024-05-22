import React, { useEffect } from 'react';
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
  useEffect(() => {
    document.title = "Intersectional Storyteller Start";
  }, []);

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
        <Typography tabIndex={0} variant="h1" fontSize={'10vh'}>
          Share your Story Ideas
        </Typography>
        <Typography tabIndex={0}>
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
            <Typography variant='h2' paddingBottom='10px' paddingTop='30px'>{prompt}</Typography>
            <PromptResponse
              sx={{
                width: '100%',
               }}
              prompt={prompt}
              value={responses[index]}
              onChange={(textValue) => handleResponseChange(index, textValue)}
            />
          </div>
        ))}
      </Container>
    );
  };

  const GenerateStoryButton = ({ sx }) => {
    // handles logic for sending user input to gpt and going to edit screen
    const navigateToEditScreen = () => {
      navigate("/edit");
    }

    return (
        <Button sx={{...sx}} onClick={navigateToEditScreen} label='generate story'/>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row'}}>
      <Box sx={{ display: 'flex', width: '35%', overflowY: 'auto' }}>
        <Instructions />
      </Box>
      <Box sx={{ display: 'flex', width: '65%', overflowY: 'auto', flexDirection: 'column',  alignItems: 'flex-start', marginTop: '20px', marginBottom: '40px', }}>
        <ClearButton onClick={clearAllInputs} label="clear all inputs"/>
        <StoryPrompts sx={{ width: '100%' }}/>
        <GenerateStoryButton sx={{ flexGrow: 0, marginTop: '30px' }}/>
      </Box>
    </Box>
  );
};

export default StartScreen;
