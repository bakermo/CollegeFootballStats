// src/pages/ConferenceClash.jsx
import {
    Box,
    Container,
    Typography,
    Slider,
    Select,
    MenuItem,
    Button,
    Paper
} from '@mui/material';
import Header from '../components/Header';
import ConferenceEvolutionVisualization from '../components/ConferenceEvolutionVisualization';
import { useState, useEffect } from 'react';

function ConferenceClash() {
    const [seasonRange, setSeasonRange] = useState([2004, 2024]);
    const [selectedConference, setSelectedConference] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [conferences, setConferences] = useState([]);
    const [teams, setTeams] = useState([]);
    const [visualizationData, setVisualizationData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch conferences on component mount
    useEffect(() => {
        fetchConferences();
    }, []);

    // Fetch teams when conference is selected
    useEffect(() => {
        if (selectedConference) {
            fetchTeams();
        } else {
            setTeams([]);
            setSelectedTeam('');
        }
    }, [selectedConference]);

    const fetchConferences = async () => {
        try {
            const response = await fetch("/api/conferences");
            const data = await response.json();
            console.log("Fetched conferences:", data);
            setConferences(data);
        } catch (error) {
            console.error("Error fetching conferences:", error);
        }
    };

    const fetchTeams = async () => {
        try {
            if (selectedConference) {
                console.log("Fetching teams for conference:", selectedConference);
                const response = await fetch(`/api/teams/conference/${selectedConference}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch teams');
                }

                const data = await response.json();
                console.log("Fetched teams:", data);
                setTeams(data);
            } else {
                setTeams([]);
            }
        } catch (error) {
            console.error("Error fetching teams:", error);
            setTeams([]);
        }
    };

    const generateVisualization = async () => {
        if (!selectedConference) return;

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                conferenceId: selectedConference,
                startYear: seasonRange[0],
                endYear: seasonRange[1]
            });

            if (selectedTeam) {
                queryParams.append('teamId', selectedTeam);
            }

            console.log("Fetching data with params:", queryParams.toString());
            const response = await fetch(`/api/conference-evolution?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch visualization data');
            }

            const data = await response.json();
            console.log("Visualization data received:", data);
            setVisualizationData(data);
        } catch (error) {
            console.error('Error fetching visualization data:', error);
            setVisualizationData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSeasonChange = (event, newValue) => {
        setSeasonRange(newValue);
    };

    const handleConferenceChange = (event) => {
        setSelectedConference(event.target.value);
        setSelectedTeam('');
        setVisualizationData(null);
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
        setVisualizationData(null);
    };

    const handleReset = () => {
        setSeasonRange([2004, 2024]);
        setSelectedConference('');
        setSelectedTeam('');
        setVisualizationData(null);
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            color: '#212D40',
                            fontFamily: 'Georgia, serif',
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            mb: 2
                        }}
                    >
                        Conference Clash:
                    </Typography>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            color: '#3F4C64',
                            fontFamily: 'Georgia, serif',
                            fontSize: '1.75rem',
                            fontWeight: 600,
                            mb: 2
                        }}
                    >
                        Offensive Evolution
                    </Typography>
                </Box>
                <Paper elevation={2} sx={{ p: 4, mb: 4, backgroundColor: 'white' }}>
                    <Typography variant="h6" component="h3" sx={{ mb: 2, color: '#212D40' }}>
                        Select the range of seasons to visualize
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                        <Box
                            sx={{
                                px: 2,
                                position: 'relative',
                                mb: 1
                            }}
                        >
                            <Slider
                                value={seasonRange}
                                onChange={handleSeasonChange}
                                valueLabelDisplay="auto"
                                min={2004}
                                max={2024}
                                valueLabelFormat={(value) => `${value}`}
                                sx={{
                                    color: '#3F4C64',
                                    '& .MuiSlider-thumb': {
                                        '&:hover, &.Mui-focusVisible': {
                                            boxShadow: '0 0 0 8px rgba(63, 76, 100, 0.16)'
                                        }
                                    },
                                    '& .MuiSlider-rail': {
                                        backgroundColor: '#e0e0e0'
                                    },
                                    '& .MuiSlider-valueLabel': {
                                        backgroundColor: '#212D40'
                                    }
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                px: 2,
                                width: '100%'
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#3F4C64',
                                    fontWeight: 500,
                                    position: 'relative',
                                    left: '2px'
                                }}
                            >
                                04'
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#3F4C64',
                                    fontWeight: 500,
                                    position: 'relative',
                                    right: '2px'
                                }}
                            >
                                24'
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ mb: 1, color: '#212D40' }}>
                            Conference Selection
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedConference}
                            onChange={handleConferenceChange}
                            displayEmpty
                            sx={{ backgroundColor: 'white', mb: 2 }}
                        >
                            <MenuItem value="">
                                <em>Select a conference...</em>
                            </MenuItem>
                            {conferences.map((conference) => (
                                <MenuItem key={conference.conferenceId} value={conference.conferenceId}>
                                    {conference.name}
                                </MenuItem>
                            ))}
                        </Select>

                        <Typography sx={{ mb: 1, color: '#212D40' }}>
                            Team Selection (Optional)
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedTeam}
                            onChange={handleTeamChange}
                            displayEmpty
                            disabled={!selectedConference}
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">
                                <em>All Teams in Conference</em>
                            </MenuItem>
                            {teams.map((team) => (
                                <MenuItem key={team.teamId} value={team.teamId}>
                                    {team.school}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={generateVisualization}
                            disabled={!selectedConference || loading}
                            sx={{
                                backgroundColor: '#212D40',
                                '&:hover': { backgroundColor: '#3F4C64' }
                            }}
                        >
                            {loading ? 'Loading...' : 'Generate Visualization'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleReset}
                            sx={{
                                color: '#212D40',
                                borderColor: '#212D40',
                                '&:hover': {
                                    borderColor: '#3F4C64',
                                    color: '#3F4C64'
                                }
                            }}
                        >
                            Reset
                        </Button>
                    </Box>
                </Paper>

                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        minHeight: '500px',
                        backgroundColor: 'white'
                    }}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                            <Typography>Loading visualization...</Typography>
                        </Box>
                    ) : !visualizationData ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                            <Typography>Select a conference and generate visualization</Typography>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#212D40' }}>
                                {selectedTeam ? 'Team Performance Evolution' : 'Conference Performance Evolution'}
                            </Typography>
                            <ConferenceEvolutionVisualization data={visualizationData} />
                        </>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default ConferenceClash;