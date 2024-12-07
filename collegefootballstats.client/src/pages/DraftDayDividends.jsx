import { Box, Container, Typography, Slider, Select, MenuItem, Button, Paper } from '@mui/material';
import Header from '../components/Header';
import DraftDayDividendsVisualization from '../components/DraftDayDividendsVisualization';
import { useState, useEffect } from 'react';

function DraftDayDividends() {
    const [seasonRange, setSeasonRange] = useState([2010, 2024]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [positions, setPositions] = useState([]);
    const [visualizationData, setVisualizationData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPositions();
    }, []);

    const fetchPositions = async () => {
        try {
            const response = await fetch('/api/player-positions');
            const data = await response.json();
            console.log('Positions fetched:', data);
            if (Array.isArray(data)) {
                setPositions(data);
            } else {
                console.warn('Unexpected positions response format', data);
                setPositions([]);
            }
        } catch (error) {
            console.error('Error fetching positions:', error);
            setPositions([]);
        }
    };

    const handleSeasonChange = (event, newValue) => {
        setSeasonRange(newValue);
    };

    const handlePositionChange = (event) => {
        setSelectedPosition(event.target.value);
    };

    const handleReset = () => {
        setSeasonRange([2010, 2024]);
        setSelectedPosition('');
        setVisualizationData(null);
    };

    const generateVisualization = async () => {
        if (!selectedPosition) return;

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                position: selectedPosition,
                startYear: seasonRange[0],
                endYear: seasonRange[1]
            });

            console.log("Fetching data with params:", queryParams.toString());
            const response = await fetch(`/api/player-performance-by-position?${queryParams}`);

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
                        Draft Day Dividends:
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
                        Position Performance
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
                        Analyzing how player performance metrics by position influence NFL draft rounds
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
                                min={2010}
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
                                10'
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
                            Player Position
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedPosition}
                            onChange={handlePositionChange}
                            displayEmpty
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">
                                <em>Select a position...</em>
                            </MenuItem>
                            {positions.length > 0 ? (
                                positions.map((position) => (
                                    <MenuItem key={position.position} value={position.position}>
                                        {position.position}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    <em>Loading positions...</em>
                                </MenuItem>
                            )}
                        </Select>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={generateVisualization}
                            disabled={!selectedPosition || loading}
                            sx={{
                                backgroundColor: '#212D40',
                                '&:hover': {
                                    backgroundColor: '#3F4C64'
                                }
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
                        height: '500px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white'
                    }}
                >
                    {loading ? (
                        <Typography>Loading visualization...</Typography>
                    ) : !visualizationData ? (
                        <Typography color="text.secondary">
                            Select a position and generate visualization
                        </Typography>
                    ) : (
                        <DraftDayDividendsVisualization data={visualizationData} />
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default DraftDayDividends;