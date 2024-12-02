import { Box, Container, Typography, Slider, Select, MenuItem, Button, Paper } from '@mui/material';
import Header from '../components/Header';
import { useState, useEffect } from 'react';

function SidelineShuffle() {
    const [seasonRange, setSeasonRange] = useState([2004, 2024]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedCoach, setSelectedCoach] = useState('');
    const [teams, setTeams] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [visualizationData, setVisualizationData] = useState(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    useEffect(() => {
        fetchCoaches();
    }, [selectedTeam]);

    const fetchTeams = async () => {
        try {
            const response = await fetch('/api/teams');
            const data = await response.json();
            console.log('Teams fetched:', data);
            if (Array.isArray(data)) {
                setTeams(data);
            } else {
                console.warn('Unexpected teams response format', data);
                setTeams([]);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            setTeams([]);
        }
    };

    const fetchCoaches = async () => {
        try {
            const response = await fetch(`/api/coaches/${selectedTeam}`);
            const data = await response.json();
            console.log('Coaches fetched:', data);
            if (Array.isArray(data)) {
                setCoaches(data);
            } else {
                console.warn('Unexpected coaches response format', data);
                setCoaches([]);
            }
        } catch (error) {
            console.error('Error fetching coaches:', error);
            setCoaches([]);
        }
    };

    const handleSeasonChange = (event, newValue) => {
        setSeasonRange(newValue);
    };

    const handleTeamChange = (event) => {
        console.log(teams);
        console.log(selectedTeam);
        setSelectedTeam(event.target.value);
        console.log(selectedTeam);
    };

    const handleCoachChange = (event) => {
        console.log(coaches);
        console.log(selectedCoach);
        setSelectedCoach(event.target.value);
        console.log(selectedCoach);
    };

    const handleReset = () => {
        setSeasonRange([2004, 2024]);
        setSelectedTeam('');
        setSelectedCoach('');
        setVisualizationData(null);
    };

    const generateVisualization = () => {
        console.log('Generating visualization with:', {
            seasonRange,
            team: selectedTeam,
            coach: selectedCoach
        });
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
                        Sideline Shuffle:
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
                        Coaching Impact
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: '#3F4C64',
                            maxWidth: '600px',
                            margin: '0 auto',
                            fontSize: '1.1rem',
                            lineHeight: 1.5,
                            opacity: 0.9
                        }}
                    >
                        Assessing the impact of coaching changes on team performance and rankings
                    </Typography>
                </Box>

                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        mb: 4,
                        backgroundColor: 'white'
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            mb: 2,
                            color: '#212D40'
                        }}
                    >
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
                            Select Team
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedTeam}
                            onChange={handleTeamChange}
                            displayEmpty
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">
                                <em>Select a team...</em>
                            </MenuItem>
                            {teams.length > 0 ? (
                                teams.map((team) => (
                                    <MenuItem key={team.teamId} value={team.teamId}>
                                        {team.school}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    <em>Loading teams...</em>
                                </MenuItem>
                            )}
                        </Select>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ mb: 1, color: '#212D40' }}>
                            Select Coach
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedCoach}
                            onChange={handleCoachChange}
                            displayEmpty
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">
                                <em>Select a coach...</em>
                            </MenuItem>
                            {coaches.length > 0 ? (
                                coaches.map((coach) => (
                                    <MenuItem key={coach.coachID} value={coach.coachID}>
                                        {`${coach.firstName} ${coach.lastName}`}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    <em>Loading coaches...</em>
                                </MenuItem>
                            )}
                        </Select>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={generateVisualization}
                            sx={{
                                backgroundColor: '#212D40',
                                '&:hover': {
                                    backgroundColor: '#3F4C64'
                                }
                            }}
                        >
                            Generate Visualization
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
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white'
                    }}
                >
                    {!visualizationData ? (
                        <Typography color="text.secondary">
                            Select a team and coach, then generate visualization
                        </Typography>
                    ) : (
                        <Box>Visualization will go here</Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default SidelineShuffle;