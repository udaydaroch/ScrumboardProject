import React, { useState } from 'react';
import { Snackbar as MuiSnackbar, SnackbarContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const Snackbar = ({ open, message, onClose }) => {
    return (
        <MuiSnackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
        >
            <SnackbarContent
                message={message}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </MuiSnackbar>
    );
};

export default Snackbar;
