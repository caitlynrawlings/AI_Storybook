import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '../components/Button';
import { useTheme } from '@mui/material/styles';

// TODO: retrieve these values from the ai response
const summary = "This is the summary";
const explanation = "AI explanations on cultural and disability representation"
const pages = ["This is page1 text", "This is page2 text"];

// Returns the screen that has the AI output and places for user feedback and story iteration
//
// parameters:
//      - numPages: int that is the number of pages in the story book
const EditScreen = (numPages) => {
  const theme = useTheme();
  const [edits, setEdits] = React.useState(Array(numPages).fill(''));  // Edits user wants to make after

  const handleEditsChange = (index, value) => {
    const newEdits = [...edits];
    newEdits[index] = value;
    setEdits(newEdits);
  };

  // TODO: implement clear edit function

  const Pages = () => {
    // The text in the pages in the book
    return (
      <Container display="flex" padding='10vh' flexDirection="column">
        {pages.map((page, index) => (
          <div key={page}>
            <AiResponse label={`Page ${index + 1}`} response={pages[index]}/>
            <EditButton />
          </div>
        ))}
      </Container>
    );
  };

  const EditButton = () => {
    // handles the edit logic like the input box populating and the close button?
    // TODO:
    return (
        <Button label='edit'/>
    )
  }

  const ApplyEditsButton = () => {
    // handles logic for sending edits to gpt and refreshes page based on results
    // TODO:
    return (
        <Button label='apply edits to story'/>
    )
  }

  const DownloadButton = () => {
    // handles logic downloading story pdf
    // TODO:
    return (
        <Button label='download'/>
    )
  }

  const StartNewStoryButton = () => {
    // goes to start screen
    // TODO:
    return (
        <Button label='start new story'/>
    )
  }

  const AiResponse = ({label, response}) => {
    // returns an ai response in the proper format and with a label
    // label is string and is the label on top on the ai response box
    // response is a string and is text that was outputed from the ai in response to prompts
    return (
        <Container>
            <Typography variant="h2" sx={{ padding: '10px'}}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ backgroundColor: theme.palette.secondary.main, padding: '10px', borderRadius: '10px' }}>
                {response}
            </Typography>
        </Container>
    );
  };

  return (
    <Container maxWidth="md" style={{ position: 'relative' }}>
      <Box display="flex" flexDirection='column' alignItems="flex-start" textAlign='left'>
        <Typography variant='h1'>
            AI-Generated Story
        </Typography>
        <AiResponse label='Summary' response={summary}/>
        <EditButton />
        <AiResponse label='Explanation' response={explanation}/>
        <Pages />
        <Box height='10vh'/>
        <ApplyEditsButton />
        <DownloadButton />
        <StartNewStoryButton />
      </Box>
    </Container>
  );
};

export default EditScreen;
