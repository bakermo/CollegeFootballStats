import { Box, Container, Typography, Button, Card } from '@mui/material';
import AnalysisCard from '../components/AnalysisCard.jsx';
import Header from '../components/Header.jsx';

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
    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Header />

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
                <Box sx={{ textAlign: 'center', mb: 6 }}>
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
                        College Football Stat Hub
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
                        Your GO-TO hub for College Football Stat analysis and visualization
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                }}>
                    {analysisCards.map((card, index) => (
                        <AnalysisCard
                            key={index}
                            title={card.title}
                            description={card.description}
                            path={card.path}
                        />
                    ))}

                    <Card sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 3,
                        gap: 2,
                        backgroundColor: '#fff'
                    }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Georgia, serif',
                                color: '#212D40',
                                fontWeight: 600
                            }}
                        >
                            Shows all of the tuples found within the our database
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#3F4C64',
                                    '&:hover': {
                                        backgroundColor: '#212D40'
                                    }
                                }}
                            >
                                Show Total Tuples
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: '#3F4C64',
                                    borderColor: '#3F4C64',
                                    '&:hover': {
                                        borderColor: '#212D40',
                                        color: '#212D40'
                                    }
                                }}
                            >
                                Tuples here
                            </Button>
                        </Box>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}

export default Home;