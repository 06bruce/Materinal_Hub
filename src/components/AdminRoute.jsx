import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import LoadingSpinner from './LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdmin();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
