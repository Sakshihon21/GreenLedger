import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Building2, CheckSquare, Loader2, AlertCircle } from 'lucide-react';
import { getDashboardSummary } from '../../services/dashboardService';

const AuthorityDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getDashboardSummary();
        setData(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load authority metrics.');
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
        <p className="text-xs font-semibold text-slate-500">Loading Monitoring Authority Inspection Worklist...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-amber-300 uppercase tracking-widest block font-semibold">
            MONITORING & VERIFICATION AUTHORITY NODE
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1">Audit & Verification Worklist</h2>
          <p className="text-xs text-amber-100/90 mt-1 max-w-xl">
            Audit carbon credit generation claims, inspect AI anomaly flags, and issue official verification certificates.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Verifications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pending Requests</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
              {data?.pending_verifications || 4} <span className="text-xs font-normal text-slate-500">Claims</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Awaiting Auditor Review</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Credits Awaiting Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Credits to Verify</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              {data?.credits_awaiting_verification || 1250} <span className="text-xs font-normal text-slate-500">tCO₂e</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Total Pending Credit Volume</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Anomaly Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">AI Anomaly Alerts</span>
            <span className="text-2xl font-extrabold text-red-600 mt-1 block">
              {data?.anomaly_alerts_count || 2} <span className="text-xs font-normal text-slate-500">Flagged</span>
            </span>
            <span className="text-[11px] text-red-600 font-medium mt-1 block">Requires Inspector Review</span>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Orgs Under Review */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Orgs Under Review</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              {data?.orgs_under_review || 3} <span className="text-xs font-normal text-slate-500">Active</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Scheduled Audits</span>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center border border-teal-100">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Verification Requests List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">Recent Verification Submissions</h3>
          <p className="text-xs text-slate-500">Credit issuance claims submitted by registered Organizations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[11px] text-slate-500">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Requested Volume</th>
                <th className="py-3 px-4">Date Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.recent_verifications || []).map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{v.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{v.org}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{v.credits} tCO₂e</td>
                  <td className="py-3 px-4 text-slate-500">{v.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      v.status === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline">
                      Audit Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
