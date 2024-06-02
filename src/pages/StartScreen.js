import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Instructions from '../components/Instructions';
import Button from '../components/Button';
import ClearButton from '../components/ClearButton';
import PromptResponse from '../components/PromptResponse';
import { useNavigate } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';

const storyGenerationEndpoint = "http://127.0.0.1:5000/generate-story";
const sectionsPrompts = new Map(Object.entries({
  "Story Settings": ["Target Age of Audience", "Word count (optional)"],
  "Building the Main Character": ["Age of the character", "Gender", "Race/ethnicity", "Disability"],
  "Story Description": ["Enter Story Description", "Set-up (optional)", "Inciting incident (optional)",
    "Increasing action (optional)", "Climax (optional)", "Subsiding action (optional)", "Resolution (optional)"],
  "Representation": ["Cultural Representation", "Disability Representation"]
}));

const StartScreen = () => {

  const initializeState = (prompts) => {
    const state = {};
    Array.from(prompts.values()).flat().forEach((value) => {
      state[value] = "";
    });
    return state;
  };

  const navigate = useNavigate();
  const [userInputs, setUserInputs] = useState({});
  const requestData = initializeState(sectionsPrompts);
  const [loading, setLoading] = useState(false);
  const [ariaLiveMessage, setAriaLiveMessage] = useState("");
  const [messageCounter, setMessageCounter] = useState(0);

  useEffect(() => {
    document.title = "Intersectional Storyteller Start";
  }, []);

  const handleResponseChange = (prompt, value) => {
    requestData[prompt] = value;
  };

  const clearAllInputs = () => {
    const clearedState = initializeState(sectionsPrompts);
    setUserInputs(clearedState);
    setMessageCounter(prevCounter => {
        const newCounter = prevCounter + 1;
        const spaces = '.'.repeat(newCounter);
        setAriaLiveMessage(`All inputs have been cleared${spaces}`);
        return newCounter;
    });
};


  const Sections = () => {
    return (
      <Container sx={{ width: '100%', display: "flex", flexDirection: "column" }}>
        {Array.from(sectionsPrompts).map(([section, prompts], index) => (
          <Section key={index} header={section} prompts={prompts} />
        ))}
      </Container>
    );
  };

  const Section = ({ header, prompts }) => {
    return (
      <Container sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography tabIndex={0} variant='h2' sx={{ marginBottom: '10px', marginTop: '30px' }}>{header}</Typography>
        {prompts.map((prompt, index) => (
          <Container key={prompt} sx={{ marginBottom: '10px', marginTop: '10px' }}>
            <Typography tabIndex={0} variant='body2' sx={{ marginBottom: '10px' }}>{prompt}</Typography>
            <PromptResponse
              sx={{ width: '100%' }}
              prompt={prompt}
              onChange={(textValue) => handleResponseChange(prompt, textValue)}
            />
          </Container>
        ))}
      </Container>
    );
  };

  const GenerateStoryButton = ({ sx }) => {
    const navigateToEditScreen = () => {
      setLoading(true);

      fetch(storyGenerationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
        .then(response => response.json())
        .then(data => {
          setLoading(false);
          navigate('/edit', { state: { 'story': data['story'] } });
        }).catch(error => { console.error('Error:', error); });
    };

    return (
      <Button sx={{ ...sx }} onClick={navigateToEditScreen} label='generate story' />
    );
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start", textAlign: 'left', paddingLeft: '10vw', paddingRight: '10vw', paddingBottom: '50px', paddingTop: '30px', width: '100%' }}>
      <Instructions instructions={"Share your Story Ideas: Make sure to highlight the cultural and disability aspects you want to preserve!"} />
      <LiveAnnouncer>
        <LiveMessage message={ariaLiveMessage.slice(0, -1)} aria-live="assertive" />
        <ClearButton onClick={clearAllInputs} label={"clear all input"} />
      </LiveAnnouncer>
      <Sections />
      <GenerateStoryButton sx={{ marginTop: '30px' }} />
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClipLoader size={15} color="#7646aa" loading={loading} />
          <Typography style={{ margin: '0 0 0 10px' }} tabIndex={0}>
            Your story is being crafted. This may take a moment.
          </Typography>
        </div>
      )}
    </Container>
  );
};

export default StartScreen;
