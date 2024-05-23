import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Instructions from '../components/Instructions';
import Button from '../components/Button';
import ClearButton from '../components/ClearButton';
import PromptResponse from '../components/PromptResponse';
import { useNavigate } from "react-router-dom";

// prompts about story for user to fill in
const prompts = ["Story Topic", "Number of Pages for Story", "Cultural Details to Include", "Disability Details to Include", "Additional Details"];
// const generalPrompts = ["Target Age of Audience", "Word count (optional)"];
const sectionsPrompts = new Map(Object.entries({
  "Story Settings": ["Target Age of Audience", "Word count (optional)"],
  "Building the Main Character": ["Age of the character", "Gender", "Race/ethnicity", "Disability"],
  "Story Description": ["Enter Story Description", "Set-up (optional)", "Inciting incident (optional)",
    "Increasing action (optional)", "Climax (optional)", "Subsiding action (optional)", "Resolution (optional)"],
  "Representation": ["Cultural Representation", "Disability Representation"]
}));


// Returns the first screen users see when using the app where the welcome message and initial prompts are
const StartScreen = () => {
  // const initializeState = (prompts) => {
  //   const state = {};
  //   {Object.values(prompts).map((value, index) => (
  //     Object.values(value).map((value, index) => (
  //       state[value] = ""
  //     ))
  //   ))}
  //   return state;
  // };

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

  const StoryPrompts = () => {
    // returns all the prompts and response boxes
    return (
      <Container sx={{display: "flex", flexDirection: "column"}}>
        {prompts.map((prompt, index) => (
          <div key={prompt}>
            <Typography tabIndex={0} variant='h2' paddingBottom='10px' paddingTop='30px'>{prompt}</Typography>
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
          <div key={prompt}>
            <Typography tabIndex={0} variant='label' sx={{ marginBottom:'10px', marginTop: '30px' }}>{prompt}</Typography>
            <PromptResponse
              sx={{ 
                width: '100%',
               }}
              prompt={prompt}
              value={responses[prompt]}
              onChange={(textValue) => handleResponseChange(prompt, textValue)}
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
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start", textAlign: 'left', paddingLeft: '10vh', paddingRight: '10vh', paddingBottom: '40px', paddingTop: '30px', width: '100%' }}>
      <Instructions instructions={"Share your Story Ideas: Make sure to highlight the cultural and disability aspects you want to preserve!"} />
      <ClearButton onClick={clearAllInputs} label={"clear all input"}/>
      <Sections />
      <GenerateStoryButton />
    </Container>
  );
};

export default StartScreen;
