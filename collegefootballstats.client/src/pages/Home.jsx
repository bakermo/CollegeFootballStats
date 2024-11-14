import { Box, Container, Typography, AppBar, Toolbar, Menu, MenuItem, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';
import AnalysisCard from '../components/AnalysisCard.jsx';

const analysisCards = [
    {
        title: "Game Changers: Player Impact",
        description: "For the query about individual player performance influencing team success",
        path: "/player-impact"
    },
    {
        title: "Star Power: Recruits to Pros",
        description: "For the query about recruiting class ratings and NFL draft outcomes",
        path: "/recruits-to-pros"
    },
    {
        title: "Conference Clash: Offensive Evolution",
        description: "For the query about how offensive and defensive metrics have evolved within conferences",
        path: "/conference-evolution"
    },
    {
        title: "Sideline Shuffle: Coaching Impact",
        description: "For the query about how coaching changes affect team performance",
        path: "/coaching-impact"
    },
    {
        title: "Draft Day Dividends: Position Performance",
        description: "For the query about player performance metrics and their affect on NFL draft rounds",
        path: "/draft-performance"
    }
];

function Home() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <AppBar position="static" sx={{ backgroundColor: '#683ab7' }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ padding: '0 !important' }}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            College Football Stat Hub
                        </Typography>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>About Us</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Database Tables</MenuItem>
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container
                maxWidth="lg"
                sx={{
                    mt: 4,
                    mb: 4,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Typography
                    variant="h1"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontSize: '2rem',
                        fontWeight: 500,
                        mb: 4
                    }}
                >
                    Your GO-TO hub for College Football Stat analysis and visualization
                </Typography>

                <Box sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    flex: 1
                }}>
                    {analysisCards.map((card, index) => (
                        <AnalysisCard
                            key={index}
                            title={card.title}
                            description={card.description}
                            path={card.path}
                        />
                    ))}
                </Box>
            </Container>
        </Box>
    );
}

export default Home;