import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
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

const storyResponse = `\`\`\`json
{
  "summary": "In 'A Merry Silent Night', follow the story of Maya, a joyful 12-year-old girl who is deaf. This heartwarming tale unfolds as Maya and her loving family prepare for Christmas, decorating their home, cooking together, and sharing cherished moments. Maya's unique way of expressing her holiday wishes and the inclusive family traditions that honor her culture and embrace her deafness make this celebration especially vibrant and memorable.",
  "explanation": "'A Merry Silent Night' celebrates Maya's Black heritage and her deafness without resorting to stereotypes. Maya's Black culture is woven into the story through family traditions and gatherings that are universal yet distinct to her family's heritage. Her deafness is depicted as part of her unique identity, showcasing how she and her family communicate and share in their holiday joy through sign language and understanding, thereby emphasizing inclusion and respect.",
  "page_1": "As the first snowflakes of the season pirouetted down to the earth, Maya watched with excitement. Within the family's living room, everyone joined in, adorning their space with lights and ornaments that told stories of their heritage and shared love.",
  "page_2": "The kitchen was alive with the warmth of baking. Together with her grandmother, Maya prepared a cherished holiday recipe. Amid the quiet, they shared a special connection, feeling the kitchen's rhythmic pulse and the subtle vibrations of music in their hearts.",
  "page_3": "Maya and her family exchanged stories through sign language, each decoration bringing a story to life. Maya's enthusiasm was contagious as she engaged with everyone, her expressions bringing warmth to the room.",
  "page_4": "With Christmas Eve on the horizon, Maya conveyed her wishes to Santa in a unique way. She created an enchanting video, weaving her hopes into vivid animations accompanied by sign language, showcasing her creativity and joy.",
  "page_5": "The excitement of Christmas morning enveloped the house. Maya's family had made the effort to learn sign language, greeting her with heartfelt Merry Christmas signs. This gesture deeply touched Maya, making her feel truly seen and loved.",
  "page_6": "The family shared a festive meal, a beautiful blend of their cultural heritage and the love that bound them. For Maya, sitting among her family, the sense of belonging and joy was overwhelming, enveloping her in the true spirit of the holiday.",
  "page_7": "As dusk fell, the family gathered, enveloped in the soft glow of the fire. With their smiles, laughter, and the silent but expressive language of love, Maya understood that the essence of Christmas was right there – in every gesture, in every embrace, in the shared glances of understanding and acceptance."
}
\`\`\``;



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
      <Box sx={{ width: '100%', display: "flex", flexDirection: "column" }}>
        {Array.from(sectionsPrompts).map(([section, prompts], index) => (
          <Section key={index} header={section} prompts={prompts} />
        ))}
      </Box>
    );
  };

  const Section = ({ header, prompts }) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
      </Box>
    );
  };

  const GenerateStoryButton = ({ sx }) => {
    const [loading, setLoading] = useState(false);
    const [ariaLiveMessageLoading, setAriaLiveMessageLoading] = useState("");
    const [messageCounterLoading, setMessageCounterLoading] = useState(0);

    const navigateToEditScreen = () => {
      // navigate('/edit', { state: { 'story': storyResponse } }); // use for testing when don't want to wait for ai response to go to edit page

      setLoading(true);

      setMessageCounterLoading(prevCounter => {
        const newCounter = prevCounter + 1;
        const spaces = '.'.repeat(newCounter);
        setAriaLiveMessageLoading(`Story being generated${spaces}`);
      });

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
      <>
        <LiveAnnouncer>
          <LiveMessage message={ariaLiveMessageLoading} aria-live="assertive" />
        </LiveAnnouncer>
        <Button sx={{ ...sx }} onClick={navigateToEditScreen} label='generate story' />
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClipLoader size={15} color="#7646aa" loading={loading} />
            <Typography style={{ margin: '0 0 0 10px' }} tabIndex={0}>
              Your story is being crafted. This may take a moment.
            </Typography>
          </div>
        )}
      </>
    );
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start", textAlign: 'left', paddingLeft: '10vw', paddingRight: '10vw', paddingBottom: '50px', paddingTop: '30px', width: '100%' }}>
      <Instructions instructions={"Share your Story Ideas: Make sure to highlight the cultural and disability aspects you want to preserve!"} />
      <LiveAnnouncer>
        <LiveMessage message={ariaLiveMessage} aria-live="assertive" />
      </LiveAnnouncer>
      <ClearButton onClick={clearAllInputs} label={"clear all input"} />
      <Sections />
      <GenerateStoryButton sx={{ marginTop: '30px' }} />
    </Container>
  );
};

export default StartScreen;
