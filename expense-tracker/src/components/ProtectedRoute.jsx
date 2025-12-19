// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child component (the actual page)
  return children;
}

export default ProtectedRoute;