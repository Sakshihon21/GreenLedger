import React from 'react';
import { Users, Shield } from 'lucide-react';

const UsersView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-800">User Management</h2>
        <p className="text-xs text-slate-500 mt-0.5">System Administrator user management and role assignment</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center text-slate-500 text-xs">
        <Users className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-70" />
        <p className="font-semibold text-slate-700">Platform Users Console</p>
        <p className="mt-1 text-slate-400">Admin controls for user activation, role assignment, and organization linking.</p>
      </div>
    </div>
  );
};

export default UsersView;
