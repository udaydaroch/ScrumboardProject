import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import Column from './BoardComponents/Column';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import useSessionStore from "../zustandStorage/UserSessionInfo";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const initialData = {
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: [],
      color: '#ccc', // Grey
    },
    'column-2': {
      id: 'column-2',
      title: 'Doing',
      taskIds: [],
      color: '#2196f3', // Blue
    },
    'column-3': {
      id: 'column-3',
      title: 'Under Review',
      taskIds: [],
      color: '#ffc107', // Yellow
    },
    'column-4': {
      id: 'column-4',
      title: 'Done',
      taskIds: [],
      color: '#4caf50', // Green
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};

const Scrumboard = () => {
  const [tasks, setTasks] = useState({});
  const [data, setData] = useState(initialData);
  const [activeDate, setActiveDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    content: '',
    description: '',
    estimation: '',
    column: 'column-1',
    subTasks: [],
  });
  const [isEditable, setIsEditable] = useState(true);
  const { userId, token,isAdmin,teamId} = useSessionStore();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
    } else {
      if (params.id && isAdmin) {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/getBoard/${params.id}`, {
          headers: {
            'X-Authorization': token,
          }
        })
            .then(response => {
              setIsEditable(response.data.isEditable);
              processData(response.data.tasks);
            })
            .catch(error => {
              console.error('Error fetching scrumboard data:', error);
            });
      } else {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/team/${teamId}/getBoardByDate/${activeDate.toISOString().split('T')[0]}`, {
          headers: {
            'X-Authorization': token,
          }
        })
            .then(response => {
              console.log("called");
              console.log(response.data);
              setIsEditable(response.data.isEditable);
              processData(response.data.tasks);
            })
            .catch(error => {
              console.error('Error fetching scrumboard data:', error);
            });
      }
    }
  }, [token, userId, navigate, params.id, activeDate]);

  const processData = (fetchedTasks) => {
    if (!fetchedTasks || fetchedTasks.length === 0) {
      setTasks({});
      setData(initialData);
      return;
    }

    const taskMap = {};
    const columnMap = {
      'todo': 'column-1',
      'Doing': 'column-2',
      'Under Review': 'column-3',
      'Done': 'column-4',
    };
    const columns = {
      'column-1': { ...initialData.columns['column-1'], taskIds: [] },
      'column-2': { ...initialData.columns['column-2'], taskIds: [] },
      'column-3': { ...initialData.columns['column-3'], taskIds: [] },
      'column-4': { ...initialData.columns['column-4'], taskIds: [] },
    };

    console.log(fetchedTasks);
    fetchedTasks.forEach(task => {
      const taskId = `task-${task.id}`;
      taskMap[taskId] = {
        id: taskId,
        content: task.title,
        description: task.description,
        estimation: task.estimation_time,
        subTasks: task.subtasks || [],
      };
      columns[columnMap[task.column_name]].taskIds.push(taskId);
    });

    setTasks(taskMap);
    setData({ ...data, columns });
  };


  const moveTask = (source, destination) => {
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (!start || !finish) {
      return;
    }

    const newStartTaskIds = Array.from(start.taskIds);
    newStartTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: newStartTaskIds,
    };

    const newFinishTaskIds = Array.from(finish.taskIds);
    newFinishTaskIds.splice(destination.index, 0, source.draggableId);
    const newFinish = {
      ...finish,
      taskIds: newFinishTaskIds,
    };

    const newColumns = {
      ...data.columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    };

    setData({
      ...data,
      columns: newColumns,
    });
  };

  const handleAddTask = () => {
    const newTaskId = `task-${Date.now()}`;
    const task = {
      id: newTaskId,
      content: newTask.content,
      description: newTask.description,
      estimation: newTask.estimation,
      subTasks: newTask.subTasks,
    };

    const newTasks = {
      ...tasks,
      [newTaskId]: task,
    };

    const column = data.columns[newTask.column];
    const newTaskIds = [...column.taskIds, newTaskId];

    const newColumns = {
      ...data.columns,
      [newTask.column]: {
        ...column,
        taskIds: newTaskIds,
      },
    };

    setData({
      ...data,
      columns: newColumns,
    });

    setTasks(newTasks);
    setIsDialogOpen(false);
    setNewTask({
      content: '',
      description: '',
      estimation: '',
      column: 'column-1',
      subTasks: [],
    });
  };

  const handlePrevDate = () => {
    const prevDate = new Date(activeDate);
    prevDate.setDate(activeDate.getDate() - 1);
    setActiveDate(prevDate);
  };

  const handleNextDate = () => {
    const nextDate = new Date(activeDate);
    nextDate.setDate(activeDate.getDate() + 1);
    setActiveDate(nextDate);
  };

  const handleDateChange = (date) => {
    setActiveDate(date);
  };

  const handleSubTaskChange = (index, value) => {
    const updatedSubTasks = [...newTask.subTasks];
    updatedSubTasks[index] = value;
    setNewTask({ ...newTask, subTasks: updatedSubTasks });
  };

  const handleAddSubTask = () => {
    setNewTask({ ...newTask, subTasks: [...newTask.subTasks, ''] });
  };

  const handleRemoveSubTask = (index) => {
    const updatedSubTasks = newTask.subTasks.filter((_, i) => i !== index);
    setNewTask({ ...newTask, subTasks: updatedSubTasks });
  };

  const deleteTask = (taskId) => {
    const newTasks = { ...tasks };
    delete newTasks[taskId];

    const newColumns = { ...data.columns };
    Object.keys(newColumns).forEach((columnId) => {
      const column = newColumns[columnId];
      column.taskIds = column.taskIds.filter((id) => id !== taskId);
    });

    setTasks(newTasks);
    setData({
      ...data,
      columns: newColumns,
    });
  };

  const totalTasks = Object.keys(tasks).length;

  const getColumnProgress = (columnId) => {
    const column = data.columns[columnId];
    const numTasks = column.taskIds.length;
    return numTasks > 0 ? (numTasks / totalTasks) * 100 : 0;
  };

  return (
      <DndProvider backend={HTML5Backend}>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{marginTop:"20px"}}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center">
                <IconButton size="large" onClick={handlePrevDate}>
                  <Typography variant="h4">←</Typography>
                </IconButton>
                <TextField
                    id="date-picker"
                    label="Select Date"
                    type="date"
                    value={activeDate.toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                />
                <IconButton size="large" onClick={handleNextDate}>
                  <Typography variant="h4">→</Typography>
                </IconButton>
              </Box>
              <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsDialogOpen(true)}
                    fullWidth
                >
                  Add Task
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box width="100%" display="flex" justifyContent="center" mt={2}>
          <Box width="90%">
            <Box display="flex" justifyContent="center">
              {data.columnOrder.map((columnId) => (
                  <Box
                      key={columnId}
                      sx={{
                        backgroundColor: data.columns[columnId].color,
                        flexBasis: `${getColumnProgress(columnId)}%`,
                        height: 10,
                      }}
                  />
              ))}
            </Box>
          </Box>
        </Box>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Add a new task</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Task Content"
                fullWidth
                value={newTask.content}
                onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Description"
                fullWidth
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Estimation"
                fullWidth
                value={newTask.estimation}
                onChange={(e) => setNewTask({ ...newTask, estimation: e.target.value })}
            />
            <TextField
                margin="dense"
                label="Column"
                select
                fullWidth
                value={newTask.column}
                onChange={(e) => setNewTask({ ...newTask, column: e.target.value })}
            >
              {data.columnOrder.map((columnId) => (
                  <MenuItem key={columnId} value={columnId}>
                    {data.columns[columnId].title}
                  </MenuItem>
              ))}
            </TextField>
            <Box mt={2}>
              <Typography variant="h6">Sub-Tasks</Typography>
              {newTask.subTasks.map((subTask, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <TextField
                        fullWidth
                        value={subTask}
                        onChange={(e) => handleSubTaskChange(index, e.target.value)}
                        placeholder={`Sub-task ${index + 1}`}
                    />
                    <IconButton color="secondary" onClick={() => handleRemoveSubTask(index)}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
              ))}
              <Button variant="outlined" onClick={handleAddSubTask}>
                Add Sub-Task
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddTask} color="primary">
              Add Task
            </Button>
          </DialogActions>
        </Dialog>

        <Box display="flex" justifyContent="center" p={2} flexWrap="wrap">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const columnTasks = column.taskIds.map((taskId) => tasks[taskId]);

            return (
                <Box key={column.id} display="flex" flexDirection="column" alignItems="center" m={1}>
                  <Column column={column} tasks={columnTasks} moveTask={moveTask} deleteTask={deleteTask} />
                </Box>
            );
          })}
        </Box>
      </DndProvider>
  );
};

export default Scrumboard;
