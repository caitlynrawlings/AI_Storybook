import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Instructions from '../components/Instructions';
import Button from '../components/Button';
import ClearButton from '../components/ClearButton';
import PromptResponse from '../components/PromptResponse';
import { useNavigate } from "react-router-dom";

const storyGenerationEndpoint = "http://127.0.0.1:5000/generate-story";
const sectionsPrompts = new Map(Object.entries({
  "Story Settings": ["Target Age of Audience", "Word count (optional)"],
  "Building the Main Character": ["Age of the character", "Gender", "Race/ethnicity", "Disability"],
  "Story Description": ["Enter Story Description", "Set-up (optional)", "Inciting incident (optional)",
    "Increasing action (optional)", "Climax (optional)", "Subsiding action (optional)", "Resolution (optional)"],
  "Representation": ["Cultural Representation", "Disability Representation"]
}));

// Returns the first screen users see when using the app where the welcome message and initial prompts are
const StartScreen = () => {

  const initializeState = (prompts) => {
    const state = {};
    Array.from(prompts.values()).flat().forEach((value) => {
      state[value] = "";
    });
    return state;
  };

  const navigate = useNavigate()
  const [responses, setResponses] = React.useState(initializeState(sectionsPrompts));  // user responses to prompts. maps (prompt : user response)

  useEffect(() => {
    document.title = "Intersectional Storyteller Start";
  }, []);

  const handleResponseChange = (prompt, value) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [prompt]: value
    }));
  };

  const clearAllInputs = () => {
    setResponses(initializeState(sectionsPrompts));
  };

  const Sections = () => {
    // returns all the sections of user prompts
    return (
      <Container sx={{ width: '100%', display: "flex", flexDirection: "column"}}>
        {Array.from(sectionsPrompts).map(([section, prompts], index) => (
          <Section key={index} header={section} prompts={prompts}/>
        ))}
      </Container>
    );
  };

  const Section = ({header, prompts}) => {
    // returns all the prompts and response boxes for a section and section header
    return (
      <Container sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography tabIndex={0} variant='h2' sx={{marginBottom: '10px', marginTop: '30px'}}>{header}</Typography>
        {prompts.map((prompt, index) => (
          <Container key={prompt} sx={{ marginBottom: '10px', marginTop: '10px' }}>
            <Typography tabIndex={0} variant='body2' sx={{ marginBottom: '10px' }}>{prompt}</Typography>
            <PromptResponse
              sx={{
                width: '100%',
              }}
              prompt={prompt}
              value={responses[prompt]}
              onChange={(textValue) => handleResponseChange(prompt, textValue)}
            />
          </Container>
        ))}
      </Container>
    );
  };

  const GenerateStoryButton = ({ sx }) => {
    // handles logic for sending user input to gpt and going to edit screen
    const navigateToEditScreen = () => {
      const requestData = {"sampleData": "1"}

      // wait until response is generated from GPT
      fetch(storyGenerationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
        .then(response => response.json())
        .then(data => {
          // send the data to the EditScreen component
          navigate('/edit', {state: {'story': data['story']}});
        }).catch(error => { console.error('Error:', error); });
   }

    return (
        <Button sx={{...sx}} onClick={navigateToEditScreen} label='generate story'/>
    )
  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start", textAlign: 'left', paddingLeft: '10vh', paddingRight: '10vh', paddingBottom: '50px', paddingTop: '30px', width: '100%' }}>
      <Instructions instructions={"Share your Story Ideas: Make sure to highlight the cultural and disability aspects you want to preserve!"} />
      <ClearButton onClick={clearAllInputs} label={"clear all input"}/>
      <Sections />
      <GenerateStoryButton sx={{ marginTop: '30px' }}/>
    </Container>
  );
};

export default StartScreen;
