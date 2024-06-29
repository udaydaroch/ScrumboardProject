import React from 'react';
import { useDrop } from 'react-dnd';
import { Paper, Typography, Box, Divider } from '@mui/material';
import Task from './Task';

const Column = ({ column, tasks, moveTask, deleteTask }) => {
    const [, drop] = useDrop({
        accept: 'TASK',
        drop: (item, monitor) => {
            moveTask(
                { draggableId: item.id, droppableId: item.columnId, index: item.index },
                { droppableId: column.id, index: monitor.getItem().hoverIndex || 0 }
            );
        },
        hover: (item, monitor) => {
            if (!monitor.isOver({ shallow: true })) {
                return;
            }
            const hoverIndex = tasks.length;
            if (item.hoverIndex !== hoverIndex) {
                item.hoverIndex = hoverIndex;
            }
        },
    });

    let borderColor;
    switch (column.color) {
        case '#ccc':
            borderColor = '#555'; // Darker grey for first column
            break;
        case '#2196f3':
            borderColor = '#1976d2'; // Darker blue for second column
            break;
        case '#4caf50':
            borderColor = '#388e3c'; // Darker green for fourth column
            break;
        case '#ffc107':
            borderColor = '#ff9800'; // Darker yellow for third column
            break;
        default:
            borderColor = '#000'; // Default fallback color
            break;
    }

    return (
        <Paper
            ref={drop}
            elevation={6}
            sx={{
                borderTop: `4px solid ${borderColor}`,
                padding: 1,
                width: 260,
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.05)',
                },
                borderBottom: `4px solid ${borderColor}`, // Customized border thickness and color
            }}
        >
            <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                {column.title}
            </Typography>
            <Divider sx={{ mb: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
            <Box sx={{ minHeight: 100, mt: 1 }}>
                {tasks.map((task, index) => (
                    <Task
                        key={task.id}
                        task={task}
                        index={index}
                        columnId={column.id}
                        deleteTask={deleteTask}
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default Column;
