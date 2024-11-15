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
                    }
                }
            }}
        >
            <Box sx={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 2
            }}>
                <Typography
                    className="card-text"
                    variant="h2"
                    component="h2"
                    sx={{
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        mb: 1,
                        color: '#212D40'
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    className="card-text"
                    variant="body2"
                    sx={{
                        fontSize: '0.875rem',
                        color: 'text.secondary'
                    }}
                >
                    {description}
                </Typography>
            </Box>
            <Box sx={{
                width: '50%',
                bgcolor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography sx={{ color: 'text.secondary' }}>
                    Image Placeholder
                </Typography>
            </Box>
        </Card>
    );
}