import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Leaf,
  LayoutDashboard,
  Cpu,
  Activity,
  Award,
  Wallet,
  ShoppingBag,
  History,
  CheckSquare,
  AlertTriangle,
  Users,
  Building2,
  Sliders,
  FileText,
  FileCheck,
  TreePine,
  TrendingDown,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_NAV_CONFIG = {
  SELLER: [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/dashboard/devices', label: 'IoT Devices', icon: Cpu },
    { path: '/dashboard/emissions', label: 'Emissions & Credits', icon: Activity },
    { path: '/dashboard/credits', label: 'Carbon Credits', icon: Award },
    { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
    { path: '/dashboard/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { path: '/dashboard/transactions', label: 'Transactions', icon: History },
    { path: '/dashboard/settings', label: 'Account Settings', icon: Settings },
  ],
  BUYER: [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/dashboard/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { path: '/dashboard/purchases', label: 'My Purchases', icon: History },
    { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
    { path: '/dashboard/retirements', label: 'Retired Credits', icon: TrendingDown },
    { path: '/dashboard/certificates', label: 'Certificates', icon: FileCheck },
    { path: '/dashboard/settings', label: 'Account Settings', icon: Settings },
  ],
  MONITORING_AUTHORITY: [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/dashboard/verifications', label: 'Verification Requests', icon: CheckSquare },
    { path: '/dashboard/anomalies', label: 'Anomalies', icon: AlertTriangle },
    { path: '/dashboard/organizations', label: 'Organizations', icon: Building2 },
    { path: '/dashboard/credits', label: 'Carbon Credits', icon: Award },
    { path: '/dashboard/audit', label: 'Audit Logs', icon: FileText },
    { path: '/dashboard/reports', label: 'Reports', icon: Activity },
    { path: '/dashboard/settings', label: 'Account Settings', icon: Settings },
  ],
  ADMIN: [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/dashboard/users', label: 'Users', icon: Users },
    { path: '/dashboard/organizations', label: 'Organizations', icon: Building2 },
    { path: '/dashboard/devices', label: 'Devices', icon: Cpu },
    { path: '/dashboard/credits', label: 'Carbon Credits', icon: Award },
    { path: '/dashboard/factors', label: 'Emission Factors', icon: Sliders },
    { path: '/dashboard/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { path: '/dashboard/audit', label: 'Audit Logs', icon: FileText },
    { path: '/dashboard/settings', label: 'Account Settings', icon: Settings },
  ],
  ORGANIZATION: [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/dashboard/devices', label: 'IoT Devices', icon: Cpu },
    { path: '/dashboard/emissions', label: 'Emissions', icon: Activity },
    { path: '/dashboard/reduction', label: 'Carbon Reduction', icon: TrendingDown },
    { path: '/dashboard/credits', label: 'Credit Requests', icon: Award },
    { path: '/dashboard/plantations', label: 'Plantations / Offsets', icon: TreePine },
    { path: '/dashboard/reports', label: 'Reports', icon: FileText },
    { path: '/dashboard/settings', label: 'Account Settings', icon: Settings },
  ]
};

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userRole = user?.role?.toUpperCase() || 'ORGANIZATION';
  const navItems = ROLE_NAV_CONFIG[userRole] || ROLE_NAV_CONFIG.ORGANIZATION;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight">GreenLedger</span>
              <span className="block text-[10px] text-emerald-400 font-mono font-medium">IoT + AI CARBON</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info & Role Badge */}
        <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || user?.email || 'User'}</p>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
              ROLE: {userRole}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path + item.label}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-slate-800 hover:bg-red-950/40 hover:text-red-300 text-slate-300 rounded-xl text-xs font-semibold transition border border-slate-700/50 hover:border-red-900/50"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
