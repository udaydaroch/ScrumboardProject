import React from 'react';
import { useDrop } from 'react-dnd';
import { Paper, Typography, Box } from '@mui/material';
import Task from './Task';

const Column = ({ column, tasks, moveTask }) => {
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

    return (
        <Paper ref={drop} elevation={3} style={{ padding: 16, width: 250 }}>
            <Typography variant="h6">{column.title}</Typography>
            <Box style={{ minHeight: 100, marginTop: 16 }}>
                {tasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} columnId={column.id} />
                ))}
            </Box>
        </Paper>
    );
};

export default Column;
