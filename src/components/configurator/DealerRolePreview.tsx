import React, { useState } from 'react';
import type { PriceBreakdown, ConfigurationState } from '../../types/configurator';
import { formatINR } from '../../utils/pricingEngine';
import {
  Briefcase,
  TrendingUp,
  Percent,
  Lock,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  X,
  Store,
  DollarSign,
} from 'lucide-react';

interface DealerRolePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  pricing: PriceBreakdown;
  config: ConfigurationState;
}

export const DealerRolePreview: React.FC<DealerRolePreviewProps> = ({
  isOpen,
  onClose,
  pricing,
  config,
}) => {
  const [activeRole, setActiveRole] = useState<'dealer' | 'public'>('dealer');
  const [marginAdjustment, setMarginAdjustment] = useState<number>(30); // 30% standard default

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

  // Calculate dynamic dealer metrics based on simulated discount slider
  const simulatedDealerCost = Math.round(pricing.totalMRP * (1 - marginAdjustment / 100));
  const simulatedDealerSpread = pricing.totalMRP - simulatedDealerCost;
  const markupOnCost = ((simulatedDealerSpread / simulatedDealerCost) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFEFC] rounded-2xl border border-[#DDD8CF] shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#DDD8CF] bg-[#F7F5F0] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#252522] text-[#A58A63] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Prototype Role Preview
                </span>
                <span className="text-xs text-[#252522]/50">• Commercial Economics</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#252522] mt-0.5">
                Dealer Partner Commercial Portal
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#252522]/50 hover:text-[#252522] rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Role Toggle Selector */}
          <div className="p-1 bg-[#ECE8E1] rounded-xl flex">
            <button
              onClick={() => setActiveRole('public')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeRole === 'public'
                  ? 'bg-white text-[#252522] shadow-sm'
                  : 'text-[#252522]/60 hover:text-[#252522]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Public Customer / Showroom View</span>
            </button>
            <button
              onClick={() => setActiveRole('dealer')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeRole === 'dealer'
                  ? 'bg-[#252522] text-white shadow-sm'
                  : 'text-[#252522]/60 hover:text-[#252522]'
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#A58A63]" />
              <span>Authorized Dealer Partner View</span>
            </button>
          </div>

          {activeRole === 'public' ? (
            /* Public Mode Preview */
            <div className="p-6 rounded-2xl border border-[#DDD8CF] bg-[#F7F5F0]/70 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#ECE8E1] flex items-center justify-center mx-auto text-[#252522]">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#252522]">
                Customer-Facing Showroom Display
              </h3>
              <p className="text-xs text-[#252522]/70 max-w-md mx-auto">
                Customers and retail shoppers only see standard Maximum Retail Prices (MRP) including 18% GST. Wholesale factory purchase rates and dealer spreads are strictly hidden.
              </p>
              <div className="mt-4 p-4 bg-white rounded-xl border border-[#DDD8CF] inline-block">
                <span className="text-xs text-[#252522]/60 uppercase tracking-wider block">
                  Customer MRP
                </span>
                <span className="text-3xl font-serif font-bold text-[#252522]">
                  {formatINR(pricing.totalMRP)}
                </span>
              </div>
            </div>
          ) : (
            /* Dealer Mode Preview */
            <div className="space-y-6">
              {/* Financial Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl border border-[#DDD8CF] bg-white space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#252522]/60 block">
                    Customer MRP (Selling)
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#252522] block">
                    {formatINR(pricing.totalMRP)}
                  </span>
                  <span className="text-[11px] text-[#252522]/50">Invoice value to end client</span>
                </div>

                <div className="p-4 rounded-xl border border-[#DDD8CF] bg-[#F7F5F0] space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#6F513A] block">
                    Dealer Purchase Cost (Landing)
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#6F513A] block">
                    {formatINR(simulatedDealerCost)}
                  </span>
                  <span className="text-[11px] text-[#252522]/60">Ex-factory Bengaluru rate</span>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                    Dealer Gross Margin Spread
                  </span>
                  <span className="text-2xl font-serif font-bold text-emerald-800 block">
                    {formatINR(simulatedDealerSpread)}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {marginAdjustment}% on MRP ({markupOnCost}% Markup)
                  </span>
                </div>
              </div>

              {/* Interactive Margin Adjustment Simulation Slider */}
              <div className="p-4 rounded-xl border border-[#DDD8CF] bg-[#F7F5F0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-[#A58A63]" />
                    <span className="text-xs font-bold text-[#252522]">
                      Simulate Dealer Tier Discount Rate
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#A58A63] bg-white px-2.5 py-1 rounded-md border border-[#DDD8CF]">
                    {marginAdjustment}% Tier Margin
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="40"
                  step="1"
                  value={marginAdjustment}
                  onChange={(e) => setMarginAdjustment(Number(e.target.value))}
                  className="w-full accent-[#A58A63] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#252522]/60">
                  <span>Silver Partner (20%)</span>
                  <span>Gold Dealer (30% Baseline)</span>
                  <span>Franchise Flagship (40%)</span>
                </div>
              </div>

              {/* Order & Installation Responsibility Breakdown */}
              <div className="p-4 rounded-xl border border-[#DDD8CF] bg-white space-y-3">
                <h4 className="text-xs font-bold text-[#252522] uppercase tracking-wider">
                  Partner Operating Model & Settlement
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#252522]/80">
                  <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#DDD8CF]/50 space-y-1">
                    <strong className="text-[#252522] block font-semibold">1. Customer Payment</strong>
                    <p className="text-[11px] text-[#252522]/70">
                      Customer pays the dealer showroom {formatINR(pricing.totalMRP)}. Dealer captures order on the Flexispace platform.
                    </p>
                  </div>
                  <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#DDD8CF]/50 space-y-1">
                    <strong className="text-[#252522] block font-semibold">2. Factory Settlement</strong>
                    <p className="text-[11px] text-[#252522]/70">
                      Dealer remits factory purchase cost ({formatINR(simulatedDealerCost)}), retaining the {formatINR(simulatedDealerSpread)} gross spread.
                    </p>
                  </div>
                  <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#DDD8CF]/50 space-y-1">
                    <strong className="text-[#252522] block font-semibold">3. Flat-Pack Dispatch</strong>
                    <p className="text-[11px] text-[#252522]/70">
                      Flexispace manufactures and dispatches flat-pack boxes to dealer hub or direct to customer address.
                    </p>
                  </div>
                  <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#DDD8CF]/50 space-y-1">
                    <strong className="text-[#252522] block font-semibold">4. Dealer Assembly</strong>
                    <p className="text-[11px] text-[#252522]/70">
                      Local certified dealer technician coordinates customer home assembly within 48 hours of dispatch delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Explicit Architectural Transparency Disclosure */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block">Architectural Concept Disclosure:</strong>
              This module is a demonstration of commercial dealer mechanics for presentation purposes. In the contracted production architecture, dealer wholesale calculations will be executed strictly on the server-side behind encrypted JWT authentication and role-based access control (RBAC), preventing client-side exposure.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DDD8CF] bg-[#F7F5F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#252522] text-white hover:bg-[#A58A63] transition"
          >
            Close Commercial Preview
          </button>
        </div>
      </div>
    </div>
  );
};
