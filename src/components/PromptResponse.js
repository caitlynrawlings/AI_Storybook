import React from 'react';
import TextField from '@mui/material/TextField';

const PromptResponse = ({ prompt, value, onChange }) => {
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
      id={prompt.replace(/\s+/g, '-').toLowerCase()}
      label={prompt}
      variant="outlined"
      value={textValue}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      onKeyDown={handleInputKeyPress}
    />
  );
};

export default PromptResponse;