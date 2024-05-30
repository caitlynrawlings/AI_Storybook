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

const storyEditEndpoint = "http://127.0.0.1:5000/edit-story";

// TODO: retrieve these values from the ai response
const summary = "This is the summary";
const explanation = "AI explanations on cultural and disability representation";

// Returns the screen that has the AI output and places for user feedback and story iteration
//
// parameters:
//      - numPages: int that is the number of pages in the story book
const EditScreen = (numPages) => {
  useEffect(() => {
    document.title = "Intersectional Storyteller Edit";
  }, []);

  const initializePages = (gptStoryOutput) => {
      // Regular expression to match the JSON string within the "story" property
      const regex = /```json\n([^`]+)```/;

      // Extract the JSON string
      const match = gptStoryOutput.match(regex);
      const jsonString = match ? match[1].trim() : '';

      // Parse the JSON string into a JSON object
      const jsonObject = JSON.parse(jsonString);

      // Extract values from the object and place them in an array
      const valuesArray = Object.values(jsonObject);
      return valuesArray
  }

  const navigate = useNavigate()
  const theme = useTheme();

  // Parse GPT response passed from homepage to populate fields
  const { state } = useLocation();
  const[pages, setPages] = useState(initializePages(state?.story));
  const pageEdits = {} // users edits to pages

  const handleEditsChange = (index, value) => {
    pageEdits[index] = value;
  };

  // TODO: implement clear edit function

  const Pages = ({ sx }) => {
    // The text in the pages in the book
    return (
      <Box sx={{ width: '100%', ...sx }}>
        {pages.map((page, index) => (
          <Box sx={{ width: '100%' }} key={index}>
            <AiResponse sx={{ width: '100%' }} label={`Page ${index + 1}`} response={page} />
            <EditButton index={index} promptSection={`page ${index + 1}`}/>
          </Box>
        ))}
      </Box>
    );
  };

  const EditButton = ({ index, sx, promptSection }) => {
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
    const applyAllEdits = () => {
      // wait until response is generated from GPT
      fetch(storyEditEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageEdits)
      })
        .then(response => response.json())
        .then(data => {
          // refresh the edit component to use the new pages
          setPages(data["newStory"].split('\n'))
        }).catch(error => { console.error('Error:', error); });
   }

    return (
      <Button sx={{ ...sx }} onClick={applyAllEdits} label='apply edits to story' />
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
