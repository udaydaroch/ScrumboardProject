import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Paper, Box, Typography, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';

const Task = ({ task, index, columnId, deleteTask }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task.id, index, columnId, hoverIndex: index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'TASK',
        hover: (item, monitor) => {
            if (item.id !== task.id) {
                item.hoverIndex = index;
            }
        },
    });

    const subTaskCount = task.subTasks.length;
    const estimation = task.estimation || 'N/A'; // Default to 'N/A' if no estimation provided

    return (
        <Paper
            ref={(node) => drag(drop(node))}
            style={{
                padding: 15,
                marginBottom: 12,
                backgroundColor: isDragging ? '#ddd' : '#fff',
                cursor: 'move',
                opacity: isDragging ? 0.7 : 1,
                boxShadow: isDragging
                    ? '0px 3px 6px rgba(0,0,0,0.3)'
                    : '0px 2px 3px rgba(0,0,0,0.1), 0px 0px 0px 2px rgba(0,0,0,0.05)', // Subtle shadow around the border
                transition: 'background-color 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease',
                borderLeft: `5px solid ${task.color}`, // Adjust border color based on task color
                borderRadius: 8, // Rounded corners
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">{task.content}</Typography>
                <Box display="flex" alignItems="center">
                    <Tooltip title="Task Details">
                        <IconButton size="small">
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    {columnId === 'column-4' && ( // Only show delete button if task is in the 'Done' column
                        <Tooltip title="Delete Task">
                            <IconButton size="small" onClick={() => deleteTask(task.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>
            <Box mt={1}>
                <Typography variant="body2" color="textSecondary">
                    Estimation: {estimation}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Sub-Tasks: {subTaskCount === 0 ? '0' : subTaskCount}
                </Typography>
            </Box>
        </Paper>
    );
};

export default Task;
