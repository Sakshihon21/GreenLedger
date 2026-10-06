import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Building2, Mail, ShieldCheck } from 'lucide-react';

const SettingsView = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Account Settings</h2>
          <p className="text-xs text-slate-500">Manage your profile credentials, role privileges, and account information</p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center space-x-3 text-slate-700">
              <User className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Full Name:</strong> {user?.name || 'Green Ledger User'}</span>
            </div>

            <div className="flex items-center space-x-3 text-slate-700">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Email Address:</strong> {user?.email || 'N/A'}</span>
            </div>

            <div className="flex items-center space-x-3 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Account Role:</strong> <span className="font-mono uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{user?.role || 'ORGANIZATION'}</span></span>
            </div>

            <div className="flex items-center space-x-3 text-slate-700">
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Organization:</strong> {user?.organization_name || user?.name || 'Green Enterprise'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
