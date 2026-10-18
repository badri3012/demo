import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  return (
    <footer className="bg-[#252522] text-[#FFFEFC] pt-16 pb-12 border-t border-[#DDD8CF]/20">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#A58A63] text-[#252522] flex items-center justify-center font-serif text-lg font-bold">
                F
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                FLEXISPACE
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Transforming residential living spaces with precision-engineered, customizable made-to-order furniture and digital showroom commerce.
            </p>
            <div className="text-[11px] text-[#A58A63] font-medium">
              "Your Vision. Your Configuration. Expertly Crafted."
            </div>
          </div>

          {/* Bengaluru Design Studio Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A58A63]">
              Flagship Studio & Office
            </h4>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#A58A63] shrink-0 mt-0.5" />
                <span>
                  1st Floor, N.N. Arcade, 2093, 3rd Block, Sir M Vishveswaraya Layout, Jnana Ganga Nagar, Bengaluru, Karnataka 560056
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#A58A63] shrink-0" />
                <span>+91 77602 00991 / +91 98446 47971</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#A58A63] shrink-0" />
                <span>kiran@flexispaceinteriors.co.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#A58A63] shrink-0" />
                <span>Mon - Sat: 9:00 AM – 7:00 PM</span>
              </div>
            </div>
          </div>

          {/* Core Product Series */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A58A63]">
              Manufacturing Series
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <strong className="text-white block">Cinzel Series:</strong>
                <span>Luxury Italian PU multi-coat lacquer finishes & velvet touch</span>
              </li>
              <li>
                <strong className="text-white block">Aqua Series:</strong>
                <span>High-gloss acrylic surfaces with laser zero-joint edgebanding</span>
              </li>
              <li>
                <strong className="text-white block">Ecomodular Series:</strong>
                <span>Sustainable synchronized matte thermal laminates</span>
              </li>
            </ul>
          </div>

          {/* Development Partner & Disclosure */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A58A63]">
              Concept Development
            </h4>
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-2 text-xs text-white/70">
              <span className="text-[10px] uppercase font-bold text-[#A58A63] block">
                Engineering Partner
              </span>
              <p className="text-white font-serif text-base font-semibold">
                Demo provided by BlazeByte Studio
              </p>
              <p className="text-[11px] text-white/60">
                Coimbatore, Tamil Nadu, India
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="text-[10px] text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Concept Verified</span>
                </div>
                {onReplayIntro && (
                  <button
                    onClick={onReplayIntro}
                    className="text-[11px] text-[#A58A63] hover:text-white underline transition"
                  >
                    Replay Intro Experience
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transparent Production Boundary Disclosure */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[11px] text-white/60 leading-relaxed space-y-1">
          <strong className="text-white font-semibold block">
            Client Demonstration Notice & Production Boundary:
          </strong>
          <p>
            This software is an interactive concept demonstration developed by BlazeByte Studio for Flexispace Interiors. The 3D furniture viewer, dynamic pricing calculations, DFM compatibility logic, and quotation generator are live functional features. The ERP production queue, multi-tenant dealer role switching, and payment settlement flows are illustrative simulations designed to align operational requirements before formal paid engineering discovery and production contract execution.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
          <div>
            © {new Date().getFullYear()} Flexispace Interiors Design Studio. All rights reserved.
          </div>
          <div className="flex items-center space-x-3 text-white/60">
            <span>Bengaluru, Karnataka</span>
            <span>•</span>
            <span className="text-white/80 font-medium">Demo provided by BlazeByte Studio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
