import React, { useState } from 'react';
import { Button, TextField, Box, Card, CardContent, CardHeader } from '@mui/material';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        onLogin(username);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Card style={{ width: '100%', maxWidth: 400, boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1), 0px 0px 0px 2px rgba(0, 0, 0, 0.05)' }}>
                <CardHeader title="Login" />
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            fullWidth
                            autoComplete="off"
                            InputLabelProps={{
                                classes: {
                                    root: 'input-label-root',
                                    shrink: 'input-label-shrink',
                                },
                            }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            fullWidth
                            autoComplete="off"
                            InputLabelProps={{
                                classes: {
                                    root: 'input-label-root',
                                    shrink: 'input-label-shrink',
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            style={{ marginTop: 16 }}
                        >
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
