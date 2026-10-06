import React from 'react';
import { TrendingDown, ShieldCheck } from 'lucide-react';

const RetirementsView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-800">Retired Carbon Credits</h2>
        <p className="text-xs text-slate-500 mt-0.5">Permanently retired offset credits claimed against corporate climate goals</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center text-slate-500 text-xs">
        <TrendingDown className="w-10 h-10 text-amber-600 mx-auto mb-2 opacity-70" />
        <p className="font-semibold text-slate-700">No credits retired yet.</p>
        <p className="mt-1 text-slate-400">Retire credits from your wallet to claim official net-zero certificates.</p>
      </div>
    </div>
  );
};

export default RetirementsView;
