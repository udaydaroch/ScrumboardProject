import React, { useState, useEffect } from 'react';
import { Box, Button, Stepper, Step, StepLabel } from '@mui/material';
import Step1 from '../StepComponents/Step1';
import Step2 from '../StepComponents/Step2';
import useSessionStore from "../zustandStorage/UserSessionInfo";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const steps = ['Add Date and Team', 'Add Tasks'];

const SetupBoard = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        date: '',
        team: '',
        tasks: [],
        allowCreateTasks: false,
    });
    const [validationError, setValidationError] = useState(false); // State for validation error

    const { userId, token, isAdmin } = useSessionStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !userId || !isAdmin) {
            navigate('/scrumboard');
        }
    }, [token, userId, isAdmin, navigate]);

    const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State for Snackbar message

    const handleSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const validateStep = (step) => {
        if (step === 0) {
            return formData.date && formData.team;
        } else if (step === 1) {
            return formData.tasks.length > 0;
        }
        return true;
    };

    const handleNext = () => {
        // Validation check before proceeding to the next step
        if (validateStep(activeStep)) {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
            setValidationError(false); // Reset validation error state
        } else {
            setValidationError(true);
            if (activeStep === 0) {
                handleSnackbar('Please select both date and team.');
            } else if (activeStep === 1) {
                handleSnackbar('Please add at least one task.');
            }
        }
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleStepClick = (stepIndex) => {
        if (stepIndex < activeStep) {
            setActiveStep(stepIndex);
        } else if (validateStep(activeStep)) {
            setActiveStep(stepIndex);
            setValidationError(false);
        } else {
            setValidationError(true);
            handleSnackbar(stepIndex === 0 ? 'Please select both date and team.' : 'Please add at least one task.');
        }
    };

    const handleFormDataChange = (newData) => {
        setFormData({ ...formData, ...newData });
    };

    const handleAddTask = (task) => {
        setFormData({ ...formData, tasks: [...formData.tasks, task] });
    };

    const handleDeleteTask = (taskToDelete) => {
        setFormData({
            ...formData,
            tasks: formData.tasks.filter(task => task !== taskToDelete)
        });
    };

    const handleEditTask = (editedTask) => {
        setFormData({
            ...formData,
            tasks: formData.tasks.map(task => task === editedTask.oldTask ? editedTask.newTask : task)
        });
    };

    const handleSubmit = () => {
        const { date, team, tasks, allowCreateTasks } = formData;

        if (!tasks || tasks.length === 0) {
            handleSnackbar('Please add at least one task before submitting.');
            return;
        }

        const scrumboardData = {
            scrumboard: {
                date: date,
                team_id: team,
                isEditable: allowCreateTasks,
                tasks: tasks.map((task, index) => ({
                    title: task.task,
                    estimation_time: task.estimationTime,
                    created_by: userId,
                    position_on_board: index + 1,
                    num_subtasks: task.subTasks.length,
                    subtasks: task.subTasks.map(subtask => ({
                        title: subtask.title,
                        description: subtask.description,
                        completed: subtask.completed || false
                    }))
                })),
            }
        };

        axios.post(`https://scrumboard-project-back-end.vercel.app/setUpBoard`, scrumboardData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                navigate('/scrumboard/' + response.data);
            })
            .catch(error => {
                console.error('Error:', error);
                handleSnackbar('Error submitting board setup.');
            });
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
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
            {activeStep === 0 && (
                <Step1
                    data={formData}
                    onDataChange={handleFormDataChange}
                    validationError={validationError} // Pass validation error state to Step1 component
                />
            )}
            {activeStep === 1 && (
                <Step2
                    tasks={formData.tasks}
                    onAddTask={handleAddTask}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleEditTask}
                />
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SetupBoard;
