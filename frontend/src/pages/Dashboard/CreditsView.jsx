import React, { useState, useEffect } from 'react';
import { Award, Plus, ShieldCheck, Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { getCredits, requestCredits } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';

const CreditsView = () => {
  const { user } = useAuth();
  const userRole = user?.role?.toUpperCase() || 'ORGANIZATION';
  const canRequest = ['ORGANIZATION', 'SELLER', 'ADMIN'].includes(userRole);

  const [credits, setCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ amount: '', source_emission_reduction: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchCredits = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await getCredits();
      setCredits(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch carbon credits.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setModalError('Please enter a valid credit amount.');
      return;
    }

    setIsSubmitting(true);
    setModalError('');

    try {
      await requestCredits({
        amount: parseFloat(form.amount),
        source_emission_reduction: form.source_emission_reduction.trim() || undefined,
      });

      setSuccessMsg('Credit issuance request submitted successfully for auditor verification!');
      setIsModalOpen(false);
      setForm({ amount: '', source_emission_reduction: '' });
      await fetchCredits();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setModalError(err.message || 'Failed to submit credit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Carbon Credit Requests & Certification</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage carbon credit generation requests based on verified facility CO₂ reductions
          </p>
        </div>

        {canRequest && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Request Credit Issuance</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center space-x-2 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Credits Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">Carbon Credit Registry Ledger</h3>
          <p className="text-xs text-slate-500">Tracked credit lifecycle: Generated → Pending Verification → Verified → Available → Listed / Retired</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-[11px] text-slate-500">
              <tr>
                <th className="py-3 px-4">Credit ID</th>
                <th className="py-3 px-4">Volume (tCO₂e)</th>
                <th className="py-3 px-4">Source Emission Reduction</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
                    <span>Loading carbon credit ledger...</span>
                  </td>
                </tr>
              ) : credits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    No carbon credit records found. {canRequest ? 'Click "Request Credit Issuance" above to submit a claim!' : ''}
                  </td>
                </tr>
              ) : (
                credits.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">#CR-{c.id}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{c.amount} tCO₂e</td>
                    <td className="py-3 px-4 text-slate-600">{c.source_emission_reduction || 'Facility Telemetry CO2 Baseline'}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        c.status === 'VERIFIED' || c.status === 'AVAILABLE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : c.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {c.status === 'PENDING' ? <Clock className="w-3 h-3 text-amber-600" /> : <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                        <span>{c.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Request Carbon Credit Issuance</h3>
              <p className="text-xs text-slate-500">Submit baseline emission reduction claim for Monitoring Authority verification</p>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Requested Volume (tCO₂e) *</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 50"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Source Emission Reduction</label>
                <textarea
                  placeholder="Describe the facility efficiency project or telemetry reduction source"
                  value={form.source_emission_reduction}
                  onChange={(e) => setForm({ ...form, source_emission_reduction: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300 h-20"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit Request</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditsView;
