import React from 'react';
import { History, ShoppingBag, FileCheck } from 'lucide-react';

const PurchasesView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-800">My Credit Purchases</h2>
        <p className="text-xs text-slate-500 mt-0.5">History of carbon credits acquired on the GreenLedger marketplace</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Purchase Orders & Certificates</h3>
        </div>
        <div className="p-8 text-center text-slate-500 text-xs">
          <ShoppingBag className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-60" />
          <p className="font-semibold text-slate-700">No purchases executed in this billing cycle.</p>
          <p className="mt-1 text-slate-400">Explore active carbon-credit listings in the Marketplace to acquire credits.</p>
        </div>
      </div>
    </div>
  );
};

export default PurchasesView;
