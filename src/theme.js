import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h1: {
      fontSize: '10vh',
    },
    h2: {
      fontSize: '20px', fontWeight: 'bold'
    },
  },
  // TODO: Find colors that work with the buttons
  palette: {
    primary: {
      main: '#ECDDFF',
    },
    secondary: {
      main: '#F6F0FF',
    },
    button1: {
      main: '#CEFFB9',
    },
  }
});

export default theme;
