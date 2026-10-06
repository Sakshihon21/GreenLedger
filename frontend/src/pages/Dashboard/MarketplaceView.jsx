import React, { useState, useEffect } from 'react';
import { ShoppingBag, Award, Plus, Loader2, AlertCircle, CheckCircle, Tag, ShieldCheck } from 'lucide-react';
import { getMarketplaceListings, createListing, buyCredits } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';

const MarketplaceView = () => {
  const { user } = useAuth();
  const userRole = user?.role?.toUpperCase() || 'BUYER';
  const isSellerOrAdmin = ['SELLER', 'ORGANIZATION', 'ADMIN'].includes(userRole);
  const isBuyerOrAdmin = ['BUYER', 'ADMIN'].includes(userRole);

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Listing Modal State
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listingForm, setListingForm] = useState({
    project_name: '',
    project_type: 'Solar Energy',
    credit_amount: '',
    price_per_credit: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Purchasing State
  const [buyingId, setBuyingId] = useState(null);

  const fetchListings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await getMarketplaceListings();
      setListings(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch marketplace listings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setListingForm((prev) => ({ ...prev, [name]: value }));
    if (modalError) setModalError('');
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!listingForm.project_name.trim() || !listingForm.credit_amount || !listingForm.price_per_credit) {
      setModalError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setModalError('');

    try {
      await createListing({
        project_name: listingForm.project_name.trim(),
        project_type: listingForm.project_type,
        credit_amount: parseFloat(listingForm.credit_amount),
        price_per_credit: parseFloat(listingForm.price_per_credit),
      });

      setSuccessMsg('Carbon credits listed on marketplace successfully!');
      setIsListModalOpen(false);
      setListingForm({ project_name: '', project_type: 'Solar Energy', credit_amount: '', price_per_credit: '' });
      await fetchListings();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setModalError(err.message || 'Failed to list credits.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuy = async (listingId) => {
    setBuyingId(listingId);
    setError('');
    setSuccessMsg('');
    try {
      const res = await buyCredits(listingId);
      setSuccessMsg(`Successfully purchased carbon credits! Certificate #${res.data.certificate_id || 'CERT-BUY-001'} issued.`);
      await fetchListings();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to purchase credits.');
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-300 uppercase tracking-widest block font-semibold">
            VERIFIED TRADING MARKETPLACE
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1">Carbon Credit Exchange</h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Trade verified carbon offset credits (1 Credit = 1 Metric Tonne CO₂ Reduction).
          </p>
        </div>

        {isSellerOrAdmin && (
          <button
            onClick={() => setIsListModalOpen(true)}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>List Credits for Sale</span>
          </button>
        )}
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center space-x-2 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Listings Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-2">
          <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Fetching active marketplace listings...</span>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <ShoppingBag className="w-12 h-12 text-emerald-600 opacity-50 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Active Marketplace Listings</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no credits listed for sale. {isSellerOrAdmin ? 'Click "List Credits for Sale" above to publish verified credits!' : 'Check back shortly for new verified offerings.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {item.project_type}
                  </span>
                  <span className="text-sm font-mono font-extrabold text-slate-900">
                    ${item.price_per_credit.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">/ tCO₂e</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.project_name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Listing #{item.id} • Seller #{item.seller_id}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Volume Offered:</span>
                  <span className="font-bold text-emerald-700">{item.credit_amount} tCO₂e</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 font-mono">
                  Total: <strong className="text-slate-800">${(item.credit_amount * item.price_per_credit).toFixed(2)}</strong>
                </div>

                {isBuyerOrAdmin ? (
                  <button
                    onClick={() => handleBuy(item.id)}
                    disabled={buyingId === item.id}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    {buyingId === item.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Buying...</span>
                      </>
                    ) : (
                      <span>Buy Credits</span>
                    )}
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400">Seller Mode</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List Credits Modal */}
      {isListModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800">List Verified Carbon Credits</h3>
              <p className="text-xs text-slate-500">Offer certified emission reduction credits on the public marketplace</p>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Project Name *</label>
                <input
                  type="text"
                  name="project_name"
                  placeholder="e.g. 50 MW Rooftop Solar Array"
                  value={listingForm.project_name}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Project Category</label>
                <select
                  name="project_type"
                  value={listingForm.project_type}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <option value="Solar Energy">Solar Energy</option>
                  <option value="Wind Energy">Wind Energy</option>
                  <option value="Reforestation">Reforestation / Carbon Sink</option>
                  <option value="Energy Efficiency">HVAC Energy Efficiency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Volume (tCO₂e) *</label>
                  <input
                    type="number"
                    name="credit_amount"
                    step="0.1"
                    placeholder="e.g. 100"
                    value={listingForm.credit_amount}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Price per Credit ($) *</label>
                  <input
                    type="number"
                    name="price_per_credit"
                    step="0.5"
                    placeholder="e.g. 15.00"
                    value={listingForm.price_per_credit}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsListModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Publish Listing</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceView;
