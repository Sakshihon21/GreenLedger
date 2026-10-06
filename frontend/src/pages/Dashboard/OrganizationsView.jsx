import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

const OrganizationsView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-800">Organizations Directory</h2>
        <p className="text-xs text-slate-500 mt-0.5">Registered corporate entities, sellers, and industrial facilities</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center text-slate-500 text-xs">
        <Building2 className="w-10 h-10 text-teal-600 mx-auto mb-2 opacity-70" />
        <p className="font-semibold text-slate-700">Organizations Console</p>
        <p className="mt-1 text-slate-400">Directory of registered enterprise organizations and industry classifications.</p>
      </div>
    </div>
  );
};

export default OrganizationsView;
