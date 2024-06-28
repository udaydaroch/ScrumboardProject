import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Paper, Box } from '@mui/material';

const Task = ({ task, index, columnId }) => {
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

    return (
        <Paper
            ref={(node) => drag(drop(node))}
            style={{
                padding: 8,
                marginBottom: 8,
                backgroundColor: isDragging ? '#ddd' : '#fff',
            }}
        >
            <Box>{task.content}</Box>
        </Paper>
    );
};

export default Task;
