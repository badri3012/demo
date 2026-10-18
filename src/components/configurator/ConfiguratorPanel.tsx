import React, { useState } from 'react';
import type {
  ConfigurationState,
  PriceBreakdown,
  BedSize,
  CoreMaterial,
  FinishType,
  ColorTone,
  HeadboardStyle,
  HardwarePackage,
} from '../../types/configurator';
import {
  SIZES,
  CORE_MATERIALS,
  FINISHES,
  COLOR_TONES,
  HEADBOARD_STYLES,
  HARDWARE_PACKAGES,
} from '../../data/productData';
import { formatINR } from '../../utils/pricingEngine';
import {
  Ruler,
  Layers,
  Sparkles,
  Palette,
  Sliders,
  Check,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  AlertTriangle,
  Tv,
  Briefcase,
  FileText,
  Cpu,
  Bookmark,
  Share2,
  Box,
} from 'lucide-react';

interface ConfiguratorPanelProps {
  config: ConfigurationState;
  onChange: (updates: Partial<ConfigurationState>) => void;
  pricing: PriceBreakdown;
  hasErrors: boolean;
  onOpenValidationModal: () => void;
  onOpenShowroomMode: () => void;
  onOpenDealerRolePreview: () => void;
  onOpenQuotationModal: () => void;
  onOpenManufacturingSpec: () => void;
  onOpenERPWorkflow: () => void;
  onSaveConfig: () => void;
  onShareConfig: () => void;
}

export const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({
  config,
  onChange,
  pricing,
  hasErrors,
  onOpenValidationModal,
  onOpenShowroomMode,
  onOpenDealerRolePreview,
  onOpenQuotationModal,
  onOpenManufacturingSpec,
  onOpenERPWorkflow,
  onSaveConfig,
  onShareConfig,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    { num: 1, label: 'Dimensions', icon: Ruler },
    { num: 2, label: 'Substrate', icon: Layers },
    { num: 3, label: 'Finish', icon: Sparkles },
    { num: 4, label: 'Tone', icon: Palette },
    { num: 5, label: 'Details', icon: Sliders },
    { num: 6, label: 'Review', icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FFFEFC] border border-[#DDD8CF] rounded-2xl shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 border-b border-[#DDD8CF] bg-[#F7F5F0]/70 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-[#A58A63]">
            Flexispace Studio Configurator
          </span>
          <h2 className="font-serif text-xl font-bold text-[#252522]">
            Aura Platform Cot
          </h2>
        </div>

        {/* Live Feasibility Badge */}
        <button
          onClick={onOpenValidationModal}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition ${
            hasErrors
              ? 'bg-red-100 text-red-700 border border-red-300 animate-bounce'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
          }`}
          title="Click to inspect manufacturing validation rules"
        >
          {hasErrors ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Review Advisory</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>DFM Validated</span>
            </>
          )}
        </button>
      </div>

      {/* Step Navigator */}
      <div className="grid grid-cols-6 border-b border-[#DDD8CF] bg-[#ECE8E1]/40 text-center">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.num;
          const isDone = activeStep > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`py-2.5 px-1 flex flex-col items-center justify-center transition border-b-2 text-xs font-medium ${
                isActive
                  ? 'border-[#A58A63] text-[#252522] bg-[#FFFEFC]'
                  : isDone
                  ? 'border-transparent text-[#252522]/70 hover:text-[#252522]'
                  : 'border-transparent text-[#252522]/40 hover:text-[#252522]/70'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 mb-1 ${isActive ? 'text-[#A58A63]' : ''}`} />
              <span className="hidden sm:inline text-[11px]">{s.label}</span>
              <span className="sm:hidden text-[10px]">0{s.num}</span>
            </button>
          );
        })}
      </div>

      {/* Main Step Content Container */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* STEP 1: DIMENSIONS */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#252522]">
                01. Mattress Dimensions & Frame Proportions
              </h3>
              <p className="text-xs text-[#252522]/70 mt-1">
                Select from standard calibrated sleeping dimensions. The external frame and structural slat bed base update in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SIZES.map((sz) => {
                const isSelected = config.size === sz.id;
                return (
                  <button
                    key={sz.id}
                    onClick={() => onChange({ size: sz.id as BedSize })}
                    className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#A58A63] bg-[#A58A63]/5 ring-1 ring-[#A58A63]'
                        : 'border-[#DDD8CF] bg-white hover:border-[#A58A63]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-[#252522]">{sz.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#A58A63]" />}
                      </div>
                      <span className="text-xs text-[#252522]/60 font-medium block">
                        {sz.subtitle}
                      </span>
                      <div className="mt-3 text-[11px] text-[#252522]/80 space-y-1 bg-[#F7F5F0] p-2.5 rounded-lg border border-[#DDD8CF]/50">
                        <div><strong className="text-[#252522]">Mattress:</strong> {sz.mattressSize}</div>
                        <div><strong className="text-[#252522]">Frame (W×L×H):</strong> {sz.frameDimensions.width} × {sz.frameDimensions.length} × {sz.frameDimensions.height} mm</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#DDD8CF]/60 flex items-center justify-between">
                      <span className="text-xs text-[#252522]/60">Base Price</span>
                      <span className="text-xs font-bold text-[#252522]">
                        {formatINR(sz.basePrice)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-[#F7F5F0] rounded-xl text-xs text-[#252522]/70 border border-[#DDD8CF] flex items-start space-x-2">
              <Ruler className="w-4 h-4 text-[#A58A63] shrink-0 mt-0.5" />
              <span>
                <strong>Factory Sizing Note:</strong> Frame accommodates standard 78-inch Indian mattress lengths. Mitred side aprons have 20mm mattress recess clearance.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: CORE MATERIAL */}
        {activeStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#252522]">
                02. Substrate Core Board Selection
              </h3>
              <p className="text-xs text-[#252522]/70 mt-1">
                The structural heart of your furniture. Engineered for extreme humidity resistance and lifetime screw retention.
              </p>
            </div>

            <div className="space-y-3">
              {CORE_MATERIALS.map((mat) => {
                const isSelected = config.coreMaterial === mat.id;
                return (
                  <button
                    key={mat.id}
                    onClick={() => onChange({ coreMaterial: mat.id as CoreMaterial })}
                    className={`w-full p-4 rounded-xl border text-left transition relative ${
                      isSelected
                        ? 'border-[#A58A63] bg-[#A58A63]/5 ring-1 ring-[#A58A63]'
                        : 'border-[#DDD8CF] bg-white hover:border-[#A58A63]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-[#252522]">{mat.name}</span>
                          {mat.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#A58A63]/15 text-[#6F513A]">
                              {mat.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#252522]/60 mt-0.5 font-medium">{mat.tagline}</p>
                      </div>
                      <span className="text-xs font-bold text-[#252522]">
                        {mat.priceDelta > 0
                          ? `+${formatINR(mat.priceDelta)}`
                          : mat.priceDelta < 0
                          ? `-${formatINR(Math.abs(mat.priceDelta))}`
                          : 'Included'}
                      </span>
                    </div>

                    <p className="text-xs text-[#252522]/75 mt-2 leading-relaxed">
                      {mat.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#DDD8CF]/60 grid grid-cols-2 gap-2 text-[11px] text-[#252522]/70">
                      <div><strong className="text-[#252522]">Density:</strong> {mat.density}</div>
                      <div><strong className="text-[#252522]">Moisture:</strong> {mat.moistureResistance}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: FINISH SERIES */}
        {activeStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#252522]">
                03. Exterior Surface Treatment & Series
              </h3>
              <p className="text-xs text-[#252522]/70 mt-1">
                Matching Flexispace Interiors' signature finishes: Cinzel (Luxury PU), Aqua (Acrylic Mirror), or Ecomodular (Satin Laminate).
              </p>
            </div>

            <div className="space-y-3">
              {FINISHES.map((fin) => {
                const isSelected = config.finishType === fin.id;
                return (
                  <button
                    key={fin.id}
                    onClick={() => onChange({ finishType: fin.id as FinishType })}
                    className={`w-full p-4 rounded-xl border text-left transition relative ${
                      isSelected
                        ? 'border-[#A58A63] bg-[#A58A63]/5 ring-1 ring-[#A58A63]'
                        : 'border-[#DDD8CF] bg-white hover:border-[#A58A63]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-[#252522]">{fin.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#252522]/10 text-[#252522]">
                            {fin.series} Series
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#252522]">
                        {fin.priceDelta > 0 ? `+${formatINR(fin.priceDelta)}` : 'Standard'}
                      </span>
                    </div>

                    <p className="text-xs text-[#252522]/75 mt-2 leading-relaxed">
                      {fin.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#DDD8CF]/60 grid grid-cols-2 gap-2 text-[11px] text-[#252522]/70">
                      <div><strong className="text-[#252522]">Sheen:</strong> {fin.sheen}</div>
                      <div><strong className="text-[#252522]">Hardness:</strong> {fin.scratchResistance}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: COLOR TONE */}
        {activeStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#252522]">
                04. Architectural Tone & Colourway
              </h3>
              <p className="text-xs text-[#252522]/70 mt-1">
                Curated palette designed to complement contemporary Indian residential interiors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {COLOR_TONES.map((col) => {
                const isSelected = config.colorTone === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => onChange({ colorTone: col.id as ColorTone })}
                    className={`p-4 rounded-xl border text-left transition flex items-start space-x-3.5 ${
                      isSelected
                        ? 'border-[#A58A63] bg-[#A58A63]/5 ring-1 ring-[#A58A63]'
                        : 'border-[#DDD8CF] bg-white hover:border-[#A58A63]/50'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl border border-black/10 shrink-0 shadow-sm mt-0.5"
                      style={{ backgroundColor: col.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#252522] truncate">{col.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#A58A63] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-[#252522]/70 mt-1 line-clamp-2">
                        {col.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: HEADBOARD & HARDWARE */}
        {activeStep === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Headboard Styles */}
            <div>
              <h3 className="font-serif text-base font-semibold text-[#252522]">
                Headboard Architectural Style
              </h3>
              <p className="text-xs text-[#252522]/70 mt-0.5">
                Precision grooved fluted timber, upholstered Belgian linen, or integrated display ledge.
              </p>
              <div className="mt-3 space-y-2.5">
                {HEADBOARD_STYLES.map((hb) => {
                  const isSelected = config.headboardStyle === hb.id;
                  return (
                    <button
                      key={hb.id}
                      onClick={() => onChange({ headboardStyle: hb.id as HeadboardStyle })}
                      className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'border-[#A58A63] bg-[#A58A63]/5 ring-1 ring-[#A58A63]'
                          : 'border-[#DDD8CF] bg-white hover:border-[#A58A63]/50'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[#252522] block">{hb.name}</span>
                        <span className="text-[11px] text-[#252522]/65">{hb.description}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#252522] shrink-0 ml-2">
                        {hb.priceDelta > 0 ? `+${formatINR(hb.priceDelta)}` : 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Under-bed Storage Toggle */}
            <div className="pt-3 border-t border-[#DDD8CF]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#252522]">
                    Under-Bed Drawer Storage Module
                  </h3>
                  <p className="text-xs text-[#252522]/70 mt-0.5">
                    Dual 800mm deep soft-close concealed pull-out chassis with dust gaskets (+₹8,500).
                  </p>
                </div>
                <button
                  onClick={() => onChange({ hasStorageDrawers: !config.hasStorageDrawers })}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 mt-1 ${
                    config.hasStorageDrawers ? 'bg-[#A58A63]' : 'bg-[#DDD8CF]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      config.hasStorageDrawers ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Hardware Selection (Enabled if drawers enabled) */}
              {config.hasStorageDrawers && (
                <div className="mt-4 p-3.5 bg-[#F7F5F0] rounded-xl border border-[#DDD8CF] space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6F513A]">
                    Runner Hardware Package
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {HARDWARE_PACKAGES.map((hw) => {
                      const isSelected = config.hardwarePackage === hw.id;
                      return (
                        <button
                          key={hw.id}
                          onClick={() => onChange({ hardwarePackage: hw.id as HardwarePackage })}
                          className={`p-2.5 rounded-lg border text-left transition ${
                            isSelected
                              ? 'border-[#A58A63] bg-white ring-1 ring-[#A58A63]'
                              : 'border-[#DDD8CF] bg-white/70 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-[#252522]">
                            <span>{hw.name}</span>
                            <span>{hw.priceDelta > 0 ? `+${formatINR(hw.priceDelta)}` : 'Included'}</span>
                          </div>
                          <p className="text-[10px] text-[#252522]/60 mt-1">{hw.brand}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW & SUMMARY */}
        {activeStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#252522]">
                06. Configuration Summary & Verification
              </h3>
              <p className="text-xs text-[#252522]/70 mt-1">
                Derived product specifications ready for showroom quotation and factory CNC handoff.
              </p>
            </div>

            {/* Quick Spec List */}
            <div className="bg-[#F7F5F0] p-4 rounded-xl border border-[#DDD8CF] space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#DDD8CF]/60">
                <span className="text-[#252522]/60">Selected Dimensions</span>
                <span className="font-semibold text-[#252522]">
                  {config.size.toUpperCase()} ({config.size === 'king' ? '1920 × 2100 mm' : '1620 × 2100 mm'})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDD8CF]/60">
                <span className="text-[#252522]/60">Substrate Core</span>
                <span className="font-semibold text-[#252522]">
                  {CORE_MATERIALS.find((m) => m.id === config.coreMaterial)?.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDD8CF]/60">
                <span className="text-[#252522]/60">Finish & Series</span>
                <span className="font-semibold text-[#252522]">
                  {FINISHES.find((f) => f.id === config.finishType)?.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDD8CF]/60">
                <span className="text-[#252522]/60">Architectural Colour</span>
                <span className="font-semibold text-[#252522]">
                  {COLOR_TONES.find((c) => c.id === config.colorTone)?.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDD8CF]/60">
                <span className="text-[#252522]/60">Headboard Style</span>
                <span className="font-semibold text-[#252522]">
                  {HEADBOARD_STYLES.find((h) => h.id === config.headboardStyle)?.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DDD8CF]/60">
                <span className="text-[#252522]/60">Under-Bed Storage</span>
                <span className="font-semibold text-[#252522]">
                  {config.hasStorageDrawers ? 'Dual Pull-Out Drawers' : 'Standard Platform'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#252522]/60">Factory Lead Time</span>
                <span className="font-semibold text-emerald-700">14 - 18 Days (Bengaluru)</span>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={onOpenQuotationModal}
                className="p-3 rounded-xl border border-[#DDD8CF] bg-white hover:border-[#A58A63] transition flex items-center space-x-2 text-left"
              >
                <FileText className="w-4 h-4 text-[#A58A63] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#252522] block">Formal Quotation</span>
                  <span className="text-[10px] text-[#252522]/60">Generate printable quote</span>
                </div>
              </button>

              <button
                onClick={onOpenManufacturingSpec}
                className="p-3 rounded-xl border border-[#DDD8CF] bg-white hover:border-[#A58A63] transition flex items-center space-x-2 text-left"
              >
                <Cpu className="w-4 h-4 text-[#A58A63] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#252522] block">BOM & Cut List</span>
                  <span className="text-[10px] text-[#252522]/60">Inspect factory specs</span>
                </div>
              </button>

              <button
                onClick={onOpenDealerRolePreview}
                className="p-3 rounded-xl border border-[#DDD8CF] bg-white hover:border-[#A58A63] transition flex items-center space-x-2 text-left"
              >
                <Briefcase className="w-4 h-4 text-[#A58A63] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#252522] block">Dealer Economics</span>
                  <span className="text-[10px] text-[#252522]/60">Partner margin preview</span>
                </div>
              </button>

              <button
                onClick={onOpenERPWorkflow}
                className="p-3 rounded-xl border border-[#DDD8CF] bg-white hover:border-[#A58A63] transition flex items-center space-x-2 text-left"
              >
                <Box className="w-4 h-4 text-[#A58A63] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#252522] block">ERP Lifecycle</span>
                  <span className="text-[10px] text-[#252522]/60">Simulate factory stages</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step Navigation Footer Controls */}
      <div className="p-4 border-t border-[#DDD8CF] bg-[#F7F5F0]/80 flex items-center justify-between">
        <button
          onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
          disabled={activeStep === 1}
          className="px-3 py-1.5 rounded-lg border border-[#DDD8CF] text-xs font-semibold text-[#252522] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition flex items-center space-x-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSaveConfig}
            className="p-2 rounded-lg border border-[#DDD8CF] bg-white hover:text-[#A58A63] transition text-[#252522]"
            title="Save Configuration to Browser Storage"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={onShareConfig}
            className="p-2 rounded-lg border border-[#DDD8CF] bg-white hover:text-[#A58A63] transition text-[#252522]"
            title="Copy Shareable Configuration Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {activeStep < 6 ? (
          <button
            onClick={() => setActiveStep(activeStep + 1)}
            className="px-4 py-1.5 rounded-lg bg-[#252522] text-white text-xs font-semibold hover:bg-[#A58A63] transition flex items-center space-x-1"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onOpenShowroomMode}
            className="px-4 py-1.5 rounded-lg bg-[#A58A63] text-white text-xs font-semibold hover:bg-[#6F513A] transition flex items-center space-x-1.5 shadow-sm"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Showroom Mode</span>
          </button>
        )}
      </div>

      {/* Live Indicative Price Bar */}
      <div className="p-4 bg-[#252522] text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] text-white/60 uppercase tracking-wider block font-medium">
            Indicative Customer MRP (Incl. 18% GST)
          </span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-2xl font-serif font-bold tracking-tight text-[#FFFEFC]">
              {formatINR(pricing.totalMRP)}
            </span>
            <span className="text-[10px] text-white/50">
              (Subtotal {formatINR(pricing.subtotal)})
            </span>
          </div>
        </div>

        <button
          onClick={onOpenQuotationModal}
          className="px-4 py-2 rounded-xl bg-[#A58A63] hover:bg-[#BCA27B] text-[#252522] text-xs font-bold transition shadow-sm"
        >
          Request Quote
        </button>
      </div>
    </div>
  );
};
