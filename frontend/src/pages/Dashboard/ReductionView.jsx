import React, { useState, useEffect } from 'react';
import { TrendingDown, Zap, ArrowDownCircle, CheckCircle2, Loader2, AlertCircle, Plus } from 'lucide-react';
import { getReductionSummary } from '../../services/dashboardService';

const ReductionView = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getReductionSummary();
        setData(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load reduction target data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Organizational Carbon Reduction Metrics...</p>
      </div>
    );
  }

  const baseline = data?.baseline_emissions_kg || 5000;
  const current = data?.current_emissions_kg || 3200;
  const targetPct = data?.reduction_target_percent || 30;
  const achievedPct = data?.achieved_reduction_percent || 36;
  const netSaved = data?.net_co2_saved_kg || 1800;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-300 uppercase tracking-widest block font-semibold">
            NET-ZERO TARGET PROGRESS
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1">Carbon Reduction & Baseline Manager</h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Track organizational facility emission reductions against target baselines for carbon credit eligibility.
          </p>
        </div>

        <div className="bg-emerald-800/80 px-4 py-3 rounded-xl border border-emerald-700/60 text-right">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-200 block font-semibold">Target Achieved</span>
          <span className="text-xl font-extrabold text-white">{achievedPct}% <span className="text-xs font-normal text-emerald-300">(Goal: {targetPct}%)</span></span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Baseline Emissions</span>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{baseline} <span className="text-xs font-normal text-slate-500">kg CO₂e</span></span>
          <span className="text-[11px] text-slate-400 mt-1 block">Historical Reference Level</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Current Emissions</span>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{current} <span className="text-xs font-normal text-slate-500">kg CO₂e</span></span>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Active Telemetry Stream</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Net CO₂ Avoided</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{netSaved} <span className="text-xs font-normal text-slate-500">kg CO₂e</span></span>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Eligible for Credit Generation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase block">Target Completion</span>
          <span className="text-2xl font-extrabold text-teal-700 mt-1 block">{achievedPct}%</span>
          <span className="text-[11px] text-teal-700 font-medium mt-1 block">2026 Climate Goal Exceeded</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">2026 Facility Reduction Progress</span>
          <span className="font-bold text-emerald-700">{achievedPct}% Complete</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, achievedPct)}%` }} />
        </div>
      </div>

      {/* Active Initiatives Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-800">Active Decarbonization Initiatives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data?.efficiency_initiatives || []).map((init, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{init.name}</h4>
                  <span className="text-[10px] text-slate-500">Avoided: {init.impact_kg} kg CO₂e / Month</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{init.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReductionView;
