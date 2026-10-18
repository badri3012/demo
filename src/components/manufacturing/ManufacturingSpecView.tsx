import React from 'react';
import type { ConfigurationState } from '../../types/configurator';
import { generateManufacturingSpec } from '../../utils/bomGenerator';
import {
  Cpu,
  Layers,
  Box,
  FileCode,
  ShieldAlert,
  X,
  Package,
  Wrench,
  Download,
} from 'lucide-react';

interface ManufacturingSpecViewProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigurationState;
}

export const ManufacturingSpecView: React.FC<ManufacturingSpecViewProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  if (!isOpen) return null;

  const spec = generateManufacturingSpec(config);

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(spec, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${spec.configId}_manufacturing_spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFEFC] rounded-2xl border border-[#DDD8CF] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#DDD8CF] bg-[#F7F5F0] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#252522] text-[#A58A63] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  CAD / CAM Interface
                </span>
                <span className="text-xs text-[#252522]/50">• Digital Manufacturing Spec</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#252522] mt-0.5">
                Manufacturing Specification & Exploded BOM Preview
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportJSON}
              className="px-3.5 py-1.5 rounded-lg border border-[#DDD8CF] bg-white hover:border-[#A58A63] text-xs font-semibold text-[#252522] transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#A58A63]" />
              <span>Export JSON Spec</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#252522]/50 hover:text-[#252522] rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Transparent Factory Warning */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Illustrative Bill of Materials — Not Factory Approved:</strong> This data structure demonstrates how live customer 3D customizations generate structured downstream inputs for CNC nesting routers, automated edgebanders, and packaging queues. Actual CNC G-code and factory toolpaths require formal factory tooling discovery.
            </div>
          </div>

          {/* Configuration Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F5F0] p-4 rounded-xl border border-[#DDD8CF] text-xs">
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Config Reference</span>
              <span className="font-mono font-bold text-[#252522] block mt-0.5">{spec.configId}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Dimensions (W × L × H)</span>
              <span className="font-bold text-[#252522] block mt-0.5">
                {spec.dimensionsMM.width} × {spec.dimensionsMM.length} × {spec.dimensionsMM.height} mm
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Gross Flat-Pack Mass</span>
              <span className="font-bold text-[#252522] block mt-0.5">~{spec.estimatedWeightKg} kg ({spec.flatPackBoxes} Boxes)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Rule Version</span>
              <span className="font-mono text-emerald-800 font-semibold block mt-0.5">{spec.ruleVersion}</span>
            </div>
          </div>

          {/* Exploded Bill of Materials Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#252522]">
                Exploded Component Routing & Cut List
              </h3>
              <span className="text-xs text-[#252522]/60 font-mono">
                {spec.bomItems.length} Structured Line Items
              </span>
            </div>

            <div className="border border-[#DDD8CF] rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#ECE8E1] border-b border-[#DDD8CF] text-[#252522]">
                    <th className="p-3 font-bold">Part No.</th>
                    <th className="p-3 font-bold">Component Name</th>
                    <th className="p-3 font-bold text-center">Qty</th>
                    <th className="p-3 font-bold">Finished Dimensions</th>
                    <th className="p-3 font-bold">Substrate Material</th>
                    <th className="p-3 font-bold">Edge Finish</th>
                    <th className="p-3 font-bold">CNC Routing Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD8CF] bg-white">
                  {spec.bomItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F7F5F0]/60 transition">
                      <td className="p-3 font-mono font-bold text-[#A58A63]">{item.id}</td>
                      <td className="p-3 font-medium text-[#252522]">{item.partName}</td>
                      <td className="p-3 text-center font-bold text-[#252522]">{item.quantity}</td>
                      <td className="p-3 font-mono text-[#252522]/80">{item.dimensions}</td>
                      <td className="p-3 text-[#252522]/80">{item.material}</td>
                      <td className="p-3 text-[#252522]/70">{item.edgeband}</td>
                      <td className="p-3">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#252522]/5 text-[#252522] font-semibold border border-[#DDD8CF]">
                          {item.routingCode}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Packaging & Logistics Box Kitting */}
          <div className="p-4 bg-[#F7F5F0] rounded-xl border border-[#DDD8CF] space-y-3">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-[#A58A63]" />
              <h4 className="text-xs font-bold text-[#252522] uppercase tracking-wider">
                Flat-Pack Kitting & Warehousing Distribution
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#DDD8CF] space-y-1">
                <strong className="text-[#252522] block font-semibold">Box 1: Headboard & Hardware</strong>
                <span className="text-[11px] text-[#252522]/70 block">Weight: ~28 kg • Dim: 1950 × 900 × 80 mm</span>
                <span className="text-[10px] text-emerald-700 font-medium">Includes Euro-dowels & Assembly Manual</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#DDD8CF] space-y-1">
                <strong className="text-[#252522] block font-semibold">Box 2: Side Aprons & Slat Base</strong>
                <span className="text-[11px] text-[#252522]/70 block">Weight: ~32 kg • Dim: 2150 × 260 × 120 mm</span>
                <span className="text-[10px] text-emerald-700 font-medium">Includes Centre Spine & Sprung Slats</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#DDD8CF] space-y-1">
                <strong className="text-[#252522] block font-semibold">
                  {config.hasStorageDrawers ? 'Box 3: Under-Bed Drawer Modules' : 'Box 3: Solid Wood Legs'}
                </strong>
                <span className="text-[11px] text-[#252522]/70 block">
                  {config.hasStorageDrawers ? 'Weight: ~24 kg • Dim: 900 × 700 × 180 mm' : 'Weight: ~8 kg • Dim: 400 × 300 × 150 mm'}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">
                  {config.hasStorageDrawers ? 'Hettich Soft-Close Slides Included' : '4x Turned Legs with Brass Ferrules'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DDD8CF] bg-[#F7F5F0] flex justify-between items-center">
          <span className="text-[11px] text-[#252522]/60">
            Exported to Flexispace Factory ERP Schema v2.4 (Peenya Unit 01)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#252522] text-white hover:bg-[#A58A63] transition"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
