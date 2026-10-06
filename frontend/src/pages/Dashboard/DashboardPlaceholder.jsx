import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, LogOut, Shield, UserCheck, Construction } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardPlaceholder = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-emerald-900 text-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-700 p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">GreenLedger</h1>
            <p className="text-xs text-emerald-300">IoT + AI Carbon Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.email || 'User'}</p>
            <span className="inline-block px-2 py-0.5 bg-emerald-800 text-emerald-200 text-xs font-mono rounded">
              ROLE: {user?.role || 'ORGANIZATION'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-4 shadow-sm">
            <Construction className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            GreenLedger Dashboard — Coming Next
          </h2>

          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            You are signed in as <strong className="text-emerald-700">{user?.email || 'authenticated user'}</strong>.
            The complete analytics and monitoring module will be unlocked in upcoming development phases.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6 space-y-2">
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span><strong>Account:</strong> {user?.name || user?.email || 'Verified User'}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span><strong>Assigned Role:</strong> {user?.role || 'ORGANIZATION'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs transition"
          >
            Back to Sign In
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPlaceholder;
