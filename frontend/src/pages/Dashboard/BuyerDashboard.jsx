import React, { useState, useEffect } from 'react';
import { ShoppingBag, Wallet, TrendingDown, Award, FileCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { getDashboardSummary } from '../../services/dashboardService';

const BuyerDashboard = () => {
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
        setError(err.message || 'Failed to load buyer metrics.');
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
        <p className="text-xs font-semibold text-slate-500">Loading Buyer Portfolio & Marketplace Summary...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-300 uppercase tracking-widest block font-semibold">
            BUYER CARBON PORTFOLIO
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1">Carbon Credit Trading & Offset Hub</h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Browse certified carbon-credit listings, execute verified purchases, and retire credits for corporate net-zero compliance.
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
        {/* Available Wallet Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Wallet Balance</span>
            <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
              {data?.available_wallet_credits || 150} <span className="text-xs font-normal text-slate-500">tCO₂e</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Ready for Retirement / Trade</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Purchased Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Purchased Credits</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              {data?.purchased_credits || 350} <span className="text-xs font-normal text-slate-500">tCO₂e</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Total Cumulative Purchases</span>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center border border-teal-100">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Retired Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Retired Credits</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              {data?.retired_credits || 200} <span className="text-xs font-normal text-slate-500">tCO₂e</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Permanently Claimed Offset</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Active Marketplace Listings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Market Listings</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
              {data?.active_listings_count || 12} <span className="text-xs font-normal text-slate-500">Active</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Available to Buy Now</span>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-200">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Purchases & Retirement Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchases Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">Recent Credit Purchases</h3>
            <p className="text-xs text-slate-500">Verified carbon credits purchased from certified sellers</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[11px] text-slate-500">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Seller</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data?.recent_purchases || []).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{p.id}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{p.credits} tCO₂e</td>
                    <td className="py-3 px-4">{p.seller}</td>
                    <td className="py-3 px-4 text-slate-500">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Certificate Shortcuts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Offset Certificates & Compliance</h3>
            <p className="text-xs text-slate-500">Official proof of carbon retirement and net-zero certificate shortcuts</p>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Certificate #CERT-OFF-901</h4>
                <p className="text-[11px] text-slate-500">50 tCO₂e Retired • Q3 Net Zero Target</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer">View PDF</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileCheck className="w-6 h-6 text-slate-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Certificate #CERT-8841</h4>
                <p className="text-[11px] text-slate-500">100 tCO₂e Verified Holding</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700 hover:underline cursor-pointer">View PDF</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
