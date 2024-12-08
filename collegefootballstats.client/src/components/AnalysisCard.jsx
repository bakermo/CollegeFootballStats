import { Card, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AnalysisCard({ title, description, path, imageSrc }) {
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
                transition: 'all 0.3s ease-in-out', 
                '&:hover': {
                    backgroundColor: '#262a42',
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 6px 12px rgba(82, 101, 156, 0.2)', 
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
                        fontFamily: 'Georgia, serif',
                        transition: 'color 0.3s ease-in-out'
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
                        lineHeight: 1.5,
                        transition: 'color 0.3s ease-in-out'
                    }}
                >
                    {description}
                </Typography>
            </Box>
            <Box
                sx={{
                    width: '50%',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden', 
                }}
            >
                <img
                    src={imageSrc}
                    alt={title}
                    style={{
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'fill', 
                        objectPosition: 'center', 
                    }}
                />
            </Box>
        </Card>
    );
}