import React from 'react';
import { FileText, Shield } from 'lucide-react';

const AuditLogsView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-800">System Audit Logs</h2>
        <p className="text-xs text-slate-500 mt-0.5">Immutable audit trail of credit verifications, issuances, and transactions</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center text-slate-500 text-xs">
        <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-70" />
        <p className="font-semibold text-slate-700">Audit Trail Active</p>
        <p className="mt-1 text-slate-400">All financial and verification actions emit structured audit records.</p>
      </div>
    </div>
  );
};

export default AuditLogsView;
