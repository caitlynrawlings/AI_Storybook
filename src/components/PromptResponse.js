import React from 'react';
import TextField from '@mui/material/TextField';

const PromptResponse = ({ sx, prompt, onChange }) => {
  const [textValue, setValue] = React.useState("");

  const handleInputChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <TextField
      sx={{ ...sx, backgroundColor: 'white' }}
      id={prompt.replace(/\s+/g, '-').toLowerCase()}
      multiline
      variant="outlined"
      value={textValue}
      onChange={handleInputChange}
      placeholder={prompt}
      InputLabelProps={{
        shrink: false,
      }}
    />
  );
};

export default PromptResponse;