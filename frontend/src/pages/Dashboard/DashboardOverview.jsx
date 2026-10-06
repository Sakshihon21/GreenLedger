import React from 'react';
import { useAuth } from '../../context/AuthContext';
import BuyerDashboard from './BuyerDashboard';
import AuthorityDashboard from './AuthorityDashboard';
import AdminDashboard from './AdminDashboard';
import OrganizationDashboard from './OrganizationDashboard';
import SellerDashboard from './SellerDashboard';

const DashboardOverview = () => {
  const { user } = useAuth();
  const role = user?.role?.toUpperCase() || 'ORGANIZATION';

  switch (role) {
    case 'BUYER':
      return <BuyerDashboard />;
    case 'SELLER':
      return <SellerDashboard />;
    case 'MONITORING_AUTHORITY':
      return <AuthorityDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'ORGANIZATION':
    default:
      return <OrganizationDashboard />;
  }
};

export default DashboardOverview;
