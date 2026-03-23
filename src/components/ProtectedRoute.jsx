import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'Admin';
  const isHost = user?.role === 'Host';
  const isParticipant = user?.role === 'Participant';

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles) {
    const hasAccess = 
      (allowedRoles.includes('Admin') && isAdmin) ||
      (allowedRoles.includes('Host') && isHost) ||
      (allowedRoles.includes('Participant') && isParticipant);

    if (!hasAccess) {
      if (isAdmin) return <Navigate to="/admin" replace />;
      if (isHost) return <Navigate to="/host" replace />;
      if (isParticipant) return <Navigate to="/participant" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
