import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If not logged in → redirect to login page
  // Navigate component does the redirect — no JS needed
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → render the actual page
  return <>{children}</>;
};

export default ProtectedRoute;