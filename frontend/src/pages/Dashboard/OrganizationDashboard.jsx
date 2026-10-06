import React, { useState, useEffect } from 'react';
import { Building2, Cpu, Activity, Award, TreePine, TrendingDown, Loader2, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { getDashboardSummary, getSensorReadings, postSensorReading } from '../../services/dashboardService';

const OrganizationDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [readings, setReadings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [sumRes, readRes] = await Promise.all([
        getDashboardSummary(),
        getSensorReadings(10)
      ]);
      setSummary(sumRes.data);
      setReadings(readRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load organization data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulateReading = async () => {
    setIsSimulating(true);
    try {
      const mockCo2 = Math.floor(400 + Math.random() * 350);
      const mockTemp = Number((22 + Math.random() * 6).toFixed(1));
      const mockHum = Number((50 + Math.random() * 20).toFixed(1));

      await postSensorReading({
        device_id: 'ESP32-001',
        co2_ppm: mockCo2,
        temperature: mockTemp,
        humidity: mockHum,
        pressure: 1013.2
      });

      await fetchData();
    } catch (err) {
      alert('Error simulating reading: ' + err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Organization Sustainability Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-300 uppercase tracking-widest block font-semibold">
            ORGANIZATION SUSTAINABILITY CONSOLE
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1">Enterprise Emission & Offset Tracker</h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Monitor organizational facility CO₂ levels, track carbon reduction targets, and manage credit generation requests.
          </p>
        </div>

        <button
          onClick={handleSimulateReading}
          disabled={isSimulating}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
        >
          {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Development Test: Simulate Telemetry</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Devices</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{summary?.active_devices || 0}</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Facility Sensors</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Avg CO₂ Monitored</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{summary?.avg_co2_ppm || 400} <span className="text-xs font-normal text-slate-500">PPM</span></span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Baseline Target: 500 PPM</span>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center border border-teal-100">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Tracked Emissions</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{summary?.tracked_emissions_kg || 0} <span className="text-xs font-normal text-slate-500">kg CO₂e</span></span>
            <span className="text-[11px] text-slate-500 mt-1 block">Ingested Readings: {summary?.total_readings || 0}</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Eligible Credits</span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{summary?.verified_credits || 0} <span className="text-xs font-normal text-slate-500">tCO₂e</span></span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Pending Authority Verification</span>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-200">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
