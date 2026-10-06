import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck, Download, Award, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { getReportsSummary } from '../../services/dashboardService';

const ReportsView = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getReportsSummary();
        setData(res.data);
      } catch (err) {
        setError(err.message || 'Failed to generate sustainability report.');
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
        <p className="text-xs font-semibold text-slate-500">Generating Formal ESG Environmental Audit Report...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-semibold">
            ENVIRONMENTAL COMPLIANCE AUDIT
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1">ESG Sustainability & Audit Reports</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Formal environmental impact certificates and GHG Protocol compliant audit logs.
          </p>
        </div>

        <button
          onClick={() => alert("Downloading ESG Environmental Audit PDF...")}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition"
        >
          <Download className="w-4 h-4" />
          <span>Export ESG Audit Report (PDF)</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Audit Report Document Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Official Audit Document</span>
            <h3 className="text-lg font-extrabold text-slate-800">{data?.report_period || '2026 Q3 Environmental Audit'}</h3>
            <p className="text-xs text-emerald-700 font-semibold mt-0.5">{data?.organization_name}</p>
          </div>

          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{data?.auditor_status || 'AUDITED & VERIFIED'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs text-slate-500 uppercase font-semibold block">CO₂ Monitored</span>
            <span className="text-xl font-extrabold text-slate-800 mt-1 block">{data?.total_co2_monitored_kg || 3200} kg CO₂e</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs text-slate-500 uppercase font-semibold block">Verified Credits</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-1 block">{data?.total_credits_verified_tco2e || 5} tCO₂e</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs text-slate-500 uppercase font-semibold block">Retired Credits</span>
            <span className="text-xl font-extrabold text-teal-700 mt-1 block">{data?.total_credits_retired_tco2e || 2} tCO₂e</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Compliance Standards</h4>
          <div className="flex flex-wrap gap-2">
            {(data?.compliance_standards || []).map((std, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
                {std}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
