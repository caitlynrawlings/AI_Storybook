import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Button from '../components/Button';
import ClearButton from '../components/ClearButton';
import PromptResponse from '../components/PromptResponse';
import Instructions from '../components/Instructions';
import { saveAs } from 'file-saver';
import { Packer, Document, TextRun, Paragraph } from 'docx';
import { useNavigate, useLocation } from "react-router-dom";


// TODO: retrieve these values from the ai response
const summary = "This is the summary";
const explanation = "AI explanations on cultural and disability representation";
const pages = ["This is page1 text", "This is page2 text"];

// Returns the screen that has the AI output and places for user feedback and story iteration
//
// parameters:
//      - numPages: int that is the number of pages in the story book
const EditScreen = (numPages) => {
  useEffect(() => {
    document.title = "Intersectional Storyteller Edit";
  }, []);

  const { state } = useLocation();
  const navigate = useNavigate()
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
            <EditButton promptSection={`page ${index + 1}`}/>
          </Box>
        ))}
      </Box>
    );
  };

  const EditButton = ({ index, handleEditsChange, sx, promptSection }) => {
    const [isEditing, setIsEditing] = useState(false);
    const prompt = `Enter modification prompts for ${promptSection}.`;

    const handleEditClick = () => {
      setIsEditing(true);
    };

    const handleSaveClick = () => {
      // handleEditsChange(index, editValue);
      setIsEditing(false);
    };

    return (
      <Box sx={{ ...sx }}>
        {isEditing ? (
          <Box>
            <PromptResponse
                sx={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}
                prompt={prompt}
                value={edits[index]}
                onChange={(textValue) => handleEditsChange(index, textValue)}
            />
            <ClearButton sx={{ marginBottom: '20px' }} onClick={handleSaveClick} label="clear" />
          </Box>
        ) : (
          <Button onClick={handleEditClick} label="edit" />
        )}
      </Box>
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
    const createAndDownloadDocument = async () => {

      const sections = pages.map((str, index) => ({
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(str)],
          }),
        ],
      }));

      const doc = new Document({ sections });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "story.docx");
      });
};

    return (
      <div>
        <Button sx={{ ...sx }} onClick={createAndDownloadDocument} label='download' />
      </div>
    );
  };

  const StartNewStoryButton = ({ sx }) => {
    // goes to start screen
    const navigateToHomeScreen = () => {
      navigate("/");
    }

    return (
      <Button sx={{ ...sx }} onClick={navigateToHomeScreen} label='start new story' />
    )
  }

  const AiResponse = ({ sx, label, response }) => {
    // returns an ai response in the proper format and with a label
    // label is string and is the label on top on the ai response box
    // response is a string and is text that was outputted from the ai in response to prompts
    return (
      <Box sx={{ ...sx, textAlign: 'left', width: '100%' }}>
        <Typography tabIndex={0} variant="body2" sx={{ marginBottom: '10px', mariginTop: '20px' }}>
          {label}
        </Typography>
        <Typography tabIndex={0} variant="body1" sx={{ width: '100%', backgroundColor: theme.palette.secondary.main, padding: '10px', marginTop: '15px', borderRadius: '10px' }}>
          {response}
        </Typography>
      </Box>
    );
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start", textAlign: 'left', paddingLeft: '10vw', paddingRight: '10vw', paddingBottom: '40px', paddingTop: '30px', width: '100%' }}>
      <Instructions instructions={"This is an overview of the AI-Generated Story. You can learn about how the AI tried to incorperate elements of representation into the story and write edits."} />
      <AiResponse sx={{ width: '100%' }} label='Summary' response={summary} />
      <EditButton promptSection='summary' sx={{ width: '100%'}}/>
      <AiResponse sx={{ width: '100%' }} label='Explanation' response={explanation} />
      <Pages sx={{ width: '100%', marginTop: '40px', paddingBottom: '30px' }} />
      <ApplyEditsButton />
      <Box sx={{ display: 'flex', flexDirection: 'row', }}>
        <DownloadButton sx={{ background: theme.palette.button3.main }}/>
        <StartNewStoryButton sx={{ marginLeft: '20px' }}/>
      </Box>
    </Container>
  );
};

export default EditScreen;
