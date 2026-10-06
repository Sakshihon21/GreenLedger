import React from 'react';
import { useAuth } from '../context/AuthContext';
import AccessDenied from './AccessDenied';

const RoleGuard = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <AccessDenied requiredRoles={allowedRoles} />;
  }

  const userRole = user.role?.toUpperCase();

  // ADMIN always bypasses role checks
  if (userRole === 'ADMIN' || allowedRoles.includes(userRole)) {
    return children;
  }

  return <AccessDenied requiredRoles={allowedRoles} />;
};

export default RoleGuard;
