import React, { useState } from 'react';
import { Button, TextField, Box, Card, CardContent, CardHeader } from '@mui/material';
import axios from 'axios';
import useSessionStore from '../zustandStorage/UserSessionInfo';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setSession } = useSessionStore();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://scrumboard-project.vercel.app/login', {email, password});
            const {token, userId, isAdmin} = response.data;
            setSession(token, userId, isAdmin);
            onLogin(isAdmin);
        } catch (error) {
            console.error('Failed to login:', error);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Card style={{ width: '100%', maxWidth: 400, boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1), 0px 0px 0px 2px rgba(0, 0, 0, 0.05)' }}>
                <CardHeader title="Login" />
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
