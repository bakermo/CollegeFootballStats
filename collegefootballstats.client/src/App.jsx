import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import GameChangers from './pages/GameChangers.jsx';
import StarPower from './pages/StarPower.jsx';
import ConferenceClash from './pages/ConferenceClash.jsx';
import SidelineShuffle from './pages/SidelineShuffle.jsx';
import DraftDayDividends from './pages/DraftDayDividends.jsx';
import Feedback from './pages/Feedback.jsx';

const theme = createTheme({
    palette: {
        primary: {
            main: '#212D40',
        },
        secondary: {
            main: '#3F4C64',
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh'
                }
            }
        }
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/player-impact" element={<GameChangers />} />
                    <Route path="/recruits-to-pros" element={<StarPower />} />
                    <Route path="/conference-evolution" element={<ConferenceClash />} />
                    <Route path="/coaching-impact" element={<SidelineShuffle />} />
                    <Route path="/draft-performance" element={<DraftDayDividends />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;