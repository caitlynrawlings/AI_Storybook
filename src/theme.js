import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h1: {
      fontSize: '60px', fontWeight: 'bold',
    },
    h2: {
      fontSize: '32px', fontWeight: 'bold', textAlign: 'left'
    },
    label: {
      fontSize: '20px', fontWeight: 'bold', textAlign: 'left'
    },
    button: {
      fontWeight: 'bold',
    }
  },
  // TODO: Find colors that work with the buttons hover
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
    button2: {
      main: '#FFFFFF',
    },
    button3: {
      main: '#999999',
    },
  },
});

export default theme;
