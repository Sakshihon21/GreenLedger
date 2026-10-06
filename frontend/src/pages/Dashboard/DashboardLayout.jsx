import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const TITLE_MAP = {
  '/dashboard': 'Platform Overview',
  '/dashboard/devices': 'IoT Device Management',
  '/dashboard/emissions': 'Emissions & Carbon Credits',
  '/dashboard/wallet': 'Carbon Wallet & Marketplace',
  '/dashboard/settings': 'Organization Settings',
};

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const title = TITLE_MAP[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header title={title} onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
