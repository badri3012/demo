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
  FileText,
  Cpu,
  Bookmark,
  Share2,
  Box,
  ArrowRight,
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
    { num: 1, label: 'Dimensions', short: 'Size', icon: Ruler },
    { num: 2, label: 'Substrate', short: 'Core', icon: Layers },
    { num: 3, label: 'Finish', short: 'Finish', icon: Sparkles },
    { num: 4, label: 'Tone', short: 'Color', icon: Palette },
    { num: 5, label: 'Details', short: 'Options', icon: Sliders },
    { num: 6, label: 'Review', short: 'Review', icon: ShieldCheck },
  ];

  const currentStepObj = steps.find((s) => s.num === activeStep) || steps[0];

  const handleNext = () => {
    if (activeStep < 6) {
      setActiveStep(activeStep + 1);
    } else {
      onOpenQuotationModal();
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFEFC] border border-[#DDD8CF] rounded-2xl shadow-sm overflow-hidden">
      {/* 1. Header Bar: Model Title & Validation Badge */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#DDD8CF] bg-[#F7F5F0]/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#A58A63] block">
            Custom Specification
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1C1D1F] leading-tight">
            Aura Platform Bed
          </h2>
        </div>

        {/* Live Feasibility Badge */}
        <button
          onClick={onOpenValidationModal}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
            hasErrors
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
          }`}
          title="Click to inspect manufacturing validation rules"
        >
          {hasErrors ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>DFM Note</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>DFM Validated</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Step Navigator: Desktop Column Grid + Mobile Compact Progress Strip */}
      {/* Desktop View */}
      <div className="hidden sm:grid grid-cols-6 border-b border-[#DDD8CF] bg-[#ECE8E1]/40 text-center">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.num;
          const isDone = activeStep > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`py-2.5 px-1 flex flex-col items-center justify-center transition border-b-2 text-xs font-medium cursor-pointer ${
                isActive
                  ? 'border-[#C8A86B] text-[#1C1D1F] bg-[#FFFEFC]'
                  : isDone
                  ? 'border-transparent text-[#252522]/70 hover:text-[#252522]'
                  : 'border-transparent text-[#252522]/40 hover:text-[#252522]/70'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 mb-1 ${isActive ? 'text-[#C8A86B]' : ''}`} />
              <span className="text-[11px]">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Compact Progress Bar */}
      <div className="sm:hidden px-4 py-2.5 border-b border-[#DDD8CF] bg-[#ECE8E1]/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-[#1C1D1F] text-white text-[11px] font-bold flex items-center justify-center">
            {activeStep}
          </span>
          <div>
            <span className="text-[10px] text-[#A58A63] font-bold uppercase tracking-wider block">
              Step {activeStep} of 6
            </span>
            <span className="text-xs font-bold text-[#1C1D1F] block leading-none">
              {currentStepObj.label}
            </span>
          </div>
        </div>

        {/* Mini progress line indicator */}
        <div className="flex items-center space-x-1">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeStep === s.num
                  ? 'w-6 bg-[#C8A86B]'
                  : activeStep > s.num
                  ? 'w-2 bg-[#1C1D1F]'
                  : 'w-2 bg-[#DDD8CF]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3. Main Step Content Container */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5">
        {/* STEP 1: DIMENSIONS */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1D1F]">
                01. Sleeping Dimensions & Frame Size
              </h3>
              <p className="text-xs text-[#252522]/70 mt-0.5">
                Calibrated to Indian mattress dimensions. The 3D model, slat base array, and CAD cut list scale dynamically.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SIZES.map((sz) => {
                const isSelected = config.size === sz.id;
                return (
                  <button
                    key={sz.id}
                    onClick={() => onChange({ size: sz.id as BedSize })}
                    className={`p-3.5 sm:p-4 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'border-[#C8A86B] bg-[#C8A86B]/10 ring-1 ring-[#C8A86B]'
                        : 'border-[#DDD8CF] bg-white hover:border-[#C8A86B]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-[#1C1D1F]">{sz.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#C8A86B]" />}
                      </div>
                      <span className="text-xs text-[#A58A63] font-medium block">
                        {sz.subtitle}
                      </span>
                      <div className="mt-2.5 text-[11px] text-[#252522]/80 space-y-1 bg-[#F7F5F0] p-2.5 rounded-lg border border-[#DDD8CF]/60">
                        <div>
                          <strong className="text-[#1C1D1F]">Mattress:</strong> {sz.mattressSize}
                        </div>
                        <div>
                          <strong className="text-[#1C1D1F]">Frame (W×L×H):</strong> {sz.frameDimensions.width} × {sz.frameDimensions.length} × {sz.frameDimensions.height} mm
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#DDD8CF]/60 flex items-center justify-between">
                      <span className="text-xs text-[#252522]/60">Base Price</span>
                      <span className="text-xs font-bold text-[#1C1D1F]">
                        {formatINR(sz.basePrice)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-[#F7F5F0] rounded-xl text-[11px] sm:text-xs text-[#252522]/70 border border-[#DDD8CF] flex items-start space-x-2">
              <Ruler className="w-4 h-4 text-[#C8A86B] shrink-0 mt-0.5" />
              <span>
                <strong>Factory Note:</strong> Frame accommodates standard 78-inch Indian mattresses with a 20mm flush drop-in recess.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: CORE MATERIAL */}
        {activeStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1D1F]">
                02. Substrate Core Board Selection
              </h3>
              <p className="text-xs text-[#252522]/70 mt-0.5">
                The structural core of your furniture. Engineered for extreme humidity resistance and lifetime screw retention.
              </p>
            </div>

            <div className="space-y-2.5">
              {CORE_MATERIALS.map((mat) => {
                const isSelected = config.coreMaterial === mat.id;
                return (
                  <button
                    key={mat.id}
                    onClick={() => onChange({ coreMaterial: mat.id as CoreMaterial })}
                    className={`w-full p-3.5 rounded-xl border text-left transition relative cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'border-[#C8A86B] bg-[#C8A86B]/10 ring-1 ring-[#C8A86B]'
                        : 'border-[#DDD8CF] bg-white hover:border-[#C8A86B]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-[#1C1D1F]">{mat.name}</span>
                          {mat.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C8A86B]/20 text-[#6F513A]">
                              {mat.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#252522]/60 mt-0.5 font-medium">{mat.tagline}</p>
                      </div>
                      <span className="text-xs font-bold text-[#1C1D1F] shrink-0 ml-2">
                        {mat.priceDelta > 0
                          ? `+${formatINR(mat.priceDelta)}`
                          : mat.priceDelta < 0
                          ? `-${formatINR(Math.abs(mat.priceDelta))}`
                          : 'Included'}
                      </span>
                    </div>

                    <p className="text-xs text-[#252522]/75 mt-1.5 leading-relaxed">
                      {mat.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#DDD8CF]/60 grid grid-cols-2 gap-2 text-[11px] text-[#252522]/70">
                      <div><strong className="text-[#1C1D1F]">Density:</strong> {mat.density}</div>
                      <div><strong className="text-[#1C1D1F]">Moisture:</strong> {mat.moistureResistance}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: FINISH */}
        {activeStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1D1F]">
                03. Surface Finish Treatment
              </h3>
              <p className="text-xs text-[#252522]/70 mt-0.5">
                Flexispace signature finishes: Cinzel Luxury PU, Aqua Acrylic Mirror, or Ecomodular Satin Laminate.
              </p>
            </div>

            <div className="space-y-2.5">
              {FINISHES.map((fin) => {
                const isSelected = config.finishType === fin.id;
                return (
                  <button
                    key={fin.id}
                    onClick={() => onChange({ finishType: fin.id as FinishType })}
                    className={`w-full p-3.5 rounded-xl border text-left transition relative cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'border-[#C8A86B] bg-[#C8A86B]/10 ring-1 ring-[#C8A86B]'
                        : 'border-[#DDD8CF] bg-white hover:border-[#C8A86B]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-[#1C1D1F]">{fin.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1C1D1F]/10 text-[#1C1D1F]">
                            {fin.series} Series
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#1C1D1F] shrink-0 ml-2">
                        {fin.priceDelta > 0 ? `+${formatINR(fin.priceDelta)}` : 'Standard'}
                      </span>
                    </div>

                    <p className="text-xs text-[#252522]/75 mt-1.5 leading-relaxed">
                      {fin.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#DDD8CF]/60 grid grid-cols-2 gap-2 text-[11px] text-[#252522]/70">
                      <div><strong className="text-[#1C1D1F]">Sheen:</strong> {fin.sheen}</div>
                      <div><strong className="text-[#1C1D1F]">Hardness:</strong> {fin.scratchResistance}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: COLOUR TONE */}
        {activeStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1D1F]">
                04. Architectural Tone & Colourway
              </h3>
              <p className="text-xs text-[#252522]/70 mt-0.5">
                Curated palette designed to complement contemporary Indian residential interiors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COLOR_TONES.map((col) => {
                const isSelected = config.colorTone === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => onChange({ colorTone: col.id as ColorTone })}
                    className={`p-3.5 rounded-xl border text-left transition flex items-center space-x-3.5 cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'border-[#C8A86B] bg-[#C8A86B]/10 ring-1 ring-[#C8A86B]'
                        : 'border-[#DDD8CF] bg-white hover:border-[#C8A86B]/50'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl border border-black/15 shrink-0 shadow-sm"
                      style={{ backgroundColor: col.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1C1D1F] truncate">{col.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#C8A86B] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-[#252522]/65 mt-0.5 line-clamp-1">
                        {col.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: HARDWARE & HEADBOARD */}
        {activeStep === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Headboard Styles */}
            <div>
              <h3 className="font-serif text-base font-semibold text-[#1C1D1F]">
                Headboard Architectural Style
              </h3>
              <p className="text-xs text-[#252522]/70 mt-0.5">
                Select your architectural headboard treatment.
              </p>
              <div className="mt-3 space-y-2">
                {HEADBOARD_STYLES.map((hb) => {
                  const isSelected = config.headboardStyle === hb.id;
                  return (
                    <button
                      key={hb.id}
                      onClick={() => onChange({ headboardStyle: hb.id as HeadboardStyle })}
                      className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                        isSelected
                          ? 'border-[#C8A86B] bg-[#C8A86B]/10 ring-1 ring-[#C8A86B]'
                          : 'border-[#DDD8CF] bg-white hover:border-[#C8A86B]/50'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[#1C1D1F] block">{hb.name}</span>
                        <span className="text-[11px] text-[#252522]/65">{hb.description}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#1C1D1F] shrink-0 ml-2">
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
                  <h3 className="font-serif text-base font-semibold text-[#1C1D1F]">
                    Under-Bed Soft-Close Drawers
                  </h3>
                  <p className="text-xs text-[#252522]/70 mt-0.5">
                    Twin 800mm deep soft-close pull-out drawers (+₹8,500).
                  </p>
                </div>
                <button
                  onClick={() => onChange({ hasStorageDrawers: !config.hasStorageDrawers })}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 mt-1 cursor-pointer ${
                    config.hasStorageDrawers ? 'bg-[#C8A86B]' : 'bg-[#DDD8CF]'
                  }`}
                  aria-label="Toggle Storage Drawers"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      config.hasStorageDrawers ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Hardware Selection */}
              {config.hasStorageDrawers && (
                <div className="mt-3.5 p-3 bg-[#F7F5F0] rounded-xl border border-[#DDD8CF] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F513A] block">
                    Runner Hardware Package
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {HARDWARE_PACKAGES.map((hw) => {
                      const isSelected = config.hardwarePackage === hw.id;
                      return (
                        <button
                          key={hw.id}
                          onClick={() => onChange({ hardwarePackage: hw.id as HardwarePackage })}
                          className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                            isSelected
                              ? 'border-[#C8A86B] bg-white ring-1 ring-[#C8A86B]'
                              : 'border-[#DDD8CF] bg-white/70 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-[#1C1D1F]">
                            <span>{hw.name}</span>
                            <span>{hw.priceDelta > 0 ? `+${formatINR(hw.priceDelta)}` : 'Included'}</span>
                          </div>
                          <p className="text-[10px] text-[#252522]/60 mt-0.5">{hw.brand}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW */}
        {activeStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1D1F]">
                06. Specification Review & Quotation
              </h3>
              <p className="text-xs text-[#252522]/70 mt-0.5">
                Verify your custom configuration details before generating a formal factory order sheet.
              </p>
            </div>

            {/* Spec Card */}
            <div className="bg-[#F7F5F0] p-4 rounded-xl border border-[#DDD8CF] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#DDD8CF]">
                <span className="text-xs font-bold text-[#1C1D1F]">Model SKU</span>
                <span className="text-xs font-mono font-bold text-[#A58A63]">
                  FLX-{config.size.toUpperCase()}-{config.coreMaterial.toUpperCase()}-{config.finishType.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#252522]/60 block text-[10px]">Size</span>
                  <span className="font-semibold text-[#1C1D1F] capitalize">{config.size} Size</span>
                </div>
                <div>
                  <span className="text-[#252522]/60 block text-[10px]">Substrate</span>
                  <span className="font-semibold text-[#1C1D1F]">
                    {CORE_MATERIALS.find((m) => m.id === config.coreMaterial)?.name}
                  </span>
                </div>
                <div>
                  <span className="text-[#252522]/60 block text-[10px]">Finish</span>
                  <span className="font-semibold text-[#1C1D1F]">
                    {FINISHES.find((f) => f.id === config.finishType)?.name}
                  </span>
                </div>
                <div>
                  <span className="text-[#252522]/60 block text-[10px]">Colour Tone</span>
                  <span className="font-semibold text-[#1C1D1F]">
                    {COLOR_TONES.find((c) => c.id === config.colorTone)?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onOpenManufacturingSpec}
                className="p-3 rounded-xl border border-[#DDD8CF] bg-white hover:border-[#C8A86B] transition flex items-center space-x-2 text-left cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-[#A58A63] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#1C1D1F] block">Cut List & BOM</span>
                  <span className="text-[10px] text-[#252522]/60">10 CNC Parts</span>
                </div>
              </button>

              <button
                onClick={onOpenERPWorkflow}
                className="p-3 rounded-xl border border-[#DDD8CF] bg-white hover:border-[#C8A86B] transition flex items-center space-x-2 text-left cursor-pointer"
              >
                <Box className="w-4 h-4 text-[#A58A63] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#1C1D1F] block">ERP Lifecycle</span>
                  <span className="text-[10px] text-[#252522]/60">Peenya Unit 01</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Step Navigation Footer Controls (Desktop & Mobile In-flow) */}
      <div className="p-3.5 sm:p-4 border-t border-[#DDD8CF] bg-[#F7F5F0]/80 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={activeStep === 1}
          className="px-3 py-1.5 rounded-lg border border-[#DDD8CF] text-xs font-semibold text-[#252522] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition flex items-center space-x-1 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSaveConfig}
            className="p-2 rounded-lg border border-[#DDD8CF] bg-white hover:text-[#A58A63] transition text-[#252522] cursor-pointer"
            title="Save Configuration locally"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onShareConfig}
            className="p-2 rounded-lg border border-[#DDD8CF] bg-white hover:text-[#A58A63] transition text-[#252522] cursor-pointer"
            title="Copy Configuration Link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={handleNext}
          className="px-4 py-1.5 rounded-lg bg-[#1C1D1F] text-white text-xs font-semibold hover:bg-[#A58A63] transition flex items-center space-x-1 cursor-pointer shadow-sm"
        >
          <span>{activeStep < 6 ? 'Next Step' : 'Formal Quote'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5. Desktop Indicative Price Bar (Hidden on Mobile, where sticky floating price HUD takes over) */}
      <div className="hidden lg:flex p-4 bg-[#1C1D1F] text-white items-center justify-between">
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
          className="px-4 py-2 rounded-xl bg-[#C8A86B] hover:bg-[#D4AF37] text-[#1C1D1F] text-xs font-bold transition shadow-sm cursor-pointer"
        >
          Request Quote
        </button>
      </div>
    </div>
  );
};
