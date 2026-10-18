import React, { useRef } from 'react';
import type { ConfigurationState, PriceBreakdown } from '../../types/configurator';
import { generateManufacturingSpec } from '../../utils/bomGenerator';
import { formatINR } from '../../utils/pricingEngine';
import {
  Printer,
  Download,
  X,
  FileCheck,
  Building,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigurationState;
  pricing: PriceBreakdown;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  config,
  pricing,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFEFC] rounded-2xl border border-[#DDD8CF] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-[#DDD8CF] bg-[#F7F5F0] flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-[#A58A63]" />
            <h2 className="font-serif text-lg font-bold text-[#252522]">
              Configured Product Quotation Sheet
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#252522] hover:bg-[#A58A63] text-white text-xs font-semibold transition flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close Quotation Sheet"
              className="p-1.5 text-[#252522]/50 hover:text-[#252522] rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Document Container */}
        <div
          ref={printRef}
          className="p-8 overflow-y-auto space-y-6 text-[#252522] bg-white print:p-0 print:shadow-none"
        >
          {/* Prominent Concept Disclaimer Watermark Bar */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
              Concept Demonstration — Not a Commercial Quotation
            </span>
            <span className="text-[10px] text-amber-800">
              Pricing and material allocations are illustrative and subject to final Flexispace factory validation.
            </span>
          </div>

          {/* Letterhead Header */}
          <div className="flex justify-between items-start border-b border-[#DDD8CF] pb-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#A58A63] uppercase block">
                Made-to-Order Furniture Platform
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#252522] tracking-tight">
                FLEXISPACE INTERIORS
              </h1>
              <p className="text-xs text-[#252522]/70 mt-1 max-w-sm">
                Design Studio: 1st Floor, N.N. Arcade, 3rd Block, Sir M Vishveswaraya Layout, Bengaluru, Karnataka 560056
              </p>
              <p className="text-[11px] text-[#252522]/60 mt-0.5">
                Email: kiran@flexispaceinteriors.co.in • Phone: +91 77602 00991
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase text-[#252522]/50 tracking-wider block">
                Quote Reference
              </span>
              <span className="font-mono text-sm font-bold text-[#252522] block mt-0.5">
                {spec.configId}
              </span>
              <span className="text-xs text-[#252522]/60 block mt-1">
                Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-[10px] text-[#252522]/50 block">
                Agency Concept: BlazeByte Studio
              </span>
            </div>
          </div>

          {/* Product Overview Card */}
          <div className="p-4 bg-[#F7F5F0] rounded-xl border border-[#DDD8CF] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#252522]/50 block uppercase text-[10px] font-bold">Product Model</span>
              <strong className="text-sm font-serif text-[#252522]">{config.modelName}</strong>
            </div>
            <div>
              <span className="text-[#252522]/50 block uppercase text-[10px] font-bold">Configured Size</span>
              <strong className="text-[#252522]">{config.size.toUpperCase()} ({spec.dimensionsMM.width} × {spec.dimensionsMM.length} mm)</strong>
            </div>
            <div>
              <span className="text-[#252522]/50 block uppercase text-[10px] font-bold">Substrate & Finish</span>
              <strong className="text-[#252522]">{spec.coreSubstrate} • {spec.exteriorFinish}</strong>
            </div>
            <div>
              <span className="text-[#252522]/50 block uppercase text-[10px] font-bold">Estimated Delivery</span>
              <strong className="text-emerald-700">14 - 18 Working Days</strong>
            </div>
          </div>

          {/* Itemized Price Breakdown Table */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#252522]">
              Itemized Quotation Breakdown
            </h3>
            <table className="w-full text-xs text-left border-collapse border border-[#DDD8CF]">
              <thead>
                <tr className="bg-[#ECE8E1] border-b border-[#DDD8CF] text-[#252522]">
                  <th className="p-2.5 font-bold">Description</th>
                  <th className="p-2.5 font-bold">Specification Detail</th>
                  <th className="p-2.5 font-bold text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD8CF]">
                <tr>
                  <td className="p-2.5 font-medium">Base Platform Bed Architecture</td>
                  <td className="p-2.5 text-[#252522]/70">Platform frame, tapered legs, slat base</td>
                  <td className="p-2.5 text-right font-mono">{formatINR(pricing.basePrice)}</td>
                </tr>
                {pricing.materialAdjustment !== 0 && (
                  <tr>
                    <td className="p-2.5 font-medium">Substrate Core Grade Adjustment</td>
                    <td className="p-2.5 text-[#252522]/70">{spec.coreSubstrate}</td>
                    <td className="p-2.5 text-right font-mono">
                      {pricing.materialAdjustment > 0 ? `+${formatINR(pricing.materialAdjustment)}` : formatINR(pricing.materialAdjustment)}
                    </td>
                  </tr>
                )}
                {pricing.finishAdjustment !== 0 && (
                  <tr>
                    <td className="p-2.5 font-medium">Surface Treatment Multi-Coat Finish</td>
                    <td className="p-2.5 text-[#252522]/70">{spec.exteriorFinish}</td>
                    <td className="p-2.5 text-right font-mono">+{formatINR(pricing.finishAdjustment)}</td>
                  </tr>
                )}
                {pricing.headboardAdjustment !== 0 && (
                  <tr>
                    <td className="p-2.5 font-medium">Headboard Design Enhancement</td>
                    <td className="p-2.5 text-[#252522]/70">{config.headboardStyle.replace('_', ' ')}</td>
                    <td className="p-2.5 text-right font-mono">+{formatINR(pricing.headboardAdjustment)}</td>
                  </tr>
                )}
                {pricing.storageAdjustment !== 0 && (
                  <tr>
                    <td className="p-2.5 font-medium">Dual Under-Bed Soft-Close Drawers</td>
                    <td className="p-2.5 text-[#252522]/70">2 × 800mm deep chassis with runners</td>
                    <td className="p-2.5 text-right font-mono">+{formatINR(pricing.storageAdjustment)}</td>
                  </tr>
                )}
                {pricing.hardwareAdjustment !== 0 && (
                  <tr>
                    <td className="p-2.5 font-medium">Runner Hardware Package</td>
                    <td className="p-2.5 text-[#252522]/70">{spec.hardwarePackage}</td>
                    <td className="p-2.5 text-right font-mono">+{formatINR(pricing.hardwareAdjustment)}</td>
                  </tr>
                )}
                <tr>
                  <td className="p-2.5 font-medium">Multi-Wall Flat-Pack Packaging & Logistics</td>
                  <td className="p-2.5 text-[#252522]/70">{spec.flatPackBoxes} Cartons (Honey-comb edge protection)</td>
                  <td className="p-2.5 text-right font-mono">+{formatINR(pricing.packagingAndLogistics)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-[#F7F5F0] border-t border-[#DDD8CF]">
                  <td colSpan={2} className="p-2.5 font-bold text-right text-[#252522]">
                    Subtotal (Ex-factory Bengaluru)
                  </td>
                  <td className="p-2.5 text-right font-bold font-mono text-[#252522]">
                    {formatINR(pricing.subtotal)}
                  </td>
                </tr>
                <tr className="bg-[#F7F5F0]">
                  <td colSpan={2} className="p-2.5 font-bold text-right text-[#252522]/70">
                    Applicable GST (18% Standard)
                  </td>
                  <td className="p-2.5 text-right font-mono text-[#252522]/70">
                    +{formatINR(pricing.gstAmount)}
                  </td>
                </tr>
                <tr className="bg-[#252522] text-white">
                  <td colSpan={2} className="p-3 font-bold text-right text-sm">
                    Total Indicative Maximum Retail Price (MRP)
                  </td>
                  <td className="p-3 text-right font-bold text-lg font-mono text-[#FFFEFC]">
                    {formatINR(pricing.totalMRP)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Technical Specifications Summary */}
          <div className="p-4 bg-[#F7F5F0] rounded-xl border border-[#DDD8CF] space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A58A63] block">
              Manufacturing & Flat-Pack Technical Metrics
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-[#252522]/80">
              <div><strong>Core Density:</strong> 850 kg/m³</div>
              <div><strong>Edgebanding:</strong> 2mm PUR Zero-Joint</div>
              <div><strong>Gross Weight:</strong> ~{spec.estimatedWeightKg} kg</div>
              <div><strong>Cartons:</strong> {spec.flatPackBoxes} Flat-Packs</div>
            </div>
          </div>

          {/* Standard Terms & Sign-off */}
          <div className="pt-4 border-t border-[#DDD8CF] text-[10px] text-[#252522]/60 space-y-1">
            <p>1. Installation: Coordinated through certified local dealer partners across Bengaluru within 48 hours of flat-pack delivery.</p>
            <p>2. Warranty: 5-year structural warranty against manufacturing defects on Action TESA HDHMR® core boards and German runner hardware.</p>
            <p>3. Demonstrator Note: Developed by BlazeByte Studio as an interactive proof of concept for Flexispace Interiors.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
