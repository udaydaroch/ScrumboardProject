import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Card,
    CardContent,
    CardHeader,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    FormControlLabel,
    Switch,
    Snackbar,
    Alert
} from '@mui/material';
import axios from "axios";
import useSessionStore from "../zustandStorage/UserSessionInfo";

const Step1 = ({ data, onDataChange }) => {
    const [teams, setTeams] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [userSession] = useSessionStore();
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`https://${process.env.REACT_APP_MYURL}/teams`,
                    {
                        headers: {
                            'X-Authorization': userSession.token
                        }
                    }
                );
                const fetchedTeams = response.data.map(team => ({
                    id: team.id,
                    name: team.name
                }));
                setTeams(fetchedTeams);

                // Set default team if data.team is not already set or if it's invalid
                if (!data.team || !fetchedTeams.some(team => team.id === data.team)) {
                    onDataChange({ team: fetchedTeams.length > 0 ? fetchedTeams[0].id : '' });
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
                setSnackbarMessage('Error fetching teams.');
                setSnackbarOpen(true);
            } finally {
                setInitialLoad(false);
            }
        };

        fetchTeams();
    }, [data.team, onDataChange]);

    const handleChange = (e) => {
        onDataChange({ [e.target.name]: e.target.value });
    };

    const handleSwitchChange = (e) => {
        onDataChange({ allowCreateTasks: e.target.checked });
    };

    if (initialLoad) {
        return null; // or loading indicator
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
            <Card style={{ width: '100%', maxWidth: 600 }}>
                <CardHeader title="Step 1: Add Date and Team" />
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={data.allowCreateTasks}
                                onChange={handleSwitchChange}
                                name="allowCreateTasks"
                            />
                        }
                        label="Allow Team to Create Tasks"
                    />
                </Box>
                <CardContent>
                    <TextField
                        label="Date"
                        name="date"
                        type="date"
                        value={data.date}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormControl margin="normal" fullWidth>
                        <InputLabel id="team-label">Team</InputLabel>
                        <Select
                            labelId="team-label"
                            name="team"
                            value={data.team}
                            onChange={handleChange}
                        >
                            {teams.map((team) => (
                                <MenuItem key={team.id} value={team.id}>
                                    {team.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="warning" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Step1;
