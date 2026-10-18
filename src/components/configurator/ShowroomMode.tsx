import React from 'react';
import type { ConfigurationState, PriceBreakdown, BedSize, ColorTone } from '../../types/configurator';
import { FurnitureViewer3D } from '../3d/FurnitureViewer3D';
import { COLOR_TONES, SIZES } from '../../data/productData';
import { formatINR } from '../../utils/pricingEngine';
import {
  X,
  Tv,
  Check,
  Box,
  FileText,
  Sliders,
} from 'lucide-react';

interface ShowroomModeProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigurationState;
  onChange: (updates: Partial<ConfigurationState>) => void;
  pricing: PriceBreakdown;
  onOpenQuotationModal: () => void;
}

export const ShowroomMode: React.FC<ShowroomModeProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  pricing,
  onOpenQuotationModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F5F0] flex flex-col overflow-y-auto lg:overflow-hidden animate-in fade-in duration-300">
      {/* Top Showroom Header */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 bg-[#FFFEFC] border-b border-[#DDD8CF] flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1C1D1F] text-[#F7F5F0] flex items-center justify-center">
            <Tv className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A86B]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#C8A86B]/15 text-[#6F513A]">
                Digital Showroom Mode
              </span>
              <span className="text-xs text-[#252522]/50 hidden sm:inline">• Kiosk Touch Display</span>
            </div>
            <h1 className="font-serif text-lg sm:text-2xl font-bold text-[#1C1D1F] leading-tight">
              Aura Platform Bed
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Big Customer Price Tag */}
          <div className="text-right">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#252522]/50 tracking-wider block">
              Customer MRP
            </span>
            <span className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-[#1C1D1F]">
              {formatINR(pricing.totalMRP)}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Exit Showroom View"
            className="p-2 sm:p-3 rounded-xl bg-[#ECE8E1] hover:bg-[#DDD8CF] text-[#1C1D1F] transition flex items-center space-x-1.5 font-medium text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Showroom</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 relative flex flex-col lg:flex-row p-3 sm:p-6 gap-4 sm:gap-6 overflow-y-auto lg:overflow-hidden">
        {/* Left: Expansive 3D Canvas */}
        <div className="w-full h-[320px] sm:h-[420px] lg:h-full lg:flex-1 relative rounded-2xl overflow-hidden shadow-sm shrink-0">
          <FurnitureViewer3D
            config={config}
            onToggleDrawers={() => onChange({ drawersOpen: !config.drawersOpen })}
          />
        </div>

        {/* Right: Touch-Friendly Quick Controls Bar */}
        <div className="w-full lg:w-80 xl:w-96 bg-[#FFFEFC] rounded-2xl border border-[#DDD8CF] p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-5 overflow-y-auto shrink-0 pb-8 lg:pb-5">
          <div className="space-y-4 sm:space-y-5">
            <div>
              <span className="text-xs font-bold text-[#A58A63] uppercase tracking-wider block">
                Interactive Touch Controls
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1D1F] mt-0.5">
                Quick Customization
              </h3>
            </div>

            {/* Quick Size Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#252522]/70 uppercase tracking-wider block">
                Select Dimensions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SIZES.map((sz) => {
                  const isSelected = config.size === sz.id;
                  return (
                    <button
                      key={sz.id}
                      onClick={() => onChange({ size: sz.id as BedSize })}
                      className={`py-2.5 px-3 rounded-xl border text-center transition font-semibold text-xs cursor-pointer ${
                        isSelected
                          ? 'border-[#C8A86B] bg-[#C8A86B]/10 text-[#1C1D1F] ring-1 ring-[#C8A86B]'
                          : 'border-[#DDD8CF] text-[#252522]/80 hover:bg-[#F7F5F0]'
                      }`}
                    >
                      {sz.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Color Swatches */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#252522]/70 uppercase tracking-wider block">
                Architectural Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_TONES.map((col) => {
                  const isSelected = config.colorTone === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => onChange({ colorTone: col.id as ColorTone })}
                      className={`p-2.5 rounded-xl border transition flex items-center space-x-2 text-left cursor-pointer ${
                        isSelected
                          ? 'border-[#C8A86B] bg-[#C8A86B]/10 ring-1 ring-[#C8A86B]'
                          : 'border-[#DDD8CF] hover:bg-[#F7F5F0]'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-xs font-semibold text-[#1C1D1F] truncate">
                        {col.name.split(' ')[0]}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A86B] ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Under-bed Storage Toggle */}
            <div className="p-3 bg-[#F7F5F0] rounded-xl border border-[#DDD8CF] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Box className="w-4 h-4 text-[#C8A86B]" />
                <div>
                  <span className="text-xs font-bold text-[#1C1D1F] block">
                    Dual Under-Bed Drawers
                  </span>
                  <span className="text-[10px] text-[#252522]/60">+₹8,500 Soft-Close</span>
                </div>
              </div>
              <button
                onClick={() => onChange({ hasStorageDrawers: !config.hasStorageDrawers })}
                className={`w-11 h-6 rounded-full transition relative shrink-0 cursor-pointer ${
                  config.hasStorageDrawers ? 'bg-[#C8A86B]' : 'bg-[#DDD8CF]'
                }`}
                aria-label="Toggle Storage Drawers"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition ${
                    config.hasStorageDrawers ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Showroom Specs Summary */}
            <div className="p-3 bg-[#ECE8E1]/60 rounded-xl text-xs space-y-1.5 border border-[#DDD8CF]/70">
              <div className="flex justify-between">
                <span className="text-[#252522]/60">Finish Series:</span>
                <span className="font-semibold text-[#1C1D1F]">
                  {config.finishType === 'pu_coating'
                    ? 'Cinzel PU Velvet'
                    : config.finishType === 'acrylic'
                    ? 'Aqua High Mirror'
                    : 'Ecomodular Matte'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252522]/60">Substrate:</span>
                <span className="font-semibold text-[#1C1D1F]">Action TESA HDHMR®</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252522]/60">Bengaluru Delivery:</span>
                <span className="font-semibold text-emerald-700">14-18 Days Flat-pack</span>
              </div>
            </div>
          </div>

          {/* Showroom Actions */}
          <div className="space-y-2 pt-3 border-t border-[#DDD8CF]">
            <button
              onClick={onOpenQuotationModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1C1D1F] hover:bg-[#A58A63] text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#C8A86B]" />
              <span>Print Showroom Quotation</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl border border-[#DDD8CF] hover:bg-[#ECE8E1] text-[#1C1D1F] text-xs font-medium transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Back to Detailed Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
