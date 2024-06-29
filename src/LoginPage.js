// LoginPage.js
import React from 'react';
import { Button, TextField, Box } from '@mui/material';

const LoginPage = ({ onLogin }) => {
    const handleLogin = () => {
        onLogin();
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <TextField label="Username" margin="normal" />
            <TextField label="Password" type="password" margin="normal" />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
        </Box>
    );
};

export default LoginPage;
