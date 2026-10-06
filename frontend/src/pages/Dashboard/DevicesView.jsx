import React, { useState, useEffect } from 'react';
import { Cpu, Plus, Wifi, MapPin, Radio, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { getDevices, createDevice } from '../../services/dashboardService';

const DevicesView = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [formData, setFormData] = useState({
    device_id: '',
    device_name: '',
    location: '',
    mqtt_topic: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchDevices = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await getDevices();
      setDevices(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch IoT devices.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleCreateDevice = async (e) => {
    e.preventDefault();
    if (!formData.device_id.trim() || !formData.device_name.trim()) {
      setFormError('Device ID and Device Name are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      await createDevice({
        device_id: formData.device_id.trim(),
        device_name: formData.device_name.trim(),
        location: formData.location.trim() || undefined,
        mqtt_topic: formData.mqtt_topic.trim() || undefined,
      });

      setIsModalOpen(false);
      setFormData({ device_id: '', device_name: '', location: '', mqtt_topic: '' });
      await fetchDevices();
    } catch (err) {
      setFormError(err.message || 'Failed to register device.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">IoT Sensor Node Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your hardware ESP32 microcontrollers and environmental telemetry nodes
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Register New IoT Device</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Devices Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-2">
          <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Fetching registered IoT nodes...</span>
        </div>
      ) : devices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No IoT Devices Registered Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Connect your ESP32 environmental sensors to start monitoring real-time CO₂ emissions and air telemetry.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register First Device</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((dev) => (
            <div key={dev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-900 text-emerald-400 rounded-xl flex items-center justify-center font-mono font-bold text-xs">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{dev.device_name}</h4>
                    <span className="text-xs font-mono text-emerald-700 font-semibold">{dev.device_id}</span>
                  </div>
                </div>

                <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>{dev.status}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{dev.location || 'Location Not Specified'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Radio className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-[11px] text-slate-500 truncate">{dev.mqtt_topic || 'default/topic'}</span>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px] text-slate-500">
                    Last Telemetry: {dev.last_seen ? new Date(dev.last_seen).toLocaleString() : 'Just Registered'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Register IoT Device</h3>
              <p className="text-xs text-slate-500">Add a new ESP32 environmental sensor to your organization</p>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateDevice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Hardware Device ID *</label>
                <input
                  type="text"
                  name="device_id"
                  placeholder="e.g. ESP32-001"
                  value={formData.device_id}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Device Name *</label>
                <input
                  type="text"
                  name="device_name"
                  placeholder="e.g. Main Plant CO2 Sensor"
                  value={formData.device_name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Installation Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Factory Floor 1, Zone B"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">MQTT Topic</label>
                <input
                  type="text"
                  name="mqtt_topic"
                  placeholder="greenledger/sensors/ESP32-001"
                  value={formData.mqtt_topic}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
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
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Device</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesView;
