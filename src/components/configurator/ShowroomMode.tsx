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
  Sparkles,
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
    <div className="fixed inset-0 z-50 bg-[#F7F5F0] flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* Top Showroom Header */}
      <div className="px-6 py-4 bg-[#FFFEFC] border-b border-[#DDD8CF] flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-[#252522] text-[#F7F5F0] flex items-center justify-center">
            <Tv className="w-5 h-5 text-[#A58A63]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#A58A63]/15 text-[#6F513A]">
                Digital Showroom Mode
              </span>
              <span className="text-xs text-[#252522]/50">• 1080p / 4K Kiosk Display</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#252522]">
              Flexispace Interiors — Aura Platform Cot
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Big Customer Price Tag */}
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#252522]/50 tracking-wider block">
              Customer MRP (All Taxes Incl.)
            </span>
            <span className="text-2xl md:text-3xl font-serif font-bold text-[#252522]">
              {formatINR(pricing.totalMRP)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-xl bg-[#ECE8E1] hover:bg-[#DDD8CF] text-[#252522] transition flex items-center space-x-1.5 font-medium text-xs"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Showroom View</span>
          </button>
        </div>
      </div>

      {/* Main Large-screen Viewport */}
      <div className="flex-1 relative flex flex-col lg:flex-row p-6 gap-6 overflow-hidden">
        {/* Left: Expansive 3D Canvas */}
        <div className="flex-1 relative h-full rounded-2xl overflow-hidden shadow-md">
          <FurnitureViewer3D
            config={config}
            onToggleDrawers={() => onChange({ drawersOpen: !config.drawersOpen })}
          />
        </div>

        {/* Right: Touch-Friendly Quick Controls Bar */}
        <div className="w-full lg:w-80 xl:w-96 bg-[#FFFEFC] rounded-2xl border border-[#DDD8CF] p-5 shadow-sm flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold text-[#A58A63] uppercase tracking-wider block">
                Interactive Touch Controls
              </span>
              <h3 className="font-serif text-xl font-bold text-[#252522] mt-0.5">
                Customize in Showroom
              </h3>
            </div>

            {/* Quick Size Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#252522]/70 uppercase tracking-wider">
                Select Dimensions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SIZES.map((sz) => {
                  const isSelected = config.size === sz.id;
                  return (
                    <button
                      key={sz.id}
                      onClick={() => onChange({ size: sz.id as BedSize })}
                      className={`py-3 px-3 rounded-xl border text-center transition font-semibold text-xs ${
                        isSelected
                          ? 'border-[#A58A63] bg-[#A58A63]/10 text-[#252522] ring-1 ring-[#A58A63]'
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
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#252522]/70 uppercase tracking-wider">
                Select Architectural Color
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {COLOR_TONES.map((col) => {
                  const isSelected = config.colorTone === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => onChange({ colorTone: col.id as ColorTone })}
                      className={`p-3 rounded-xl border transition flex items-center space-x-2.5 text-left ${
                        isSelected
                          ? 'border-[#A58A63] bg-[#A58A63]/10 ring-1 ring-[#A58A63]'
                          : 'border-[#DDD8CF] hover:bg-[#F7F5F0]'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-lg border border-black/10 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-xs font-semibold text-[#252522] truncate">
                        {col.name.split(' ')[0]}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#A58A63] ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Under-bed Storage Toggle */}
            <div className="p-3.5 bg-[#F7F5F0] rounded-xl border border-[#DDD8CF] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Box className="w-5 h-5 text-[#A58A63]" />
                <div>
                  <span className="text-xs font-bold text-[#252522] block">
                    Dual Under-Bed Drawers
                  </span>
                  <span className="text-[10px] text-[#252522]/60">+₹8,500 Soft-Close</span>
                </div>
              </div>
              <button
                onClick={() => onChange({ hasStorageDrawers: !config.hasStorageDrawers })}
                className={`w-11 h-6 rounded-full transition relative shrink-0 ${
                  config.hasStorageDrawers ? 'bg-[#A58A63]' : 'bg-[#DDD8CF]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition ${
                    config.hasStorageDrawers ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Showroom Specs Summary */}
            <div className="p-3.5 bg-[#ECE8E1]/60 rounded-xl text-xs space-y-1.5 border border-[#DDD8CF]/70">
              <div className="flex justify-between">
                <span className="text-[#252522]/60">Finish Series:</span>
                <span className="font-semibold text-[#252522]">
                  {config.finishType === 'pu_coating'
                    ? 'Cinzel PU Velvet'
                    : config.finishType === 'acrylic'
                    ? 'Aqua High Mirror'
                    : 'Ecomodular Matte'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252522]/60">Substrate:</span>
                <span className="font-semibold text-[#252522]">Action TESA HDHMR®</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252522]/60">Bengaluru Delivery:</span>
                <span className="font-semibold text-emerald-700">14-18 Days Flat-pack</span>
              </div>
            </div>
          </div>

          {/* Showroom Actions */}
          <div className="space-y-2.5 pt-4 border-t border-[#DDD8CF]">
            <button
              onClick={onOpenQuotationModal}
              className="w-full py-3 px-4 rounded-xl bg-[#252522] hover:bg-[#A58A63] text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Print Showroom Quotation</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border border-[#DDD8CF] hover:bg-[#ECE8E1] text-[#252522] text-xs font-medium transition flex items-center justify-center space-x-1.5"
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
