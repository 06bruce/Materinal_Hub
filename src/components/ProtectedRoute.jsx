import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
