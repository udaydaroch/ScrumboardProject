import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDrag, useDrop } from 'react-dnd';
import { Paper, Box, Typography, IconButton, Tooltip, CircularProgress, Menu, MenuItem } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import useSessionStore from "../../zustandStorage/UserSessionInfo";

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
    const { userId, token, isAdmin, teamId } = useSessionStore();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignedUser, setAssignedUser] = useState(null);
    const [assignedToAnchorEl, setAssignedToAnchorEl] = useState(null);
    const [reviewingAnchorEl, setReviewingAnchorEl] = useState(null);
    const openAssignedTo = Boolean(assignedToAnchorEl);
    const openReviewing = Boolean(reviewingAnchorEl);
    const [assignedUserName, setAssignedUserName] = useState('');

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get(`https://scrumboard-project-back-end.vercel.app/getTeamByTeamId/${teamId}`, {
                    headers: {
                        'X-Authorization': token
                    }
                });
                setTeamMembers(response.data);
                return response.data;
            } catch (error) {
                console.error('Error fetching team members:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAssignedUser = async (team) => {
            try {
                const response = await axios.get(`https://scrumboard-project-back-end.vercel.app/getTaskUser/${task.id}`, {
                    headers: {
                        'X-Authorization': token
                    }
                });

                if (response.data && response.data.length > 0) {
                    setAssignedUser(response.data[0]);
                    for(let i = 0; i < team.length; i++){
                        if (team[i].id === response.data[0].assigned_user_id){
                            setAssignedUserName(team[i].username);
                        }
                    }
                } else {
                    setAssignedUser(null);
                }
            } catch (error) {
                console.error('Error fetching assigned user:', error);
            }
        };

        const fetchData = async () => {
            const team = await fetchTeamMembers();
            await fetchAssignedUser(team);
        };

        fetchData();
    }, [task.id, teamId, token]);
    const handleAssignedToClick = (event) => {
        setAssignedToAnchorEl(event.currentTarget);
    };

    const handleReviewingClick = (event) => {
        setReviewingAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAssignedToAnchorEl(null);
        setReviewingAnchorEl(null);
    };

    const handleAssignUser = async (user) => {
        try {
            const assignedUserId = user.id; // The user picked from the list
            await axios.post(`https://scrumboard-project-back-end.vercel.app/setTaskUser/task/${task.id}/user/${userId}/assigning/${assignedUserId}`, {}, {
                headers: {
                    'X-Authorization': token
                }
            });

            setAssignedUser(user);
            for(let i = 0; i < teamMembers.length; i++){
                if (teamMembers[i].id === assignedUserId){
                    setAssignedUserName(teamMembers[i].username);
                }
            }
            handleClose();
        } catch (error) {
            console.error('Error assigning user:', error);
        }
    };

    const handleRemoveUser = async () => {
        try {
            await axios.post(`https://scrumboard-project-back-end.vercel.app/removeTaskUser/${task.id}/removedBy/${userId}`, {}, {
                headers: {
                    'X-Authorization': token
                }
            });
            setAssignedUser(null);
            setAssignedUserName(null)
        } catch (error) {
            console.error('Error removing user:', error);
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
                                    top: -8,
                                    right: -8,
                                    backgroundColor: '#f00',
                                    color: '#fff',
                                }}
                                onClick={handleRemoveUser}
                            >
                                <CloseIcon style={{ fontSize: 'small' }} />
                            </IconButton>
                        </Box>
                    ) : (
                        <IconButton
                            size="small"
                            style={{ backgroundColor: '#e0e0e0', color: '#fff' }}
                            onClick={handleAssignedToClick}
                        >
                            <AddIcon />
                        </IconButton>
                    )}
                    <Typography variant="caption">Assigned to</Typography>
                    <Menu
                        anchorEl={assignedToAnchorEl}
                        open={openAssignedTo}
                        onClose={handleClose}
                    >
                        {loading ? (
                            <MenuItem disabled>
                                <CircularProgress size={24} />
                            </MenuItem>
                        ) : (
                            teamMembers.map((member) => (
                                <MenuItem key={member.id} onClick={() => handleAssignUser(member)}>
                                    {member.username}
                                </MenuItem>
                            ))
                        )}
                    </Menu>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <IconButton
                        size="small"
                        style={{ backgroundColor: '#e0e0e0', color: '#fff' }}
                        onClick={handleReviewingClick}
                    >
                        <AddIcon />
                    </IconButton>
                    <Typography variant="caption">Reviewing</Typography>
                    <Menu
                        anchorEl={reviewingAnchorEl}
                        open={openReviewing}
                        onClose={handleClose}
                    >
                        {loading ? (
                            <MenuItem disabled>
                                <CircularProgress size={24} />
                            </MenuItem>
                        ) : (
                            teamMembers.map((member) => (
                                <MenuItem key={member.id} onClick={handleClose}>
                                    {member.username}
                                </MenuItem>
                            ))
                        )}
                    </Menu>
                </Box>
            </Box>
        </Paper>
    );
};

export default Task;
