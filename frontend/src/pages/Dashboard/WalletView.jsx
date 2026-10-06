import React from 'react';
import { Wallet, Award, TrendingUp, CheckCircle } from 'lucide-react';

const WalletView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">ORGANIZATION WALLET</span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1">Carbon Credit Balance & Ledger</h2>
          <p className="text-xs text-slate-400 mt-1">1 Verified Carbon Credit = 1 Metric Tonne CO₂ Reduction</p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700">
          <Award className="w-8 h-8 text-emerald-400" />
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Available Credits</span>
            <span className="text-xl font-bold text-white">0 tCO₂e</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Available Credits</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">0.0 tCO₂e</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Ready for Trading or Retirement</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Locked Credits</span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block">0.0 tCO₂e</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Pending Verification Audit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Retired Credits</span>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">0.0 tCO₂e</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Permanently Offset</span>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
