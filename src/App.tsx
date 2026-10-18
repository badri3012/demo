import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { ConfigurationState } from './types/configurator';
import { DEFAULT_CONFIGURATION } from './data/productData';
import { calculatePrice, formatINR } from './utils/pricingEngine';
import { validateConfiguration } from './utils/validationEngine';

// Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FurnitureViewer3D } from './components/3d/FurnitureViewer3D';
import { ConfiguratorPanel } from './components/configurator/ConfiguratorPanel';
import { ValidationModal } from './components/configurator/ValidationModal';
import { ShowroomMode } from './components/configurator/ShowroomMode';
import { DealerRolePreview } from './components/configurator/DealerRolePreview';
import { QuotationModal } from './components/summary/QuotationModal';
import { ManufacturingSpecView } from './components/manufacturing/ManufacturingSpecView';
import { ERPWorkflowSimulation } from './components/erp/ERPWorkflowSimulation';
import { FutureCataloguePreview } from './components/catalogue/FutureCataloguePreview';
import { BusinessEcosystemSection } from './components/ecosystem/BusinessEcosystemSection';
import { ScalabilityRoadmap } from './components/roadmap/ScalabilityRoadmap';
import { LuxuryIntroExperience } from './components/intro/LuxuryIntroExperience';

import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Tv,
  Briefcase,
  Box,
  FileText,
  RotateCcw,
  Check,
} from 'lucide-react';

export function App() {
  // Configuration State
  const [config, setConfig] = useState<ConfigurationState>(() => {
    const saved = localStorage.getItem('flexispace_saved_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved configuration', e);
      }
    }
    return DEFAULT_CONFIGURATION;
  });

  // Modal Visibility States
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showShowroomMode, setShowShowroomMode] = useState(false);
  const [showDealerPreview, setShowDealerPreview] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showManufacturingSpec, setShowManufacturingSpec] = useState(false);
  const [showERPWorkflow, setShowERPWorkflow] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const configuratorRef = useRef<HTMLDivElement>(null);

  // Pricing calculation derived from state
  const pricing = calculatePrice(config);

  // Validation rules derived from state
  const validation = validateConfiguration(config, (updates) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  });

  const hasValidationErrors = !validation.isValid;

  // Handle configuration changes
  const handleConfigChange = (updates: Partial<ConfigurationState>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Save to browser LocalStorage
  const handleSaveConfig = () => {
    localStorage.setItem('flexispace_saved_config', JSON.stringify(config));
    triggerToast('Configuration saved locally to your browser storage.');
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#A58A63', '#252522', '#6F513A'],
      });
    } catch (e) {}
  };

  // Copy shareable configuration code
  const handleShareConfig = () => {
    const code = `FLX-${config.size.toUpperCase()}-${config.coreMaterial.toUpperCase()}-${config.finishType.toUpperCase()}-${config.colorTone.toUpperCase()}`;
    navigator.clipboard?.writeText(window.location.href);
    triggerToast(`Configuration ID ${code} copied to clipboard.`);
  };

  // Reset to default
  const handleResetConfig = () => {
    setConfig(DEFAULT_CONFIGURATION);
    triggerToast('Configuration reset to baseline.');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const scrollToConfigurator = () => {
    configuratorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#252522] flex flex-col selection:bg-[#A58A63]/20">
      {/* LUXURY OPENING EXPERIENCE */}
      {showIntro && (
        <LuxuryIntroExperience onComplete={() => setShowIntro(false)} />
      )}

      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#252522] text-white px-4 py-2.5 rounded-xl shadow-xl border border-white/10 text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Brand Navigation */}
      <Navbar
        onOpenShowroom={() => setShowShowroomMode(true)}
        onOpenDealer={() => setShowDealerPreview(true)}
        onOpenBOM={() => setShowManufacturingSpec(true)}
        onOpenERP={() => setShowERPWorkflow(true)}
        onScrollToConfigurator={scrollToConfigurator}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* HERO SECTION: EDITORIAL LUXURY INTRODUCTION */}
      <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#ECE8E1] border border-[#DDD8CF] text-xs font-semibold text-[#6F513A]">
              <Sparkles className="w-3.5 h-3.5 text-[#A58A63]" />
              <span>Bengaluru's First Manufacturing-Aware Furniture Platform</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#252522] leading-[1.08]">
              Furniture, Designed <br />
              <span className="italic font-normal text-[#A58A63]">Around You.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#252522]/75 leading-relaxed max-w-2xl">
              Discover a new way to create made-to-order furniture. Explore architectural materials, refine Italian PU finishes, personalize under-bed storage, and visualize your configuration in real-time 3D before it is manufactured in our Bengaluru factories.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToConfigurator}
                className="px-6 py-3.5 rounded-xl bg-[#252522] hover:bg-[#A58A63] text-white text-sm font-bold transition shadow-md flex items-center space-x-2.5 group"
              >
                <span>Design Your Furniture</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setShowShowroomMode(true)}
                className="px-6 py-3.5 rounded-xl bg-[#FFFEFC] hover:bg-[#ECE8E1] text-[#252522] border border-[#DDD8CF] text-sm font-semibold transition flex items-center space-x-2 shadow-sm"
              >
                <Tv className="w-4 h-4 text-[#A58A63]" />
                <span>Showroom Display Mode</span>
              </button>

              <button
                onClick={() => setShowDealerPreview(true)}
                className="px-5 py-3.5 rounded-xl border border-transparent hover:border-[#DDD8CF] text-[#252522]/80 hover:text-[#252522] text-sm font-semibold transition flex items-center space-x-1.5"
              >
                <Briefcase className="w-4 h-4 text-[#A58A63]" />
                <span>Dealer Economics</span>
              </button>
            </div>

            {/* Credibility Key Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#DDD8CF]/80 text-xs">
              <div>
                <span className="font-serif text-2xl font-bold text-[#252522] block">
                  0.1 mm
                </span>
                <span className="text-[#252522]/60 mt-0.5 block">Automated CNC precision</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#252522] block">
                  14 Days
                </span>
                <span className="text-[#252522]/60 mt-0.5 block">Bengaluru flat-pack delivery</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#252522] block">
                  100%
                </span>
                <span className="text-[#252522]/60 mt-0.5 block">DFM manufacturable rules</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Interactive Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#FFFEFC] rounded-3xl p-4 border border-[#DDD8CF] shadow-xl relative overflow-hidden group">
              <div className="h-72 sm:h-80 rounded-2xl overflow-hidden relative">
                <FurnitureViewer3D config={config} isCompact={true} />
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A58A63]">
                      Flagship Model
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#252522]">
                      Aura Platform Bed
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#252522]/50 block">
                      Live Indicative MRP
                    </span>
                    <span className="text-xl font-serif font-bold text-[#252522]">
                      {formatINR(pricing.totalMRP)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#252522]/70 pt-2 border-t border-[#DDD8CF]/60">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>5-Year Structural Warranty</span>
                  </span>
                  <button
                    onClick={scrollToConfigurator}
                    className="text-[#A58A63] font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Customize in Full Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE EXPERIENCE: INTERACTIVE 3D FURNITURE CONFIGURATOR */}
      <section
        id="configurator"
        ref={configuratorRef}
        className="py-12 px-6 max-w-7xl mx-auto w-full scroll-mt-20"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#A58A63] uppercase">
              Flagship Demonstration
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252522] tracking-tight">
              Aura Platform Cot Studio
            </h2>
            <p className="text-xs sm:text-sm text-[#252522]/70 mt-1 max-w-xl">
              Rotate the bed, modify core substrates, apply Italian PU or acrylic coatings, toggle soft-close drawers, and watch live prices update deterministically.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetConfig}
              className="px-3 py-1.5 rounded-lg border border-[#DDD8CF] bg-white hover:bg-[#F7F5F0] text-xs font-semibold text-[#252522] transition flex items-center space-x-1.5"
              title="Reset Cot Options"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#252522]/60" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setShowQuotationModal(true)}
              className="px-4 py-1.5 rounded-lg bg-[#252522] hover:bg-[#A58A63] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-[#A58A63]" />
              <span>Formal Quote Sheet</span>
            </button>
          </div>
        </div>

        {/* 60 / 40 Configurator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Approx 60%): Interactive Three.js 3D Viewport */}
          <div className="lg:col-span-7 h-[500px] sm:h-[600px] lg:h-[720px] rounded-2xl sticky top-24">
            <FurnitureViewer3D
              config={config}
              onToggleDrawers={() => handleConfigChange({ drawersOpen: !config.drawersOpen })}
            />
          </div>

          {/* Right Column (Approx 40%): Progressive Step Configurator Panel */}
          <div className="lg:col-span-5 h-[500px] sm:h-[600px] lg:h-[720px]">
            <ConfiguratorPanel
              config={config}
              onChange={handleConfigChange}
              pricing={pricing}
              hasErrors={hasValidationErrors}
              onOpenValidationModal={() => setShowValidationModal(true)}
              onOpenShowroomMode={() => setShowShowroomMode(true)}
              onOpenDealerRolePreview={() => setShowDealerPreview(true)}
              onOpenQuotationModal={() => setShowQuotationModal(true)}
              onOpenManufacturingSpec={() => setShowManufacturingSpec(true)}
              onOpenERPWorkflow={() => setShowERPWorkflow(true)}
              onSaveConfig={handleSaveConfig}
              onShareConfig={handleShareConfig}
            />
          </div>
        </div>
      </section>

      {/* MODULE: FURNITURE CATALOGUE EXPERIENCE */}
      <FutureCataloguePreview onSelectActiveCot={scrollToConfigurator} />

      {/* MODULE: BUSINESS ECOSYSTEM & ZERO-INVENTORY STORE PARADIGM */}
      <BusinessEcosystemSection />

      {/* MODULE: STRATEGIC SCALABILITY ROADMAP */}
      <ScalabilityRoadmap />

      {/* MODALS */}
      <ValidationModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        issues={validation.issues}
      />

      <ShowroomMode
        isOpen={showShowroomMode}
        onClose={() => setShowShowroomMode(false)}
        config={config}
        onChange={handleConfigChange}
        pricing={pricing}
        onOpenQuotationModal={() => {
          setShowShowroomMode(false);
          setShowQuotationModal(true);
        }}
      />

      <DealerRolePreview
        isOpen={showDealerPreview}
        onClose={() => setShowDealerPreview(false)}
        pricing={pricing}
        config={config}
      />

      <QuotationModal
        isOpen={showQuotationModal}
        onClose={() => setShowQuotationModal(false)}
        config={config}
        pricing={pricing}
      />

      <ManufacturingSpecView
        isOpen={showManufacturingSpec}
        onClose={() => setShowManufacturingSpec(false)}
        config={config}
      />

      <ERPWorkflowSimulation
        isOpen={showERPWorkflow}
        onClose={() => setShowERPWorkflow(false)}
        config={config}
      />

      {/* BRAND FOOTER */}
      <Footer onReplayIntro={() => setShowIntro(true)} />
    </div>
  );
}

export default App;
