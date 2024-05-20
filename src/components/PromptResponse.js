import React from 'react';
import TextField from '@mui/material/TextField';

const PromptResponse = ({ sx, prompt, value, onChange }) => {
  const [textValue, setValue] = React.useState(value);

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
        onChange(textValue)
    }
  };

  return (
    <TextField
      sx={{ ...sx, backgroundColor: 'white' }}
      id={prompt.replace(/\s+/g, '-').toLowerCase()}
      multiline
      variant="outlined"
      value={textValue}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyPress}
      placeholder={prompt}
      InputLabelProps={{
        shrink: false,
      }}
    />
  );
};

export default PromptResponse;