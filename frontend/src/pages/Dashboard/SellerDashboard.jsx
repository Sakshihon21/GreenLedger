import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Award, Zap, AlertTriangle, CheckCircle, Plus, Loader2, RefreshCw, Clock, Wallet } from 'lucide-react';
import { getDashboardSummary, getSensorReadings, postSensorReading } from '../../services/dashboardService';

const SellerDashboard = () => {
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
        getSensorReadings(15)
      ]);
      setSummary(sumRes.data);
      setReadings(readRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load seller telemetry dashboard.');
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
        <p className="text-xs font-semibold text-slate-500">Loading Seller IoT Sensors & Carbon Credit Stream...</p>
      </div>
    );
  }

  const avgCo2 = summary?.avg_co2_ppm || 400;

  return (
    <div className="space-y-6">
      {/* Top Banner & Development Test Simulator */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-300 uppercase tracking-widest block font-semibold">
            SELLER IOT GENERATION NODE
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1">IoT Telemetry & Carbon Credit Generation</h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Monitor real-time sensor streams, track verified carbon credit generation, and list available credits on the marketplace.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSimulateReading}
            disabled={isSimulating}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
          >
            {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Development Test: Simulate Telemetry</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Active IoT Sensors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">1. Active IoT Sensors</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{summary?.active_devices || 0}</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Registered Nodes: {summary?.total_devices || 0}</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Avg CO2 Concentration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">2. Avg CO₂ Concentration</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{avgCo2} <span className="text-xs font-normal text-slate-500">PPM</span></span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Optimal Threshold</span>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center border border-teal-100">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Tracked Emissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">3. Tracked Emissions</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{summary?.tracked_emissions_kg || 0} <span className="text-xs font-normal text-slate-500">kg CO₂e</span></span>
            <span className="text-[11px] text-slate-500 mt-1 block">Total Ingested Data: {summary?.total_readings || 0}</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">4. Pending Credits</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{summary?.pending_credits || 0} <span className="text-xs font-normal text-slate-500">tCO₂e</span></span>
            <span className="text-[11px] text-slate-400 mt-1 block">Awaiting Verification</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Verified Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">5. Verified Credits</span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{summary?.verified_credits || 0} <span className="text-xs font-normal text-slate-500">tCO₂e</span></span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Audited & Certified</span>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-200">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Available Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">6. Available Credits</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{summary?.available_credits || 0} <span className="text-xs font-normal text-slate-500">tCO₂e</span></span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Ready to List on Marketplace</span>
          </div>
          <div className="w-12 h-12 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center border border-slate-800">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Sensor Telemetry Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Recent Sensor Telemetry Stream</h3>
            <p className="text-xs text-slate-500">Real-time environmental metrics received from active IoT nodes</p>
          </div>

          <button
            onClick={fetchData}
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-emerald-700 font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[11px] text-slate-500">
              <tr>
                <th className="py-3 px-4">Reading ID</th>
                <th className="py-3 px-4">Device Ref</th>
                <th className="py-3 px-4">CO₂ Concentration</th>
                <th className="py-3 px-4">Temperature</th>
                <th className="py-3 px-4">Humidity</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {readings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No sensor readings recorded yet.
                  </td>
                </tr>
              ) : (
                readings.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">#{r.id}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-medium">Device #{r.device_id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {r.co2_ppm} <span className="text-[10px] font-normal text-slate-500">PPM</span>
                    </td>
                    <td className="py-3 px-4">{r.temperature ? `${r.temperature}°C` : 'N/A'}</td>
                    <td className="py-3 px-4">{r.humidity ? `${r.humidity}%` : 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(r.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Validated</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
