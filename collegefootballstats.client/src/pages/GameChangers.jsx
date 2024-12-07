import { Box, Container, Typography, Slider, Select, MenuItem, Button, Paper, Autocomplete, TextField } from '@mui/material';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import PlayerImpactVisualization from '../components/PlayerImpactVisualization';

function GameChangers() {
    const [seasonRange, setSeasonRange] = useState([2004, 2024]);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [players, setPlayers] = useState([]);
    const [playersByType, setPlayersByType] = useState([]);
    const [selectedPlayerType, setSelectedPlayerType] = useState('');
    const [teams, setTeams] = useState([]);
    const [visualizationData, setVisualizationData] = useState(null);
    const [playerSearch, setPlayerSearch] = useState('');
    const [statTypes, setStatTypes] = useState([]);
    const [selectedStatType, setSelectedStatType] = useState('');
    const [statCategories, setStatCategories] = useState([]);
    const [selectedStatCategory, setSelectedStatCategory] = useState('');
    const [comparisonOperator, setComparisonOperator] = useState('');
    const [comparisonValue, setComparisonValue] = useState(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    useEffect(() => {
        if (playerSearch) {
            fetchPlayers(playerSearch);
        } else {
            setPlayers([]);
        }
    }, [playerSearch]);

    useEffect(() => {
        if (selectedPlayerType) {
            fetchPlayersByType(selectedPlayerType);
        } else {
            setPlayersByType([]);
        }
    }, [selectedPlayerType]);

    useEffect(() => {
        if (selectedPlayer) {
            fetchPlayerStatTypes(selectedPlayer);
        } else {
            setStatTypes([]);
        }
    }, [selectedPlayer]);

    useEffect(() => {
        if (selectedStatType) {
            fetchPlayerStatCategories(selectedStatType);
        } else {
            setStatCategories([]);
        }
    }, [selectedStatType]);

    const fetchPlayers = async (search) => {
        try {
            const response = await fetch(`/api/players/${search}`);
            console.log(response.data);
            const data = await response.json();
            console.log('Players fetched:', data);
            if (Array.isArray(data)) {
                setPlayers(data);
            } else {
                console.warn('Unexpected players response format', data);
                setPlayers([]);
            }
        } catch (error) {
            console.error('Error fetching players:', error);
            setPlayers([]);
        }
    };

    const fetchPlayersByType = async () => {
        try {
            const response = await fetch(`/api/players/type?name=${selectedPlayerType}&teamID=${selectedTeam}`);
            console.log(response.data);
            const data = await response.json();
            console.log('Players fetched:', data);
            if (Array.isArray(data)) {
                setPlayersByType(data);
            } else {
                console.warn('Unexpected players response format', data);
                setPlayersByType([]);
            }
        } catch (error) {
            console.error('Error fetching players:', error);
            setPlayersByType([]);
        }
    };

    const fetchPlayerStatTypes = async () => {
        try {
            const response = await fetch(`/api/statTypes?playerID=${selectedPlayer}`);
            console.log(response.data);
            const data = await response.json();
            console.log('stat types fetched:', data);
            if (Array.isArray(data)) {
                setStatTypes(data);
            } else {
                console.warn('Unexpected stat types response format', data);
                setStatTypes([]);
            }
        } catch (error) {
            console.error('Error fetching stat types:', error);
            setStatTypes([]);
        }
    };

    const fetchPlayerStatCategories = async () => {
        try {
            const response = await fetch(`/api/statCategories?type=${selectedStatType}`);
            console.log(response.data);
            const data = await response.json();
            console.log('stat categories fetched:', data);
            if (Array.isArray(data)) {
                setStatCategories(data);
            } else {
                console.warn('Unexpected stat categories response format', data);
                setStatCategories([]);
            }
        } catch (error) {
            console.error('Error fetching stat categories:', error);
            setStatCategories([]);
        }
    };

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

    const handleSeasonChange = (event, newValue) => {
        setSeasonRange(newValue);
    };

    const handlePlayerChange = (event) => {
        console.log("newValue: ", event.target.value);
        setSelectedPlayer(event.target.value);
        console.log("selectedPlayer: ", selectedPlayer);
    };

    const handlePlayerChangeSearch = (event, newValue) => {
        console.log("newValue: ", newValue);
        setSelectedPlayer(newValue.playerID);
        console.log("selectedPlayer: ", selectedPlayer);
    };

    const handlePlayerType = (event) => {
        console.log("newValue: ", event.target.value);
        setSelectedPlayerType(event.target.value);
        console.log("selectedPlayertype: ", selectedPlayerType);
    };

    const handleStatTypeChange = (event) => {
        console.log("statTypes: ", statTypes);
        console.log("newValue: ", event.target.value);
        setSelectedStatType(event.target.value);
        console.log("selectedStattype: ", selectedStatType);
    };

    const handleStatCategoryChange = (event) => {
        console.log("statCategories: ", statCategories);
        console.log("newValue: ", event.target.value);
        setSelectedStatType(event.target.value);
        console.log("selectedStattype: ", selectedStatType);
    };


    const handleCompOperator = (event) => {
        console.log("newValue: ", event.target.value);
        setComparisonOperator(event.target.value);
        console.log("selectedcompop: ", comparisonOperator);
    };

    const handleTeamChange = (event) => {
        setSelectedTeam(event.target.value);
    };

    const handleReset = () => {
        setSeasonRange([2004, 2024]);
        setSelectedPlayer('');
        setSelectedTeam('');
        setVisualizationData(null);
        setPlayerSearch('');
    };

    const generateVisualization = async () => {
            console.log('Generating visualization with:', {
                seasonRange,
                player: selectedPlayer,
                team: selectedTeam,
                statType: selectedStatType,
                comparisonOperator,
                comparisonValue
            });

        try {
            const params = new URLSearchParams({
                teamID: selectedTeam,
                playerID: selectedPlayer,
                startYear: seasonRange[0],
                endYear: seasonRange[1],
                statType: selectedStatType,
                statCategory: "passing", // Assuming statCategory is the same as statType
                compOperator: comparisonOperator,
                compValue: parseInt(comparisonValue, 10)
            });

            console.log(params)

            console.log("getting response...");

            const response = await fetch(`/api/player-impact?${params.toString()}`, {
                method: 'POST',  // Use POST method for sending data
            });

            console.log("got response?", response);

            const data = await response.json();
            console.log('data fetched:', data);
            setVisualizationData(data);
        } catch (error) {
            console.error('Error fetching visualization data:', error);
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
                        Game Changers
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
                        Player Impact Analysis
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
                        Visualizing individual player performance influencing their team success
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
                            Search Player
                        </Typography>
                        <Autocomplete
                            options={players}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                            isOptionEqualToValue={(option, value) => option.playerID === value.playerID}
                            onChange={handlePlayerChangeSearch}
                            inputValue={playerSearch}
                            onInputChange={(event, newInputValue) => {
                                setPlayerSearch(newInputValue);
                            }}
                            renderOption={(props, option) => (
                                <li {...props} key={option.playerID}>
                                    {option.firstName} {option.lastName}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search for a player..."
                                    fullWidth
                                    sx={{ backgroundColor: 'white' }}
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#212D40' }}>
                            OR
                        </Typography>
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
                            Select Player Type
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedPlayerType}
                            onChange={handlePlayerType}
                            displayEmpty
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">
                                <em>Select a player type...</em>
                            </MenuItem>
                            {selectedTeam ? (
                                [
                                    <MenuItem key="offensive" value="offensive">
                                        Offensive
                                    </MenuItem>,
                                    <MenuItem key="defensive" value="defensive">
                                        Defensive
                                    </MenuItem>,
                                    <MenuItem key="specialTeams" value="specialTeams">
                                        Special Teams
                                    </MenuItem>
                                ]
                            ) : (
                                <MenuItem disabled>
                                    <em>Select a team first</em>
                                </MenuItem>
                            )}
                        </Select>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ mb: 1, color: '#212D40' }}>
                            Select Player
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedPlayer}
                            onChange={handlePlayerChange}
                            displayEmpty
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">
                                <em>Select a player...</em>
                            </MenuItem>
                            {playersByType.length > 0 ? (
                                playersByType.map((playerByType) => (
                                    <MenuItem key={playerByType.playerID} value={playerByType.playerID}>
                                        {playerByType.firstName} {playerByType.lastName}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    <em>Select a team and player type first</em>
                                </MenuItem>
                            )}
                        </Select>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Select
                            fullWidth
                            value={selectedStatType}
                            onChange={handleStatTypeChange}
                            displayEmpty
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">
                                <em>Select stat type...</em>
                            </MenuItem>
                            {statTypes.length > 0 ? (
                                statTypes.map((statType) => (
                                    <MenuItem key={statType.id} value={statType.type}>
                                        {statType.type}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    <em>Select a player first</em>
                                </MenuItem>
                            )}
                        </Select>
                        <Select
                                fullWidth
                                value={selectedStatCategory}
                                onChange={handleStatCategoryChange}
                                displayEmpty
                                sx={{ backgroundColor: 'white' }}
                            >
                                <MenuItem value="">
                                    <em>Select stat category...</em>
                                </MenuItem>
                                {statCategories.length > 0 ? (
                                    statCategories.map((statCategory) => (
                                        <MenuItem key={statCategory.id} value={statCategory.category}>
                                            {statCategory.category}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>
                                        <em>Select a stat type first</em>
                                    </MenuItem>
                                )}
                        </Select>
                        <Select
                            fullWidth
                            value={comparisonOperator}
                            onChange={handleCompOperator}
                            displayEmpty
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">
                                <em>Select comparison...</em>
                            </MenuItem>
                            <MenuItem value=">">&gt;</MenuItem>
                            <MenuItem value="<">&lt;</MenuItem>
                            <MenuItem value="=">&#61;</MenuItem>
                            <MenuItem value="<=">&lt;&#61;</MenuItem>
                            <MenuItem value=">=">&gt;&#61;</MenuItem>
                        </Select>
                        <TextField  
                            fullWidth  
                            placeholder="Enter number"  
                            value={comparisonValue}  
                            onChange={(e) => setComparisonValue(e.target.value)}  
                            sx={{ backgroundColor: 'white' }}  
                        />
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
                            Select a player and team, then generate visualization
                        </Typography>
                    ) : (
                        <PlayerImpactVisualization data={visualizationData} />
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default GameChangers;
