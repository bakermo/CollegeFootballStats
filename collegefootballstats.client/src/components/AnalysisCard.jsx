import { Card, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AnalysisCard({ title, description, path }) {
    const navigate = useNavigate();

    return (
        <Card
            onClick={() => navigate(path)}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                height: '200px',
                cursor: 'pointer',
                backgroundColor: '#fff',
                '&:hover': {
                    backgroundColor: '#3F4C64',
                    '& .card-text': {
                        color: '#fff'
                    },
                    '& .card-description': {
                        color: 'rgba(255, 255, 255, 0.8)'
                    }
                }
            }}
        >
            <Box sx={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 3
            }}>
                <Typography
                    className="card-text"
                    variant="h2"
                    component="h2"
                    sx={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        mb: 1,
                        color: '#212D40',
                        fontFamily: 'Georgia, serif'
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    className="card-description"
                    variant="body2"
                    sx={{
                        fontSize: '0.875rem',
                        color: '#666',
                        fontWeight: 400,
                        lineHeight: 1.5
                    }}
                >
                    {description}
                </Typography>
            </Box>
            <Box sx={{
                width: '50%',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography sx={{ color: '#666' }}>
                    Image Placeholder
                </Typography>
            </Box>
        </Card>
    );
}