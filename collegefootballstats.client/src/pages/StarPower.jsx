import { Box, Container, Typography, Slider, Select, MenuItem, Button, Paper, RadioGroup, FormControlLabel, Radio, FormControl } from '@mui/material';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function StarPower() {
    const [seasonRange, setSeasonRange] = useState([2004, 2024]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedConference, setSelectedConference] = useState('');
    const [teams, setTeams] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [visualizationData, setVisualizationData] = useState([]);
    const [selectionType, setSelectionType] = useState('team'); // 'team' or 'conference'

    useEffect(() => {
        fetchTeams();
        fetchConferences();
    }, []);

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

    const fetchConferences = async () => {
        try {
            const response = await fetch('/api/conferences');
            const data = await response.json();
            console.log('Conferences fetched:', data);
            if (Array.isArray(data)) {
                setConferences(data);
            } else {
                console.warn('Unexpected conferences response format', data);
                setConferences([]);
            }
        } catch (error) {
            console.error('Error fetching conferences:', error);
            setConferences([]);
        }
    };

    const handleSeasonChange = (event, newValue) => {
        setSeasonRange(newValue);
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
    };

    const handleConferenceChange = (event) => {
        setSelectedConference(event.target.value);
    };

    const handleSelectionTypeChange = (event) => {
        setSelectionType(event.target.value);
        setSelectedTeam('');
        setSelectedConference('');
    };

    const handleReset = () => {
        setSeasonRange([2004, 2024]);
        setSelectedTeam('');
        setSelectedConference('');
        setVisualizationData([]);
    };

    const generateVisualization = async () => {
        try {
            const response = await fetch(`/api/teams/draft-performance?team=${selectedTeam}&conference=${selectedConference}&startSeason=${seasonRange[0]}&endSeason=${seasonRange[1]}`);
            const data = await response.json();
            console.log('Visualization data fetched:', data); // Debugging statement
            if (Array.isArray(data) && data.length > 0) {
                setVisualizationData(data);
            } else {
                setVisualizationData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setVisualizationData([]);
        }
    };

    useEffect(() => {
        if (selectedTeam || selectedConference) {
            generateVisualization();
        }
    }, [selectedTeam, selectedConference, seasonRange]);

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
                        Star Power:
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
                        Recruit to Pros
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
                        Analyzing the correlation between team recruiting quality, rankings, and NFL draft outcomes
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

                    <FormControl component="fieldset" sx={{ mb: 3 }}>
                        <RadioGroup
                            row
                            name="selection-type"
                            value={selectionType}
                            onChange={handleSelectionTypeChange}
                        >
                            <FormControlLabel
                                value="team"
                                control={
                                    <Radio
                                        sx={{
                                            '&.Mui-checked': {
                                                color: '#3F4C64',
                                            }
                                        }}
                                    />
                                }
                                label="Team"
                            />
                            <FormControlLabel
                                value="conference"
                                control={
                                    <Radio
                                        sx={{
                                            '&.Mui-checked': {
                                                color: '#3F4C64',
                                            }
                                        }}
                                    />
                                }
                                label="Conference"
                            />
                        </RadioGroup>
                    </FormControl>

                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ mb: 1, color: '#212D40' }}>
                            Select Team
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedTeam}
                            onChange={handleTeamChange}
                            displayEmpty
                            disabled={selectionType !== 'team'}
                            sx={{
                                backgroundColor: 'white',
                                '&.Mui-disabled': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
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
                            Select Conference
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedConference}
                            onChange={handleConferenceChange}
                            displayEmpty
                            disabled={selectionType !== 'conference'}
                            sx={{
                                backgroundColor: 'white',
                                '&.Mui-disabled': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            <MenuItem value="">
                                <em>Select a conference...</em>
                            </MenuItem>
                            {conferences.length > 0 ? (
                                conferences.map((conference) => (
                                    <MenuItem key={conference.conferenceId} value={conference.conferenceId}>
                                        {conference.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    <em>Loading conferences...</em>
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
                    {!visualizationData.length ? (
                        <Typography color="text.secondary">
                            Select options and generate visualization
                        </Typography>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={visualizationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="season" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="rank" fill="#8884d8" />
                                <Bar dataKey="overallPick" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default StarPower;