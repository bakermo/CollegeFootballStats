import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Container } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const menuItems = [
        { title: 'Game Changers', path: '/player-impact' },
        { title: 'Star Power', path: '/recruits-firstyear-influence' },
        { title: 'Conference Clash', path: '/conference-evolution' },
        { title: 'Sideline Shuffle', path: '/coaching-impact' },
        { title: 'Draft Day Dividends', path: '/draft-performance' },
        { title: 'Feedback', path: '/feedback' }
    ];

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (path) => {
        navigate(path);
        handleMenuClose();
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#de720d',
                boxShadow: 2
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ padding: '0 !important' }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            cursor: 'pointer',
                            color: '#fff'
                        }}
                        onClick={() => navigate('/')}
                    >
                        College Football Stat Hub
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        sx={{ color: '#fff' }}
                        aria-label="menu"
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                backgroundColor: '#212D40',
                                minWidth: '200px'
                            }
                        }}
                    >
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.path}
                                onClick={() => handleMenuClick(item.path)}
                                sx={{
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#3F4C64'
                                    }
                                }}
                            >
                                {item.title}
                            </MenuItem>
                        ))}
                    </Menu>
                </Toolbar>
            </Container>
        </AppBar>
    );
}