import React, { useState } from 'react';
import {
    Box,
    TextField,
    Card,
    CardContent,
    CardHeader,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const initialStaffData = [
    {
        id: 1,
        fullName: 'John Doe',
        tasksPicked: 'Scrum Board Implementation',
        subTasks: [{ title: 'Task 1.1', completed: true }, { title: 'Task 1.2', completed: false }],
    },
    {
        id: 2,
        fullName: 'Jane Smith',
        tasksPicked: 'Backend API Development',
        subTasks: [{ title: 'Task 2.1', completed: true }, { title: 'Task 2.2', completed: true }],
    },
    {
        id: 3,
        fullName: 'Bob Johnson',
        tasksPicked: 'Frontend Design',
        subTasks: [{ title: 'Task 3.1', completed: false }, { title: 'Task 3.2', completed: false }],
    },
];

const calculateSubTaskProgress = (subTasks = []) => {
    const total = subTasks.length;
    const completed = subTasks.filter(task => task.completed).length;
    return `${completed} / ${total}`;
};

const StaffList = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [staffData, setStaffData] = useState(initialStaffData);
    const [filterFullName, setFilterFullName] = useState('');
    const [filterTasks, setFilterTasks] = useState('');

    const filteredStaffData = staffData.filter(
        (staff) =>
            staff.fullName.toLowerCase().includes(filterFullName.toLowerCase()) &&
            staff.tasksPicked.toLowerCase().includes(filterTasks.toLowerCase())
    );

    const rows = filteredStaffData.map((staff) => ({
        ...staff,
        subTasksProgress: calculateSubTaskProgress(staff.subTasks),
    }));

    const columns = [
        { field: 'fullName', headerName: 'Full Name', width: 200, flex: 1 },
        { field: 'tasksPicked', headerName: 'Tasks Picked', width: 300, flex: 1 },
        { field: 'subTasksProgress', headerName: 'Sub-Tasks Progress', width: 200, flex: 1 },
    ];

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <Card sx={{ width: isSmallScreen ? "100%" : "90%", boxShadow: 3 }}>
                <CardHeader title="Staff List" />
                <CardContent>
                    <Box display="flex" mb={2}>
                        <TextField
                            label="Filter by Full Name"
                            variant="outlined"
                            value={filterFullName}
                            onChange={(e) => setFilterFullName(e.target.value)}
                            sx={{ mr: 2 }}
                        />
                        <TextField
                            label="Filter by Tasks"
                            variant="outlined"
                            value={filterTasks}
                            onChange={(e) => setFilterTasks(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ height: "100%", width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            autoHeight
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default StaffList;
