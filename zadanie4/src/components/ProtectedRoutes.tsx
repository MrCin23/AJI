import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useUser } from '../contexts/UserContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'CLIENT' | 'EMPLOYEE';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { user } = useUser();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
