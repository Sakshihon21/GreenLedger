import React from 'react';
import { Activity, ShieldCheck, Zap, ArrowDownCircle } from 'lucide-react';

const EmissionsView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Emissions & Carbon Calculation Engine</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic carbon calculations based on verified emission factors and baseline reductions
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold self-start sm:self-auto">
          Deterministic Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Electricity Factor</h3>
          <p className="text-xs text-slate-500 mt-1">0.82 kg CO₂e / kWh</p>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">Configured Baseline</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-3">
            <ArrowDownCircle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Baseline Emission Level</h3>
          <p className="text-xs text-slate-500 mt-1">500.0 kg CO₂ / Month</p>
          <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded mt-2 inline-block">Verified Target</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Calculation Method</h3>
          <p className="text-xs text-slate-500 mt-1">Activity Data × Factor = CO₂e</p>
          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded mt-2 inline-block">Auditable & Traceable</span>
        </div>
      </div>
    </div>
  );
};

export default EmissionsView;
