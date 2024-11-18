import { Box, Container, Typography, Paper, TextField, FormGroup, FormControlLabel, Checkbox, Button, Snackbar, Alert } from '@mui/material';
import Header from '../components/Header';
import { useState } from 'react';

function Feedback() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        feedback: '',
        visualizations: {
            starPower: false,
            gameChangers: false,
            conferenceClash: false,
            sidelineShuffle: false,
            draftDay: false
        }
    });

    // Add state for notifications
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            visualizations: {
                ...prev.visualizations,
                [name]: checked
            }
        }));
    };

    // Add validation function
    const validateForm = () => {
        if (!formData.name.trim()) {
            setErrorMessage('Please enter your name');
            setErrorOpen(true);
            return false;
        }
        if (!formData.email.trim()) {
            setErrorMessage('Please enter your email');
            setErrorOpen(true);
            return false;
        }
        if (!formData.feedback.trim()) {
            setErrorMessage('Please enter your feedback');
            setErrorOpen(true);
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            setSuccessOpen(true);
            handleClear();
        }
    };

    const handleClear = () => {
        setFormData({
            name: '',
            email: '',
            feedback: '',
            visualizations: {
                starPower: false,
                gameChangers: false,
                conferenceClash: false,
                sidelineShuffle: false,
                draftDay: false
            }
        });
    };

    // Add notification close handlers
    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessOpen(false);
    };

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Header />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        backgroundColor: 'white'
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            color: '#212D40',
                            fontFamily: 'Georgia, serif',
                            fontSize: '2rem',
                            fontWeight: 700,
                            mb: 1
                        }}
                    >
                        User Feedback
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: '#3F4C64',
                            mb: 4
                        }}
                    >
                        Complete the form below to supply the team with feedback
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 3,
                            mb: 4
                        }}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3F4C64',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#3F4C64',
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3F4C64',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#3F4C64',
                                    }
                                }}
                            />
                        </Box>

                        <Typography
                            sx={{
                                color: '#212D40',
                                mb: 2,
                                fontWeight: 500
                            }}
                        >
                            Select which visualizations you are leaving feedback for
                        </Typography>

                        <FormGroup sx={{ mb: 4 }}>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 1
                            }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.visualizations.starPower}
                                            onChange={handleCheckboxChange}
                                            name="starPower"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#3F4C64',
                                                },
                                            }}
                                        />
                                    }
                                    label="Star Power: Recruits to Pros"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.visualizations.sidelineShuffle}
                                            onChange={handleCheckboxChange}
                                            name="sidelineShuffle"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#3F4C64',
                                                },
                                            }}
                                        />
                                    }
                                    label="Sideline Shuffle: Coaching Impact"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.visualizations.gameChangers}
                                            onChange={handleCheckboxChange}
                                            name="gameChangers"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#3F4C64',
                                                },
                                            }}
                                        />
                                    }
                                    label="Game Changers: Player Impact Analysis"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.visualizations.draftDay}
                                            onChange={handleCheckboxChange}
                                            name="draftDay"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#3F4C64',
                                                },
                                            }}
                                        />
                                    }
                                    label="Draft Day Dividends: Position Performance"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.visualizations.conferenceClash}
                                            onChange={handleCheckboxChange}
                                            name="conferenceClash"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: '#3F4C64',
                                                },
                                            }}
                                        />
                                    }
                                    label="Conference Clash: Offensive Evolution"
                                />
                            </Box>
                        </FormGroup>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Write your feedback details here..."
                            name="feedback"
                            value={formData.feedback}
                            onChange={handleInputChange}
                            variant="outlined"
                            sx={{
                                mb: 4,
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3F4C64',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#3F4C64',
                                }
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#212D40',
                                    '&:hover': {
                                        backgroundColor: '#3F4C64'
                                    }
                                }}
                            >
                                Submit
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={handleClear}
                                sx={{
                                    color: '#212D40',
                                    borderColor: '#212D40',
                                    '&:hover': {
                                        borderColor: '#3F4C64',
                                        color: '#3F4C64'
                                    }
                                }}
                            >
                                Clear
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>

            {/* Success Notification */}
            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    variant="filled"
                    sx={{
                        width: '100%',
                        backgroundColor: '#3F4C64'
                    }}
                >
                    Your feedback has been received!
                </Alert>
            </Snackbar>

            {/* Error Notification */}
            <Snackbar
                open={errorOpen}
                autoHideDuration={3000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseError}
                    severity="error"
                    variant="filled"
                    sx={{
                        width: '100%',
                        backgroundColor: '#212D40'
                    }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Feedback;