import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '../components/Button';
import { useTheme } from '@mui/material/styles';

// TODO: retrieve these values from the ai response
const summary = "This is the summary";
const explanation = "AI explanations on cultural and disability representation";
const pages = ["This is page1 text", "This is page2 text"];

// Returns the screen that has the AI output and places for user feedback and story iteration
//
// parameters:
//      - numPages: int that is the number of pages in the story book
const EditScreen = (numPages) => {
  const theme = useTheme();
  const [edits, setEdits] = React.useState(Array(numPages).fill(''));  // Edits user wants to make after seeing story

  const handleEditsChange = (index, value) => {
    const newEdits = [...edits];
    newEdits[index] = value;
    setEdits(newEdits);
  };

  // TODO: implement clear edit function

  const Pages = ({ sx }) => {
    // The text in the pages in the book
    return (
      <Box sx={{ width: '100%', ...sx }}>
        {pages.map((page, index) => (
          <Box sx={{ width: '100%' }} key={index}>
            <AiResponse sx={{ width: '100%' }} label={`Page ${index + 1}`} response={page} />
            <EditButton />
          </Box>
        ))}
      </Box>
    );
  };

  const EditButton = ({ sx }) => {
    // handles the edit logic like the input box populating and the close button?
    // TODO:
    return (
      <Button sx={{ ...sx }} label='edit' />
    );
  };

  const ApplyEditsButton = ({ sx }) => {
    // handles logic for sending edits to gpt and refreshes page based on results
    // TODO:
    return (
      <Button sx={{ ...sx }} label='apply edits to story' />
    );
  };

  const DownloadButton = ({ sx }) => {
    // handles logic downloading story pdf
    // TODO:
    return (
      <Button sx={{ ...sx }} label='download' />
    );
  };

  const StartNewStoryButton = ({ sx }) => {
    // goes to start screen
    // TODO:
    return (
      <Button sx={{ ...sx }} label='start new story' />
    );
  };

  const AiResponse = ({ sx, label, response }) => {
    // returns an ai response in the proper format and with a label
    // label is string and is the label on top on the ai response box
    // response is a string and is text that was outputted from the ai in response to prompts
    return (
      <Box sx={{ ...sx, textAlign: 'left', width: '100%' }}>
        <Typography variant="h2" sx={{ paddingBottom: '10px', paddingTop: '20px' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ width: '100%', backgroundColor: theme.palette.secondary.main, padding: '10px', marginBottom: '10px', borderRadius: '10px' }}>
          {response}
        </Typography>
      </Box>
    );
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start", textAlign: 'left', paddingLeft: '10vw', paddingRight: '10vw', paddingBottom: '40px', paddingTop: '30px', width: '100%' }}>
      <Typography variant='h1'>
        AI-Generated Story
      </Typography>
      <AiResponse sx={{ width: '100%' }} label='Summary' response={summary} />
      <EditButton />
      <AiResponse sx={{ width: '100%' }} label='Explanation' response={explanation} />
      <Pages sx={{ width: '100%', paddingTop: '20px' }} />
      <Box height='10vh' />
      <ApplyEditsButton />
      <DownloadButton sx={{ marginTop: '20px' }} />
      <StartNewStoryButton sx={{ marginTop: '20px' }} />
    </Container>
  );
};

export default EditScreen;
