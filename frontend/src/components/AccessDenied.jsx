import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AccessDenied = ({ requiredRoles = [] }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 mb-2">
        HTTP 403 — ACCESS DENIED
      </span>

      <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
        Unauthorized Route Access
      </h2>

      <p className="text-xs text-slate-600 max-w-md mt-2 leading-relaxed">
        Your current account role <strong className="text-slate-900 uppercase">({user?.role || 'GUEST'})</strong> does not have permission to view this page. This section is restricted to authorized roles.
      </p>

      {requiredRoles.length > 0 && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 font-mono">
          Required Role: {requiredRoles.join(' | ')}
        </div>
      )}

      <div className="mt-6 flex items-center space-x-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
