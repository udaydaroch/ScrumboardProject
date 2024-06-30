import React, { useState } from 'react';
import { Box, TextField, Button, Card, Typography, Divider, Pagination } from '@mui/material';
import './Step2.css'; // Import your CSS file

const Step2 = ({ tasks, onAddTask }) => {
    const [task, setTask] = useState('');
    const [subTasks, setSubTasks] = useState('');
    const [estimationTime, setEstimationTime] = useState('');
    const [page, setPage] = useState(1);
    const tasksPerPage = 4;

    const handleAddTask = () => {
        if (task && subTasks && estimationTime) {
            onAddTask({ task, subTasks, estimationTime });
            setTask('');
            setSubTasks('');
            setEstimationTime('');
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const indexOfLastTask = page * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    return (
        <div className="cardContainer">
            {/* Form Card */}
            <Card className="formCard">
                <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>Add Task</Typography>
                <Divider />
                <div style={{ marginTop: "20px" }}>
                    <TextField
                        label="Task Title"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        label="Sub-Tasks"
                        value={subTasks}
                        onChange={(e) => setSubTasks(e.target.value)}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        label="Estimation Time"
                        value={estimationTime}
                        onChange={(e) => setEstimationTime(e.target.value)}
                        margin="normal"
                        fullWidth
                    />
                </div>
                <Box display="flex" justifyContent="center" marginTop="16px">
                    <Button variant="contained" color="primary" onClick={handleAddTask}>
                        Add Task
                    </Button>
                </Box>
            </Card>

            {/* Task List Card */}
            <Card className="taskListCard">
                <Typography variant="h6" gutterBottom style={{ textAlign: "center" }}>Task List</Typography>
                <Divider></Divider>
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    {currentTasks.map((task, index) => (
                        <Card key={index} className="taskCard">
                            <Box p={2}>
                                <Typography variant="subtitle1">{task.task}</Typography>
                                <Typography variant="body2">Sub-Tasks: {task.subTasks}</Typography>
                                <Typography variant="body2">Estimation: {task.estimationTime}</Typography>
                            </Box>
                        </Card>
                    ))}
                </Box>
                {tasks.length > tasksPerPage && (
                    <Box className="paginationContainer">
                        <Pagination
                            count={Math.ceil(tasks.length / tasksPerPage)}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
            </Card>
        </div>
    );
};

export default Step2;
