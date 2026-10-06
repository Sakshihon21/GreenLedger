import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const AnomaliesView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-800">AI Anomaly & Fraud Detection Flags</h2>
        <p className="text-xs text-slate-500 mt-0.5">Isolation Forest anomaly detection flags for suspicious sensor telemetry</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center text-slate-500 text-xs">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2 opacity-70" />
        <p className="font-semibold text-slate-700">AI Telemetry Anomaly Stream</p>
        <p className="mt-1 text-slate-400">Suspicious telemetry deviations flagged for authority investigation.</p>
      </div>
    </div>
  );
};

export default AnomaliesView;
