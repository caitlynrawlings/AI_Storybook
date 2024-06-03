import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EditScreen from './pages/EditScreen';
import StartScreen from './pages/StartScreen';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: -1, backgroundColor: theme.palette.primary.main }}/>
      <div className="App">
        <Router>
            <Routes>
              <Route path="/" element={<StartScreen />} />
              <Route path="/edit" element={<EditScreen />} />
            </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
