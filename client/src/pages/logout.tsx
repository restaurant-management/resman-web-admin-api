import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Repository } from '../repository';

export function Logout() {
    const location = useLocation();

    const { from } = location.state || { from: null };

    Repository.logout();

    return <Redirect
        to={{
            pathname: '/login',
            state: from ? { from } : null
        }}
    />;
};
