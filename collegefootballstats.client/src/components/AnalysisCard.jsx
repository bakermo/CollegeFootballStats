import { Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AnalysisCard({ title, description, path }) {
    const navigate = useNavigate();

    return (
        <Card
            elevation={2}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                '&:hover': {
                    boxShadow: 6
                }
            }}
        >
            <CardActionArea
                onClick={() => navigate(path)}
                sx={{ height: '100%', p: 1 }}
            >
                <Box sx={{
                    height: '150px',
                    backgroundColor: '#f0f0f0',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Typography color="text.secondary">
                        Image Placeholder
                    </Typography>
                </Box>
                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h2"
                        component="h2"
                        sx={{
                            fontSize: '1.25rem',
                            fontWeight: 500
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: '0.875rem'
                        }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}