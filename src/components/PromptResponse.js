import React from 'react';
import TextField from '@mui/material/TextField';

const PromptResponse = ({ sx, prompt, value, onChange }) => {
  const [textValue, setValue] = React.useState(value);

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  const handleInputBlur = () => {
    onChange(textValue)
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
        onChange(textValue)
    }
  };

  return (
    <TextField
      sx={{ ...sx }}
      id={prompt.replace(/\s+/g, '-').toLowerCase()}
      label={prompt}
      variant="filled"
      value={textValue}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      onKeyDown={handleInputKeyPress}
      inputProps={{ style: { background: 'white' } }}
    />
  );
};

export default PromptResponse;