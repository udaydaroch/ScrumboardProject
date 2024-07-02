import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Card,
    Typography,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Snackbar,
    Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Pagination } from '@mui/lab';

const Step2 = ({ tasks, onAddTask, onDeleteTask, onEditTask }) => {
    const [task, setTask] = useState('');
    const [subTaskTitle, setSubTaskTitle] = useState('');
    const [subTask, setSubTask] = useState('');
    const [subTasks, setSubTasks] = useState([]);
    const [estimationTime, setEstimationTime] = useState('');
    const [page, setPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const tasksPerPage = 4;
    const maxSubTaskTitleLength = 20;
    const maxSubTaskLength = 200;

    const handleAddSubTask = () => {
        if (subTaskTitle && subTaskTitle.length <= maxSubTaskTitleLength && subTask && subTask.length <= maxSubTaskLength) {
            setSubTasks([...subTasks, { title: subTaskTitle, description: subTask }]);
            setSubTaskTitle('');
            setSubTask('');
        } else {
            setSnackbarMessage('Sub-task title and description are required and should be within allowed length.');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteSubTask = (index) => {
        const newSubTasks = [...subTasks];
        newSubTasks.splice(index, 1);
        setSubTasks(newSubTasks);
    };

    const handleAddTask = () => {
        if (!task) {
            setSnackbarMessage('Task title is required.');
            setSnackbarOpen(true);
            return;
        }
        if (subTasks.length === 0) {
            setSnackbarMessage('At least one sub-task is required.');
            setSnackbarOpen(true);
            return;
        }
        if (!estimationTime) {
            setSnackbarMessage('Estimation time is required.');
            setSnackbarOpen(true);
            return;
        }

        // Convert estimationTime to float
        const parsedEstimationTime = parseFloat(estimationTime);
        if (isNaN(parsedEstimationTime)) {
            setSnackbarMessage('Estimation time must be a valid number.');
            setSnackbarOpen(true);
            return;
        }

        onAddTask({ task, subTasks, estimationTime: parsedEstimationTime });
        setTask('');
        setSubTasks([]);
        setEstimationTime('');
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleOpenDialog = (task) => {
        setSelectedTask(task);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedTask(null);
    };

    const handleEditTask = () => {
        onEditTask(selectedTask);
        handleCloseDialog();
    };

    const handleTaskChange = (field, value) => {
        setSelectedTask({ ...selectedTask, [field]: value });
    };

    const indexOfLastTask = page * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    const cardStyle = {
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1), 0px 0px 0px 2px rgba(0, 0, 0, 0.05)',
        marginBottom: '16px',
        height: "100%",
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'column'
    };

    const paginationStyle = {
        marginTop: 'auto',
        textAlign: 'center',
        padding: '16px',
        justifyContent: "center",
        display: "flex",
        alignItems: 'center'
    };

    return (
        <Grid container spacing={2} sx={{ marginTop: "10px" }}>
            {/* Form Card */}
            <Grid item xs={12} md={6}>
                <Card style={cardStyle}>
                    <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>Add Task</Typography>
                    <Divider />
                    <div style={{ padding: "16px" }}>
                        <TextField
                            label="Task Title"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            margin="normal"
                            fullWidth
                        />
                        {/* Sub-Task Section */}
                        <Card style={{ marginTop: "16px", padding: "16px", boxShadow: 'none' }}>
                            <Typography variant="subtitle1">Add Sub-Task</Typography>
                            <Divider />
                            <Box display="flex" alignItems="center" marginTop="16px">
                                <TextField
                                    label="Sub-Task Title"
                                    value={subTaskTitle}
                                    onChange={(e) => setSubTaskTitle(e.target.value)}
                                    margin="normal"
                                    fullWidth
                                    inputProps={{ maxLength: maxSubTaskTitleLength }}
                                    helperText={`${subTaskTitle.length}/${maxSubTaskTitleLength}`}
                                />
                                <TextField
                                    label="Sub-Task Description"
                                    value={subTask}
                                    onChange={(e) => setSubTask(e.target.value)}
                                    margin="normal"
                                    fullWidth
                                    inputProps={{ maxLength: maxSubTaskLength }}
                                    helperText={`${subTask.length}/${maxSubTaskLength}`}
                                />
                                <IconButton onClick={handleAddSubTask} color="primary" disabled={subTaskTitle.length > maxSubTaskTitleLength || subTask.length > maxSubTaskLength}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Card>
                        <Box style={{ maxHeight: '240px', padding: "16px", overflowY: subTasks.length > 3 ? 'scroll' : 'hidden' }}>
                            <Typography variant="subtitle1">Sub-Tasks</Typography>
                            <Divider />
                            <List>
                                {subTasks.map((subTask, index) => (
                                    <Card key={index} sx={{ minWidth: "200px", marginTop: "4px", boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1), 0px 0px 0px 2px rgba(0, 0, 0, 0.05)' }}>
                                        <ListItem>
                                            <ListItemText primary={subTask.title} />
                                            <IconButton color="secondary" aria-label="delete" onClick={() => handleDeleteSubTask(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                    </Card>
                                ))}
                            </List>
                        </Box>
                        <TextField
                            label="Estimation Time"
                            value={estimationTime}
                            onChange={(e) => setEstimationTime(e.target.value)}
                            margin="normal"
                            fullWidth
                            type="number" // Ensure it's treated as a number input
                            InputProps={{ inputProps: { step: 0.01 } }} // Allow floating-point numbers
                        />
                        <Box display="flex" justifyContent="center" marginTop="16px">
                            <Button variant="contained" color="primary" onClick={handleAddTask}>
                                Add Task
                            </Button>
                        </Box>
                    </div>
                </Card>
            </Grid>
            {/* Task List Card */}
            <Grid item xs={12} md={6}>
                <Card style={cardStyle}>
                    <Typography variant="h6" gutterBottom style={{ textAlign: "center", marginTop: "10px" }}>Task List</Typography>
                    <Divider />
                    <Box display="flex" flexDirection="column" alignItems="flex" style={{ padding: "16px", height: '100%' }}>
                        <Typography variant="body2" style={{ marginTop: "10px" }}>Total Tasks: {tasks.length}</Typography>
                        {currentTasks.map((task, index) => (
                            <Card key={index} style={{ marginTop: "10px", minWidth: "420px" }}>
                                <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                                    <Box sx={{ overflowX: 'auto', maxWidth: 200 }}>
                                        <Typography variant="subtitle1" noWrap>{task.task}</Typography>
                                    </Box>
                                    <Box>
                                        <IconButton color="primary" onClick={() => handleOpenDialog(task)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => onDeleteTask(task)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Card>
                        ))}
                        <Box style={paginationStyle}>
                            {tasks.length > tasksPerPage && (
                                <Pagination
                                    count={Math.ceil(tasks.length / tasksPerPage)}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            )}
                        </Box>
                    </Box>
                </Card>
            </Grid>

            {/* Task Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Task Title"
                        value={selectedTask ? selectedTask.task : ''}
                        onChange={(e) => handleTaskChange('task', e.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    {selectedTask && selectedTask.subTasks.map((subTask, index) => (
                        <Card key={index} style={{ marginTop: "10px", boxShadow: 'none' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <TextField
                                    label="Sub-Task Title"
                                    value={subTask.title}
                                    onChange={(e) => {
                                        const newSubTasks = [...selectedTask.subTasks];
                                        newSubTasks[index].title = e.target.value;
                                        handleTaskChange('subTasks', newSubTasks);
                                    }}
                                    margin="normal"
                                    fullWidth
                                />
                                <TextField
                                    label="Sub-Task Description"
                                    value={subTask.description}
                                    onChange={(e) => {
                                        const newSubTasks = [...selectedTask.subTasks];
                                        newSubTasks[index].description = e.target.value;
                                        handleTaskChange('subTasks', newSubTasks);
                                    }}
                                    margin="normal"
                                    fullWidth
                                />
                                <IconButton color="secondary" aria-label="delete" onClick={() => handleDeleteSubTask(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                    <TextField
                        label="Estimation Time"
                        value={selectedTask ? selectedTask.estimationTime : ''}
                        onChange={(e) => handleTaskChange('estimationTime', e.target.value)}
                        margin="normal"
                        fullWidth
                        type="number" // Ensure it's treated as a number input
                        InputProps={{ inputProps: { step: 0.01 } }} // Allow floating-point numbers
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditTask} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

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
        </Grid>
    );
};

export default Step2;
