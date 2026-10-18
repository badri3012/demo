import React from 'react';
import {
  Store,
  Sliders,
  DollarSign,
  Factory,
  Package,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const BusinessEcosystemSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Customer Enters Dealer Showroom',
      role: 'Showroom Experience',
      icon: Store,
      description:
        'Homeowner visits a local furniture retail partner in Bengaluru. Instead of browsing limited static display inventory, the dealer launches the Flexispace digital kiosk.',
    },
    {
      num: '02',
      title: 'Co-Design & 3D Customization',
      role: 'Configuration Engine',
      icon: Sliders,
      description:
        'Together, they customize dimensions (King/Queen), substrate core, Italian PU vs acrylic finish, and optional under-bed soft-close drawers in real-time 3D.',
    },
    {
      num: '03',
      title: 'Instant MRP & Dealer Spread',
      role: 'Deterministic Commerce',
      icon: DollarSign,
      description:
        'The engine calculates exact retail MRP (incl. 18% GST). Behind the scenes, the dealer views their ~30% gross profit margin and captures the customer order.',
    },
    {
      num: '04',
      title: 'Settlement & Factory Release',
      role: 'Dual-Account Settlement',
      icon: TrendingUp,
      description:
        'Customer pays the local shop. The dealer settles the factory landing cost, keeping their profit spread. Flexispace instantly releases the CAD/CAM production work order.',
    },
    {
      num: '05',
      title: 'Precision Factory Production',
      role: 'Manufacturing Hub',
      icon: Factory,
      description:
        'Parametric specifications guide panel sizing, surface finishing, zero-joint edgebanding, and multi-wall protective flat-pack kitting at the Bengaluru manufacturing facility.',
    },
    {
      num: '06',
      title: 'Flat-Pack Dispatch & Local Installation',
      role: 'Fulfillment & Handover',
      icon: Package,
      description:
        '3 compact flat-pack boxes arrive at the customer residence. A certified local dealer technician completes assembly in under 60 minutes.',
    },
  ];

  return (
    <section id="ecosystem" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8CF]/80">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#A58A63] uppercase">
          Operating Business Architecture
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252522] tracking-tight">
          How the Flexispace Platform Powers Dealer Commerce
        </h2>
        <p className="text-sm sm:text-base text-[#252522]/70 leading-relaxed">
          Transforming traditional furniture showrooms from capital-heavy physical inventory warehouses into high-margin digital customization destinations.
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              className="p-6 rounded-2xl bg-white border border-[#DDD8CF] hover:border-[#A58A63] transition-all duration-300 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#A58A63] tracking-widest">
                    STEP {st.num}
                  </span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#ECE8E1] text-[#252522]">
                    {st.role}
                  </span>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F5F0] border border-[#DDD8CF] text-[#252522] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-[#A58A63]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#252522]">
                      {st.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#252522]/75 leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DDD8CF]/50 flex items-center text-[11px] text-[#A58A63] font-semibold space-x-1">
                <span>Integrated Ecosystem Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero Inventory Highlight Banner */}
      <div className="mt-12 p-8 bg-gradient-to-r from-[#252522] via-[#33312B] to-[#252522] text-white rounded-3xl border border-[#A58A63]/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A58A63]">
            The Zero-Inventory Advantage for Retail Partners
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFEFC]">
            Showroom Partners Stock Zero Finished Bed Inventory
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            Dealers display 1 or 2 tactile display units alongside the Flexispace touch configurator. Every customer sale is manufactured on-demand in Bengaluru with 14-day flat-pack dispatch, eliminating expensive warehouse overhead, stock obsolescence, and transport damage.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 text-center shrink-0 w-full md:w-auto">
          <span className="text-xs text-white/60 uppercase font-medium block">
            Target Dealer Margin
          </span>
          <span className="font-serif text-3xl font-bold text-[#A58A63] block mt-1">
            ~30.0%
          </span>
          <span className="text-[11px] text-white/70 block mt-1">
            Approx. 42.8% markup on landing cost
          </span>
        </div>
      </div>
    </section>
  );
};
