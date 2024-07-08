import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDrag, useDrop } from 'react-dnd';
import {
    Paper,
    Box,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Checkbox,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import useSessionStore from "../../zustandStorage/UserSessionInfo";
import { useTeam } from './TeamContext';

const Task = ({ task, index, columnId, deleteTask }) => {
    const [{isDragging}, drag] = useDrag({
        type: 'TASK',
        item: {id: task.id, index, columnId, hoverIndex: index},
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
    const estimation = task.estimation || 'N/A';
    const {userId, token, teamId} = useSessionStore();
    const {teamMembers, loading} = useTeam();
    const [assignedUser, setAssignedUser] = useState(null);

    const [reviewingMembers, setReviewingMembers] = useState([]);

    const [assignedUserName, setAssignedUserName] = useState('');
    const [infoOpen, setInfoOpen] = useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);

    const [reviewingUser, setReviewingUser] = useState(null);
    const [reviewingUserName, setReviewingUserName] = useState('');
    const [reviewingDialogOpen, setReviewingDialogOpen] = useState(false)


    const [editingSubtask, setEditingSubtask] = useState(null);
    const [subtaskTitle, setSubtaskTitle] = useState('');
    const [subtaskDescription, setSubtaskDescription] = useState('');

    const fetchAssignedUser = async () => {
        try {
            const response = await axios.get(`https://scrumboard-project-back-end.vercel.app/getTaskUser/${task.id}`, {
                headers: {
                    'X-Authorization': token
                }
            });
            console.log(response.data);
            if (response.data && response.data.length > 0) {
                setAssignedUser(response.data[0]);
                setAssignedUserName(response.data[0].username);

            } else {
                setAssignedUser(null);
            }
        } catch (error) {
            console.error('Error fetching assigned user:', error);
        }
    };

    const fetchReviewingMembers = async () => {
        try {
            const response = await axios.get(`https://scrumboard-project-back-end.vercel.app/getReviewerByTaskId/${task.id}/team/${teamId}`, {
                headers: {
                    'X-Authorization': token
                }
            });
            setReviewingMembers(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching team members:', error);
        }
    };

    const fetchReviewUser = async () => {
        try {
            const response = await axios.get(`https://scrumboard-project-back-end.vercel.app/getTaskReviewer/${task.id}`, {
                headers: {
                    'X-Authorization': token
                }
            });

            if (response.data && response.data.length > 0) {
                setReviewingUser(response.data[0]);
                setAssignedUserName(response.data[0].username);

            } else {
                setReviewingUser(null);
            }
        } catch (error) {
            console.error('Error fetching assigned user:', error);
        }
    };


    useEffect(() => {
        fetchAssignedUser();
        fetchReviewUser();
        fetchReviewingMembers();
        console.log(reviewingMembers);
    }, [task.id, teamMembers, token]);

    const handleAssignDialogOpen = () => {
        setAssignDialogOpen(true);
    };

    const handleAssignDialogClose = () => {
        setAssignDialogOpen(false);
    };

    const handleReviewDialogOpen = () => {
        setReviewingDialogOpen(true);
    };

    const handleReviewDialogClose = () => {
        setReviewingDialogOpen(false);
    };


    const handleAssignUser = async (user) => {
        try {
            const assignedUserId = user.id; // The user picked from the list
            setAssignedUser(user);
            setAssignedUserName(user.username);

            await axios.post(`https://scrumboard-project-back-end.vercel.app/setTaskUser/task/${task.id}/user/${userId}/assigning/${assignedUserId}`, {}, {
                headers: {
                    'X-Authorization': token
                }
            });
            fetchAssignedUser();
            fetchReviewingMembers();
            handleAssignDialogClose();
        } catch (error) {
            console.error('Error assigning user:', error);
            setAssignedUser(null);
            setAssignedUserName('');
        }
    };

    const handleReviewUser = async (user) => {
        try {
            const ReviewUserId = user.id; // The user picked from the list
            setReviewingUser(user);
            setReviewingUserName(user.username);

            await axios.post(`https://scrumboard-project-back-end.vercel.app/setTaskReviewer/task/${task.id}/user/${userId}/reviewing/${ReviewUserId}`, {}, {
                headers: {
                    'X-Authorization': token
                }
            });
            await fetchReviewUser();
            handleReviewDialogClose();
        } catch (error) {
            console.error('Error assigning user:', error);
            setAssignedUser(null);
            setAssignedUserName('');
        }
    };


    const handleRemoveUser = async () => {
        try {

            console.log("called");
            console.log(task.id)
            console.log(userId);
            await axios.post(`https://scrumboard-project-back-end.vercel.app/removeTaskUser/${task.id}/removedBy/${userId}/assigned/${assignedUser.id}`, {}, {
                headers: {
                    'X-Authorization': token
                }
            });
            setAssignedUser(null);
            setAssignedUserName('');
            fetchReviewingMembers();
            await fetchAssignedUser();
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    const handleRemoveReviewer = async () => {
        try {
            setAssignedUser(null);
            setAssignedUserName('');
            console.log("called");
            await axios.post(`https://scrumboard-project-back-end.vercel.app/removeTaskReviewer/${task.id}/removedBy/${userId}/reviewing/${reviewingUser.id}`, {}, {
                headers: {
                    'X-Authorization': token
                }
            });
            fetchReviewUser();
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    const handleInfoOpen = () => {
        setInfoOpen(true);
    };

    const handleInfoClose = () => {
        setInfoOpen(false);
        setEditingSubtask(null);
        setSubtaskTitle('');
        setSubtaskDescription('');
    };

    const handleEditSubtask = (subtask) => {
        if (assignedUser && assignedUser.id === userId) {
            setEditingSubtask(subtask);
            setSubtaskTitle(subtask.title);
            setSubtaskDescription(subtask.description);
        }
    };

    const handleSubtaskChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') {
            setSubtaskTitle(value);
        } else if (name === 'description') {
            setSubtaskDescription(value);
        }
    };

    const handleSaveSubtask = async () => {
        try {
            await axios.put(`https://scrumboard-project-back-end.vercel.app/updateSubtask/${editingSubtask.id}`, {
                title: subtaskTitle,
                description: subtaskDescription,
                completed: editingSubtask.completed
            }, {
                headers: {
                    'X-Authorization': token
                }
            });

            setEditingSubtask(null);
            setSubtaskTitle('');
            setSubtaskDescription('');
            handleInfoClose();
        } catch (error) {
            console.error('Error saving subtask:', error);
        }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        try {

            await axios.delete(`https://scrumboard-project-back-end.vercel.app/deleteSubtask/${subtaskId}`, {
                headers: {
                    'X-Authorization': token
                }
            });

            handleInfoClose();
        } catch (error) {
            console.error('Error deleting subtask:', error);
        }
    };

    const handleCompleteSubtask = async (subtask) => {
        if (assignedUser && assignedUser.id === userId) {
            try {
                await axios.put(`https://scrumboard-project-back-end.vercel.app/updateSubtask/${subtask.id}`, {
                    title: subtask.title,
                    description: subtask.description,
                    completed: !subtask.completed
                }, {
                    headers: {
                        'X-Authorization': token
                    }
                });

                handleInfoClose();
            } catch (error) {
                console.error('Error completing subtask:', error);
            }
        }
    };

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
                    : '0px 2px 3px rgba(0,0,0,0.1), 0px 0px 0px 2px rgba(0,0,0,0.05)',
                transition: 'background-color 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease',
                borderLeft: `5px solid ${task.color}`,
                borderRadius: 8,
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">{task.content}</Typography>
                <Box display="flex" alignItems="center">
                    <Tooltip title="Task Details">
                        <IconButton size="small" onClick={handleInfoOpen}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    {columnId === 'column-4' && (
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
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" flexDirection="column" alignItems="center">
                    {assignedUser ? (
                        <Box
                            display="flex"
                            alignItems="center"
                            position="relative"
                            px={2}
                            py={1}
                            borderRadius={16}
                            bgcolor="#e0e0e0"
                        >
                            <Typography variant="body2">{assignedUserName}</Typography>
                            <IconButton
                                size="small"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    transform: 'translate(50%, -50%)',
                                }}
                                onClick={handleRemoveUser}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAssignDialogOpen}
                        >
                            Assign
                        </Button>
                    )}
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center">
                    {reviewingUser ? (
                        <Box
                            display="flex"
                            alignItems="center"
                            position="relative"
                            px={2}
                            py={1}
                            borderRadius={16}
                            bgcolor="#e0e0e0"
                        >
                            <Typography variant="body2">{reviewingUserName}</Typography>
                            <IconButton
                                size="small"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    transform: 'translate(50%, -50%)',
                                }}
                                onClick={handleRemoveReviewer()}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleReviewDialogOpen}
                        >
                            Review
                        </Button>
                    )}
                </Box>
            </Box>

            <Dialog open={infoOpen} onClose={handleInfoClose} maxWidth="md" fullWidth>
                <DialogTitle>Task Details</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">Task Description</Typography>
                    <Typography variant="body1" gutterBottom>
                        {task.description}
                    </Typography>
                    <Typography variant="h6">Sub-Tasks</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Completed</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {task.subTasks.map((subtask) => (
                                <TableRow key={subtask.id}>
                                    <TableCell>
                                        {editingSubtask && editingSubtask.id === subtask.id ? (
                                            <TextField
                                                name="title"
                                                value={subtaskTitle}
                                                onChange={handleSubtaskChange}
                                                fullWidth
                                            />
                                        ) : (
                                            subtask.title
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingSubtask && editingSubtask.id === subtask.id ? (
                                            <TextField
                                                name="description"
                                                value={subtaskDescription}
                                                onChange={handleSubtaskChange}
                                                fullWidth
                                            />
                                        ) : (
                                            subtask.description
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={subtask.completed}
                                            onChange={() => handleCompleteSubtask(subtask)}
                                            disabled={!(assignedUser && assignedUser.id === userId)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {assignedUser && assignedUser.id === userId && (
                                            <>
                                                <IconButton size="small" onClick={() => handleEditSubtask(subtask)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDeleteSubtask(subtask.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleInfoClose} color="primary">
                        Close
                    </Button>
                    {editingSubtask && (
                        <Button onClick={handleSaveSubtask} color="primary" variant="contained">
                            Save
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog open={assignDialogOpen} onClose={handleAssignDialogClose}>
                <DialogTitle>assign user</DialogTitle>
                <DialogContent>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <List>
                            {teamMembers.map((member) => (
                                <ListItem button key={member.id} onClick={() => handleAssignUser(member)}>
                                    <ListItemText primary={member.username} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
             <DialogActions>
                    <Button onClick={handleAssignDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={reviewingDialogOpen} onClose={handleReviewDialogClose}>
                <DialogTitle>assign reviewer</DialogTitle>
                <DialogContent>
                    <List>
                        {reviewingMembers.map((member) => (
                            <ListItem button key={member.id} onClick={() => handleReviewUser(member)}>
                                <ListItemText primary={member.username} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReviewDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default Task;
