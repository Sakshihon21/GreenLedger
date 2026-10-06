import React, { useState, useEffect } from 'react';
import { Users, Building2, Cpu, Award, FileText, Loader2, AlertCircle } from 'lucide-react';
import { getDashboardSummary } from '../../services/dashboardService';

const AdminDashboard = () => {
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
        setError(err.message || 'Failed to load admin metrics.');
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
        <p className="text-xs font-semibold text-slate-500">Loading System Administrator Control Panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-semibold">
            SYSTEM ADMINISTRATOR CONSOLE
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1">Platform Operations & Governance</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Manage system users, registered organizations, IoT device fleets, emission factor configurations, and audit logs.
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
        {/* Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">System Users</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              {data?.total_users || 1} <span className="text-xs font-normal text-slate-500">Active</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">All Platform Accounts</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Organizations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Organizations</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              {data?.total_organizations || 1} <span className="text-xs font-normal text-slate-500">Registered</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Enterprise Accounts</span>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center border border-teal-100">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">IoT Devices</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              {data?.total_devices || 0} <span className="text-xs font-normal text-slate-500">Nodes</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Active Telemetry Fleet</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Credits Issued */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">System Credits</span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
              {data?.total_credits_issued || 5400} <span className="text-xs font-normal text-slate-500">tCO₂e</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Total Platform Issuance</span>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-200">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
