import React from 'react';
import {
  Compass,
  MapPin,
  Cpu,
  Layers,
  Network,
  Globe2,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const ScalabilityRoadmap: React.FC = () => {
  const phases = [
    {
      phase: 'Phase 01',
      title: 'Configurator & Commerce Concept Demonstration',
      status: 'Current Milestone',
      active: true,
      icon: Compass,
      location: 'Bengaluru / Coimbatore',
      description:
        'Deliver interactive 3D cot configurator, deterministic pricing engine, DFM validation matrix, and simulated dealer portal to align Flexispace leadership.',
      deliverables: [
        'Interactive Three.js 3D bed configurator with animated storage',
        'Deterministic line-item pricing engine with dealer spreads',
        'Automated manufacturing feasibility validation rules',
        'Interactive simulated ERP factory handoff lifecycle',
      ],
    },
    {
      phase: 'Phase 02',
      title: 'Bengaluru Dealer Network Pilot Program',
      status: 'Proposed Next Step',
      active: false,
      icon: MapPin,
      location: 'Bengaluru Showroom Hubs',
      description:
        'Deploy dedicated touchscreen kiosk displays across 10-15 authorized furniture dealer showrooms in Indiranagar, Whitefield, HSR Layout, and Jayanagar.',
      deliverables: [
        'Secure multi-tenant dealer authentication & role-based pricing',
        'Kiosk showroom display mode for in-store touch displays',
        'Dealer commission settlement & deposit capture ledger',
        'Local installer coordination routing across Bengaluru',
      ],
    },
    {
      phase: 'Phase 03',
      title: 'Manufacturing & Direct CNC CAM Integration',
      status: 'Factory Engineering',
      active: false,
      icon: Cpu,
      location: 'Bengaluru Manufacturing Facilities',
      description:
        'Connect the web configuration engine directly to factory ERP and 5-axis CNC machining centers for automatic parametric cut-list generation.',
      deliverables: [
        'Automated G-code / DXF export for Biesse & Homag CNC routers',
        'Production queue scheduling & raw panel inventory checks',
        'Direct ERP link (SAP / ERPNext / Odoo manufacturing modules)',
        'Barcoded flat-pack carton kitting & assembly manuals',
      ],
    },
    {
      phase: 'Phase 04',
      title: 'Expanded Living & Dining Furniture Families',
      status: 'Catalogue Scale',
      active: false,
      icon: Layers,
      location: 'Complete Residential Suite',
      description:
        'Extend parametric 3D configuration across the entire Flexispace catalog: study desks, sintered stone dining tables, crockery vitrines, mandirs, and vanities.',
      deliverables: [
        'Multi-category 3D procedural geometry modules',
        'Room package bundling (Master Suite, Living Suite, Foyer)',
        'Custom hardware accessory libraries & lighting options',
        'Architectural material swatch physical sample kit distribution',
      ],
    },
    {
      phase: 'Phase 05',
      title: 'Multi-Metro Franchise & Regional Expansion',
      status: 'Regional Growth',
      active: false,
      icon: Network,
      location: 'Chennai • Hyderabad • Kochi • Pune • Mumbai',
      description:
        'Expand retail dealer partner network to tier-1 South & West Indian metropolitans backed by regional logistics dispatch hubs.',
      deliverables: [
        'Regional warehouse hub inventory allocation',
        'Franchise dealer onboarding & certification academy',
        'Dynamic regional freight calculation & GST state filing',
        'SLA-guaranteed 10-day flatpack delivery corridors',
      ],
    },
    {
      phase: 'Phase 06',
      title: 'Pan-India Decentralized Manufacturing Ecosystem',
      status: 'National Vision',
      active: false,
      icon: Globe2,
      location: 'Pan-India Distribution',
      description:
        'A unified digital commerce and contract furniture manufacturing platform serving hundreds of franchise showrooms across India.',
      deliverables: [
        'Distributed contract factory network coordination',
        'Enterprise ERP synchronization & automated supplier replenishment',
        'National consumer warranty & aftermarket servicing ecosystem',
        'Zero-inventory retail showroom business model fulfillment',
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8CF]/80">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#A58A63] uppercase">
          Strategic Growth Roadmap
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252522] tracking-tight">
          From Bengaluru Pilot to Pan-India Scale
        </h2>
        <p className="text-sm sm:text-base text-[#252522]/70 leading-relaxed">
          A phased, disciplined rollout designed to validate real dealer unit economics in Bengaluru before scaling manufacturing capacity across Indian markets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((ph, idx) => {
          const Icon = ph.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                ph.active
                  ? 'bg-white border-[#A58A63] ring-1 ring-[#A58A63]/30 shadow-md'
                  : 'bg-[#FFFEFC] border-[#DDD8CF] hover:border-[#A58A63]/60 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#A58A63] tracking-widest uppercase">
                    {ph.phase}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      ph.active
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#ECE8E1] text-[#252522]/70'
                    }`}
                  >
                    {ph.status}
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      ph.active
                        ? 'bg-[#252522] text-[#A58A63]'
                        : 'bg-[#F7F5F0] text-[#252522]/70 border border-[#DDD8CF]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#252522]">
                      {ph.title}
                    </h3>
                    <span className="text-xs text-[#252522]/50 font-medium block mt-0.5">
                      {ph.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#252522]/75 leading-relaxed">
                  {ph.description}
                </p>

                <div className="pt-3 border-t border-[#DDD8CF]/60 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#252522]/50 block">
                    Key Objectives
                  </span>
                  {ph.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start space-x-1.5 text-xs text-[#252522]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A58A63] shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#DDD8CF]/40 text-[10px] text-[#252522]/50 italic">
                * Strategic guidance prepared by BlazeByte Studio for Flexispace commercial planning.
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
