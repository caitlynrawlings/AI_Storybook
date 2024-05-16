import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const prompts = ["Story Topic", "Number of Pages for Story", "Cultural Details to Include", "Disability Details to Include", "Additional Details"];

const StartScreen = () => {
  const [responses, setResponses] = useState(Array(prompts.length).fill(''));

  const handleResponseChange = (index, value) => {
      const newResponses = [...responses];
      newResponses[index] = value;
      setResponses(newResponses);
  };

  const Instructions = () => {
    return (
      <Container display="flex" flexDirection="column" >
          <Typography>
              Share your Story Ideas
          </Typography>
          <Typography>
              Share your Story Ideas
          </Typography>
      </Container>
    )
  }

  const StoryPrompts = () => {
    return (
        <Container display="flex" flexDirection="column" >
            {prompts.map(prompt => (
                <div key={prompt}>
                    <Typography>
                        {prompt}
                    </Typography>
                    <PromptResponse
                        prompt={prompt}
                        value={responses[index]}
                        onChange={event => handleResponseChange(index, event.target.value)}
                    />
                </div>
            ))}
        </Container>
    )
  }

  const PromptResponse = ({ prompt, value, onChange }) => {
    return (
      <TextField
          id={prompt.replace(/\s+/g, '-').toLowerCase()}
          label={prompt}
          variant="outlined"
          value={value}
          onChange={onChange}
      />
    )
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Box display="flex">
        <Box style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '50%', overflowY: 'auto' }}>
          <Instructions />
        </Box>
        <Box style={{ marginLeft: '50%', width: '50%', overflowY: 'auto' }}>
          <StoryPrompts />
        </Box>
      </Box>
    </Container>
  );
};

export default StartScreen;
