import React, {useEffect, useState} from 'react';
import { Box, Button, Stepper, Step, StepLabel } from '@mui/material';
import Step1 from '../StepComponents/Step1';
import Step2 from '../StepComponents/Step2';
import Step3 from '../StepComponents/Step3';
import useSessionStore from "../zustandStorage/UserSessionInfo";
import {useNavigate} from "react-router-dom";

const steps = ['Add Date and Team', 'Add Tasks', 'Allow Team to Create Tasks'];

const SetupBoard = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        date: '',
        team: '',
        tasks: [],
        allowCreateTasks: false,
    });

    const {userId,token, isAdmin} = useSessionStore();
    const navigate = useNavigate();
    useEffect (() => {
        if (!token || !userId || !isAdmin ) {
            navigate('/scrumboard');
        }

    }, [token, userId]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepClick = (stepIndex) => {
        setActiveStep(stepIndex);
    };

    const handleFormDataChange = (newData) => {
        setFormData({ ...formData, ...newData });
    };

    const handleAddTask = (task) => {
        setFormData({ ...formData, tasks: [...formData.tasks, task] });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', justifyContent: 'center', marginBottom: '20px' }}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel
                            onClick={() => handleStepClick(index)}
                            sx={{
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                '&.MuiStepLabel-active': {
                                    fontWeight: 'bold',
                                },
                            }}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box display="flex" justifyContent="space-between" width="100%" marginTop={2}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
            {activeStep === 0 && <Step1 data={formData} onDataChange={handleFormDataChange} />}
            {activeStep === 1 && <Step2 tasks={formData.tasks} onAddTask={handleAddTask} />}
            {activeStep === 2 && <Step3 data={formData} onDataChange={handleFormDataChange} />}

        </Box>
    );
};

export default SetupBoard;
