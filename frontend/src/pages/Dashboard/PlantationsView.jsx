import React from 'react';
import { TreePine, MapPin } from 'lucide-react';

const PlantationsView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-800">Plantation & Offset Project Records</h2>
        <p className="text-xs text-slate-500 mt-0.5">GPS-validated afforestation, reforestation, and nature-based carbon sinks</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center text-slate-500 text-xs">
        <TreePine className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-70" />
        <p className="font-semibold text-slate-700">GPS Offset Registry</p>
        <p className="mt-1 text-slate-400">Track tree counts, geographical coordinates, and verified sequestration rates.</p>
      </div>
    </div>
  );
};

export default PlantationsView;
