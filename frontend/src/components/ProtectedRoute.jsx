import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("You have been loged out!")
    return <Navigate to="/signup" replace />;
  }
  return children;
};

export default ProtectedRoute;
