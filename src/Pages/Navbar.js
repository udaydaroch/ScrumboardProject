import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout, isAdmin }) => {
    console.log(`Navbar isAdmin: ${isAdmin}`); // Debugging line
    return (
        <AppBar position="static">
            <Toolbar>
                <Button color="inherit" component={Link} to="/scrumboard">
                    Scrumboard
                </Button>
                <Button color="inherit" component={Link} to="/stafflist">
                    Staff List
                </Button>
                {isAdmin && (
                    <Button color="inherit" component={Link} to="/setupboard">
                        Setup Board
                    </Button>
                )}
                <Button color="inherit" onClick={onLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
