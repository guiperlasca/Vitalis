import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/clinicas" replace />;
    }

    return <>{children}</>;
}
