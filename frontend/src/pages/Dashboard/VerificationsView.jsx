import React from 'react';
import { CheckSquare, ShieldCheck } from 'lucide-react';

const VerificationsView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-800">Verification Requests</h2>
        <p className="text-xs text-slate-500 mt-0.5">Monitoring Authority queue for auditing organization credit claims</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center text-slate-500 text-xs">
        <CheckSquare className="w-10 h-10 text-amber-600 mx-auto mb-2 opacity-70" />
        <p className="font-semibold text-slate-700">Verification Inspection Queue</p>
        <p className="mt-1 text-slate-400">Claims submitted by sellers/organizations await manual auditor sign-off.</p>
      </div>
    </div>
  );
};

export default VerificationsView;
