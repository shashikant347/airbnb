import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, hostOnly = false }) => {
  const { isAuthenticated, isHost, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (hostOnly && !isHost) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
