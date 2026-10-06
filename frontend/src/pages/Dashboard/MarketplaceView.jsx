import React from 'react';
import { ShoppingBag, Award, ShieldCheck, Filter } from 'lucide-react';

const MarketplaceView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Carbon Credit Marketplace</h2>
          <p className="text-xs text-slate-500 mt-0.5">Discover and trade verified carbon offset credits ($1 \text{{ Credit}} = 1 \text{{ tCO}}_2\text{{e}}$)</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
            12 Active Listings
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Solar Energy</span>
            <span className="text-xs font-mono font-bold text-slate-800">$15.00 / tCO₂e</span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">50 MW Solar Park Emission Reduction</h3>
          <p className="text-xs text-slate-500">Verified by Monitoring Authority • Batch #2026-B1</p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">Available: <strong>500 tCO₂e</strong></span>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition">
              Purchase
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Reforestation</span>
            <span className="text-xs font-mono font-bold text-slate-800">$18.50 / tCO₂e</span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">Afforestation Canopy Carbon Sink</h3>
          <p className="text-xs text-slate-500">Verified by Monitoring Authority • Batch #2026-F4</p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">Available: <strong>750 tCO₂e</strong></span>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition">
              Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceView;
