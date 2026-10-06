import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import DashboardLayout from '../pages/Dashboard/DashboardLayout';
import DashboardOverview from '../pages/Dashboard/DashboardOverview';
import DevicesView from '../pages/Dashboard/DevicesView';
import EmissionsView from '../pages/Dashboard/EmissionsView';
import WalletView from '../pages/Dashboard/WalletView';
import SettingsView from '../pages/Dashboard/SettingsView';
import MarketplaceView from '../pages/Dashboard/MarketplaceView';
import PurchasesView from '../pages/Dashboard/PurchasesView';
import RetirementsView from '../pages/Dashboard/RetirementsView';
import CertificatesView from '../pages/Dashboard/CertificatesView';
import VerificationsView from '../pages/Dashboard/VerificationsView';
import AnomaliesView from '../pages/Dashboard/AnomaliesView';
import AuditLogsView from '../pages/Dashboard/AuditLogsView';
import UsersView from '../pages/Dashboard/UsersView';
import OrganizationsView from '../pages/Dashboard/OrganizationsView';
import PlantationsView from '../pages/Dashboard/PlantationsView';
import { useAuth } from '../context/AuthContext';
import RoleGuard from '../components/RoleGuard';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Layout with Role-Grounded Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Role Overview Index Dispatcher */}
        <Route index element={<DashboardOverview />} />

        {/* Seller / Organization Routes */}
        <Route
          path="devices"
          element={
            <RoleGuard allowedRoles={['ORGANIZATION', 'SELLER', 'ADMIN', 'MONITORING_AUTHORITY']}>
              <DevicesView />
            </RoleGuard>
          }
        />
        <Route
          path="emissions"
          element={
            <RoleGuard allowedRoles={['ORGANIZATION', 'SELLER', 'ADMIN']}>
              <EmissionsView />
            </RoleGuard>
          }
        />
        <Route
          path="plantations"
          element={
            <RoleGuard allowedRoles={['ORGANIZATION', 'ADMIN']}>
              <PlantationsView />
            </RoleGuard>
          }
        />

        {/* Buyer Routes */}
        <Route
          path="purchases"
          element={
            <RoleGuard allowedRoles={['BUYER', 'ADMIN']}>
              <PurchasesView />
            </RoleGuard>
          }
        />
        <Route
          path="retirements"
          element={
            <RoleGuard allowedRoles={['BUYER', 'ADMIN']}>
              <RetirementsView />
            </RoleGuard>
          }
        />
        <Route
          path="certificates"
          element={
            <RoleGuard allowedRoles={['BUYER', 'ADMIN']}>
              <CertificatesView />
            </RoleGuard>
          }
        />

        {/* Monitoring Authority Routes */}
        <Route
          path="verifications"
          element={
            <RoleGuard allowedRoles={['MONITORING_AUTHORITY', 'ADMIN']}>
              <VerificationsView />
            </RoleGuard>
          }
        />
        <Route
          path="anomalies"
          element={
            <RoleGuard allowedRoles={['MONITORING_AUTHORITY', 'ADMIN']}>
              <AnomaliesView />
            </RoleGuard>
          }
        />

        {/* Shared / Admin Routes */}
        <Route
          path="marketplace"
          element={
            <RoleGuard allowedRoles={['BUYER', 'SELLER', 'ADMIN']}>
              <MarketplaceView />
            </RoleGuard>
          }
        />
        <Route
          path="wallet"
          element={
            <RoleGuard allowedRoles={['ORGANIZATION', 'SELLER', 'BUYER', 'ADMIN']}>
              <WalletView />
            </RoleGuard>
          }
        />
        <Route
          path="audit"
          element={
            <RoleGuard allowedRoles={['MONITORING_AUTHORITY', 'ADMIN']}>
              <AuditLogsView />
            </RoleGuard>
          }
        />
        <Route
          path="users"
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <UsersView />
            </RoleGuard>
          }
        />
        <Route
          path="organizations"
          element={
            <RoleGuard allowedRoles={['ADMIN', 'MONITORING_AUTHORITY']}>
              <OrganizationsView />
            </RoleGuard>
          }
        />

        {/* Account Settings (Available for all authenticated roles) */}
        <Route path="settings" element={<SettingsView />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
