import { Navigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass p-8 rounded-2xl">
                    <div className="animate-pulse text-xl">Loading...</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};
