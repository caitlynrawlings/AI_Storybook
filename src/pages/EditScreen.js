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
import ClipLoader from 'react-spinners/ClipLoader'
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';


const storyEditEndpoint = "http://127.0.0.1:5000/edit-story";


// Returns the screen that has the AI output and places for user feedback and story iteration
//
// parameters:
//      - numPages: int that is the number of pages in the story book
const EditScreen = (numPages) => {

  const initializePages = (gptStoryOutput) => {
      // Regular expression to match the JSON string within the "story" property
      const regex = /```json\n([^`]+)```/;

      // Extract the JSON string
      const match = gptStoryOutput.match(regex);
      const jsonString = match ? match[1].trim() : "";

      // Parse the JSON string into a JSON object
      const jsonObject = JSON.parse(jsonString);

      // Extract page values from the object and place them in an array
      const valuesArray = [];
      Object.keys(jsonObject).forEach(key => {
        if (key === "summary") {
          setSummary(jsonObject[key]);
        } else if (key === "explanation") {
          setExplanation(jsonObject[key]);
        } else {
          valuesArray.push(jsonObject[key]);
        }
      });
      return valuesArray
  }

  const navigate = useNavigate()
  const theme = useTheme();

  // Parse GPT response passed from homepage to populate fields
  const { state } = useLocation();
  const [summary, setSummary] = useState("")
  const [explanation, setExplanation] = useState("")
  const[pages, setPages] = useState([]);
  const pageEdits = {} // users edits to pages
  const [ariaLiveMessage, setAriaLiveMessage] = useState("");
  const [messageCounter, setMessageCounter] = useState(0);

  useEffect(() => {
    document.title = "Intersectional Storyteller Edit";
    if (state?.story) {
      const initialPages = initializePages(state.story); 
      setPages(initialPages);
    }
  }, [state?.story]);

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
    const [ariaLiveMessageEdits, setAriaLiveMessageEdits] = useState("");
    const [messageCounterEdits, setMessageCounterEdits] = useState(0);
    

    const handleEditClick = () => {
      setIsEditing(true);
      setMessageCounterEdits(prevCounter => {
        const newCounter = prevCounter + 1;
        const spaces = '.'.repeat(newCounter);
        setAriaLiveMessageEdits(`Edit box opened${spaces}`);
        return newCounter;
      });
    };

    const handleSaveClick = () => {
      // handleEditsChange(index, editValue);
      setIsEditing(false);
      setMessageCounterEdits(prevCounter => {
        const newCounter = prevCounter + 1;
        const spaces = '.'.repeat(newCounter);
        setAriaLiveMessageEdits(`Edit box closed${spaces}`);
        return newCounter;
      });
    };

    return (
      <Box sx={{ ...sx }}>
        <LiveAnnouncer>
          <LiveMessage message={ariaLiveMessageEdits} aria-live="assertive" />
        </LiveAnnouncer>
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
    const [loading, setLoading] = useState(false);
    const [ariaLiveMessageLoading, setAriaLiveMessageLoading] = useState("");
    const [messageCounterLoading, setMessageCounterLoading] = useState(0);

    // handles logic for sending edits to gpt and refreshes page based on results
    const applyAllEdits = () => {
      // format pages into a json
      const originalPagesJson = pages.reduce((newJson, currentValue, index) => {
        newJson[index] = currentValue;
        return newJson;
      }, {});

      setLoading(true);

      setMessageCounterLoading(prevCounter => {
        const newCounter = prevCounter + 1;
        const spaces = '.'.repeat(newCounter);
        setAriaLiveMessageLoading(`Edits being applied${spaces}`);
      });
      
      // wait until response is generated from GPT
      fetch(storyEditEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "edits": JSON.stringify(pageEdits),
          "original": JSON.stringify(originalPagesJson),
        })
      })
        .then(response => response.json())
        .then(data => {
          // refresh the edit component to use the new pages
          setPages(initializePages(data["newStory"]))
          setLoading(false);
        }).catch(error => { console.error('Error:', error); });

   }

    return (
      <>
        <LiveAnnouncer>
          <LiveMessage message={ariaLiveMessageLoading} aria-live="assertive" />
        </LiveAnnouncer>
        <Button sx={{ ...sx }} onClick={applyAllEdits} label='apply edits to story' />
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ClipLoader size={15} color="#7646aa" loading={loading} />
            <Typography style={{ margin: '0 0 0 10px' }} tabIndex={0}>
              Your story is being edited. This may take a moment.
            </Typography>
          </div>
        )}
      </>
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

      setMessageCounter(prevCounter => {
        const newCounter = prevCounter + 1;
        const spaces = '.'.repeat(newCounter);
        setAriaLiveMessage(`Story downloaded${spaces}`);
        return newCounter;
      });
    };

    return (
      <div>
        <Button sx={{ ...sx }} onClick={createAndDownloadDocument} label='download story' />
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
      <LiveAnnouncer>
        <LiveMessage message={ariaLiveMessage} aria-live="assertive" />
      </LiveAnnouncer>
      <Instructions instructions={"This is an overview of the AI-Generated Story. You can learn about how the AI tried to incorperate elements of representation into the story and write edits."} />
      <AiResponse sx={{ width: '100%' }} label='Summary' response={summary} />
      <AiResponse sx={{ marginTop: '20px', width: '100%' }} label='Explanation' response={explanation} />
      <Pages sx={{ width: '100%', marginTop: '40px', paddingBottom: '30px' }} />
      <ApplyEditsButton />
      <Box sx={{ marginTop: '30px', display: 'flex', flexDirection: 'row', }}>
        <DownloadButton sx={{ background: theme.palette.button2.main }}/>
        <StartNewStoryButton sx={{ marginLeft: '20px' }}/>
      </Box>
    </Container>
  );
};

export default EditScreen;
