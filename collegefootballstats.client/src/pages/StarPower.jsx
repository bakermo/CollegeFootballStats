import { Box, Container, Typography, Slider, Select, MenuItem, Button, Paper, RadioGroup, FormControlLabel, Radio, FormControl } from '@mui/material';
import Header from '../components/Header';
import { useState } from 'react';

function StarPower() {
    const [seasonRange, setSeasonRange] = useState([4, 24]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedConference, setSelectedConference] = useState('');
    const [visualizationData, setVisualizationData] = useState(null);
    const [selectionType, setSelectionType] = useState('team'); // 'team' or 'conference'

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
        setSeasonRange([4, 24]);
        setSelectedTeam('');
        setSelectedConference('');
        setVisualizationData(null);
    };

    const generateVisualization = () => {
        console.log('Generating visualization with:', {
            seasonRange,
            selectionType,
            team: selectedTeam,
            conference: selectedConference
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
                                min={4}
                                max={24}
                                valueLabelFormat={(value) => `20${value.toString().padStart(2, '0')}`}
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
                            Select options and generate visualization
                        </Typography>
                    ) : (
                        <Box>Visualization will go here</Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default StarPower;