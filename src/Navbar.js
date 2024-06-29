// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Dashboard
                </Typography>
                <Button color="inherit" component={Link} to="/scrumboard">
                    Scrumboard
                </Button>
                <Button color="inherit" component={Link} to="/stafflist">
                    Staff List
                </Button>
                <Button color="inherit" onClick={onLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
