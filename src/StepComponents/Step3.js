// Step3.js
import React from 'react';
import { Box, FormControlLabel, Switch } from '@mui/material';

const Step3 = ({ data, onDataChange }) => {
    const handleSwitchChange = (e) => {
        onDataChange({ allowCreateTasks: e.target.checked });
    };

    return (
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
    );
};

export default Step3;
