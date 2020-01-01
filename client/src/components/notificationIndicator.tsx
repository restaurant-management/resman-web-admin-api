import { Snackbar } from '@material-ui/core';
import React from 'react';
import { SnackBarContentWrapper, variantIcon } from './snackBarContentWrapper';

export function NotificationIndicator(props: {
    message?: string, show?: boolean, onClose?: () => void, variant?: keyof typeof variantIcon, duration?: number,
    vertical?: 'bottom' | 'top', horizontal?: 'left' | 'right'
}) {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: props.vertical || 'bottom',
                horizontal: props.horizontal || 'right',
            }}
            open={!!props.show}
            autoHideDuration={props.duration || 2000}
            onClose={props.onClose}
        >
            <SnackBarContentWrapper variant={props.variant || 'info'} message={props.message} />
        </Snackbar>
    );
}
