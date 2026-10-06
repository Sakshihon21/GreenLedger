import React from 'react';
import { FileCheck, Download } from 'lucide-react';

const CertificatesView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-800">Carbon Offset Certificates</h2>
        <p className="text-xs text-slate-500 mt-0.5">Audited compliance documentation and digital retirement certificates</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center text-slate-500 text-xs">
        <FileCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-70" />
        <p className="font-semibold text-slate-700">Offset Certificates Hub</p>
        <p className="mt-1 text-slate-400">Certificates generated automatically upon carbon credit retirement.</p>
      </div>
    </div>
  );
};

export default CertificatesView;
