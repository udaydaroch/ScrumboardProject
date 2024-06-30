import React from 'react';
import { Box, TextField, Card, CardContent, CardHeader, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const Step1 = ({ data, onDataChange }) => {
    const teams = ['Team A', 'Team B', 'Team C'];

    const handleChange = (e) => {
        onDataChange({ [e.target.name]: e.target.value });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
            <Card style={{ width: '100%', maxWidth: 600 }}>
                <CardHeader title="Step 1: Add Date and Team" />
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
                                <MenuItem key={team} value={team}>
                                    {team}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Step1;
