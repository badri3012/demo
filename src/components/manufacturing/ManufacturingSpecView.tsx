import React, { useEffect } from 'react';
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
  Download,
  Info,
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
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFEFC] rounded-2xl border border-[#DDD8CF] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header - Mobile & Desktop Optimized */}
        <div className="p-4 sm:p-6 border-b border-[#DDD8CF] bg-[#F7F5F0] shrink-0">
          {/* Top metadata row with accessible Close button */}
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#ECE8E1] text-[#252522] border border-[#DDD8CF]">
                Technical Preview
              </span>
              <span className="text-[11px] text-[#252522]/60 font-medium hidden sm:inline">
                • Illustrative Manufacturing Specification
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Manufacturing Specification"
              className="p-1.5 sm:p-2 text-[#252522]/60 hover:text-[#252522] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title and Action row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#252522] text-[#A58A63] flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#252522] leading-tight">
                  Manufacturing Specification & BOM Preview
                </h2>
                <p className="text-[11px] sm:text-xs text-[#252522]/60 mt-0.5">
                  Parametric Bill of Materials derived from active 3D configuration
                </p>
              </div>
            </div>

            <button
              onClick={exportJSON}
              className="self-start sm:self-auto px-3.5 py-2 rounded-lg border border-[#DDD8CF] bg-white hover:border-[#A58A63] hover:bg-[#F7F5F0] text-xs font-semibold text-[#252522] transition-colors flex items-center space-x-2 shadow-2xs cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#A58A63]" />
              <span>Export JSON Spec</span>
            </button>
          </div>
        </div>

        {/* Content Body - Natural Vertical Scrolling */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1">
          {/* Transparent Factory Warning */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold block">Illustrative manufacturing specification. Not connected to live factory systems.</strong>
              This data structure demonstrates how live customer 3D customizations generate structured downstream inputs for CNC nesting, edgeband planning, and flat-pack kitting. Production toolpaths and actual machine configurations represent Phase 2 factory discovery deliverables.
            </div>
          </div>

          {/* Configuration Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 bg-[#F7F5F0] p-3.5 sm:p-4 rounded-xl border border-[#DDD8CF] text-xs">
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Config Reference</span>
              <span className="font-mono font-bold text-[#252522] block mt-0.5 truncate">{spec.configId}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Finished Dimensions</span>
              <span className="font-bold text-[#252522] block mt-0.5">
                {spec.dimensionsMM.width} × {spec.dimensionsMM.length} × {spec.dimensionsMM.height} mm
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Gross Flat-Pack Mass</span>
              <span className="font-bold text-[#252522] block mt-0.5">~{spec.estimatedWeightKg} kg ({spec.flatPackBoxes} Boxes)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Specification Model</span>
              <span className="font-semibold text-emerald-800 block mt-0.5">Illustrative Model</span>
            </div>
          </div>

          {/* BOM Section Header */}
          <div className="flex items-center justify-between pt-1">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#252522]">
              Component Routing & Cut List (Illustrative BOM)
            </h3>
            <span className="text-xs text-[#252522]/60 font-mono bg-[#ECE8E1] px-2.5 py-0.5 rounded-full">
              {spec.bomItems.length} Components
            </span>
          </div>

          {/* 1. DESKTOP VIEW: Structured Clean Table */}
          <div className="hidden md:block border border-[#DDD8CF] rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#ECE8E1] border-b border-[#DDD8CF] text-[#252522]">
                  <th className="p-3 font-bold">Part No.</th>
                  <th className="p-3 font-bold">Component Name</th>
                  <th className="p-3 font-bold text-center">Qty</th>
                  <th className="p-3 font-bold">Finished Dimensions</th>
                  <th className="p-3 font-bold">Substrate Material</th>
                  <th className="p-3 font-bold">Edge Finish</th>
                  <th className="p-3 font-bold">Routing Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD8CF] bg-white">
                {spec.bomItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F5F0]/60 transition-colors">
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

          {/* 2. MOBILE VIEW: Dedicated Vertical Specification Cards (Zero Horizontal Overflow) */}
          <div className="block md:hidden space-y-3">
            {spec.bomItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white rounded-xl border border-[#DDD8CF] shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#DDD8CF]/50 pb-2">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[11px] font-bold text-[#A58A63] bg-[#F7F5F0] px-2 py-0.5 rounded border border-[#DDD8CF] inline-block mr-1.5">
                      {item.id}
                    </span>
                    <span className="font-semibold text-xs text-[#252522]">
                      {item.partName}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#252522] bg-[#ECE8E1] px-2.5 py-0.5 rounded-full shrink-0">
                    Qty: {item.quantity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#252522]/50 text-[10px] uppercase font-bold block">Dimensions</span>
                    <span className="font-mono font-medium text-[#252522] break-words">{item.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-[#252522]/50 text-[10px] uppercase font-bold block">Substrate</span>
                    <span className="font-medium text-[#252522] break-words">{item.material}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#252522]/50 text-[10px] uppercase font-bold block">Surface Finish</span>
                    <span className="text-[#252522]/80 break-words">{item.finish}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#252522]/50 text-[10px] uppercase font-bold block">Edge Finish</span>
                    <span className="text-[#252522]/80 break-words">{item.edgeband}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DDD8CF]/40 flex items-center justify-between text-[10px]">
                  <span className="text-[#252522]/50 uppercase font-bold">Process Code</span>
                  <span className="font-mono bg-[#252522]/5 px-2 py-0.5 rounded border border-[#DDD8CF] text-[#252522] font-semibold">
                    {item.routingCode}
                  </span>
                </div>
              </div>
            ))}
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
        <div className="p-3.5 sm:p-4 border-t border-[#DDD8CF] bg-[#F7F5F0] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[#252522]/60 text-center sm:text-left">
            Illustrative manufacturing specification. Not connected to live factory systems.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-semibold bg-[#252522] text-white hover:bg-[#A58A63] transition-colors cursor-pointer"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
