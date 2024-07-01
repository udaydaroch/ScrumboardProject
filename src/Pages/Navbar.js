import React, { useState } from 'react';
import { AppBar, Button, Toolbar, IconButton, Drawer, List, ListItem, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ onPageChange, onLogout, isLoggedIn, isAdmin }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLinkClick = (page) => {
        onPageChange(page);
        setDrawerOpen(false);
    };

    const handleLogout = () => {
        console.log("logout");
        onLogout();
        setDrawerOpen(false);
    };

    const menuItems = isLoggedIn
        ? [
            { text: 'Scrumboard', path: '/scrumboard' },
            { text: 'Staff List', path: '/stafflist' },
            { text: 'Setup Board', path: '/setupboard', isAdmin: true },
            { text: 'Logout', path: '/login', onClick: handleLogout },
        ]
        : [
            { text: 'Login', path: '/login' }
        ];

    return (
        <AppBar position="sticky">
            <Toolbar>
                {isMobile ? (
                    <>
                        <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                            <List>
                                {menuItems.map((item, index) => {
                                    if (item.isAdmin && !isAdmin) {
                                        return null;
                                    }
                                    return (
                                        <ListItem
                                            key={index}
                                            button
                                            component={Link}
                                            to={item.path}
                                            onClick={item.onClick || (() => handleLinkClick(item.text))}
                                        >
                                            {item.text}
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Drawer>
                    </>
                ) : (
                    <>
                        {menuItems.map((item, index) => {
                            if (item.isAdmin && !isAdmin) {
                                return null;
                            }
                            return (
                                <Button
                                    key={index}
                                    color="inherit"
                                    component={Link}
                                    to={item.path}
                                    onClick={item.onClick || (() => handleLinkClick(item.text))}
                                >
                                    {item.text}
                                </Button>
                            );
                        })}
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
