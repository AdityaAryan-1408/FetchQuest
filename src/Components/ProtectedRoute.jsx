
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Use to make sure certain pages only appear to logged in users.
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();


    if (isLoading) {
        return <div style={{ textAlign: 'center', paddingTop: '5rem' }}>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }
    return children;
}

export default ProtectedRoute;