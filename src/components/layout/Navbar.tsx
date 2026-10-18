import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Briefcase,
  Cpu,
  Factory,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  onOpenShowroom: () => void;
  onOpenDealer: () => void;
  onOpenBOM: () => void;
  onOpenERP: () => void;
  onScrollToConfigurator: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenShowroom,
  onOpenDealer,
  onOpenBOM,
  onOpenERP,
  onScrollToConfigurator,
  onReplayIntro,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setPlatformDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPlatformDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#DDD8CF]/80 transition-all duration-300">
      {/* 02. BRANDING STRIP (Subtle Architectural Top Bar) */}
      <div className="bg-[#1C1D1F] text-[#E8E6E1] px-4 sm:px-6 py-2 text-[11px] border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between tracking-wide">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A86B] animate-pulse" />
            <span className="text-white/90 font-medium">Interactive Concept Demonstration</span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-[#C8A86B] font-medium hidden sm:inline">
              Flexispace Interiors, Bengaluru
            </span>
          </div>

          <div className="flex items-center space-x-3 text-white/75 text-[11px]">
            <span>
              Demo provided by <strong className="text-white font-semibold">BlazeByte Studio</strong>
            </span>
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="text-[#C8A86B] hover:text-white underline text-[10px] ml-1.5 transition-colors cursor-pointer"
                title="Replay luxury opening introduction"
              >
                Replay Intro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 01. MAIN DESKTOP NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* LEFT: Flexispace Logo & Wordmark */}
        <a href="#" className="flex items-center space-x-3 group select-none">
          <div className="w-9 h-9 rounded-lg bg-[#1C1D1F] text-[#F7F5F0] flex items-center justify-center font-serif text-lg font-bold border border-[#C8A86B]/30 group-hover:border-[#C8A86B] group-hover:bg-[#252522] transition-all shadow-sm">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-[0.08em] text-[#1C1D1F] leading-tight">
              FLEXISPACE
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#A58A63] font-semibold mt-0.5">
              Furniture, Designed Around You
            </span>
          </div>
        </a>

        {/* CENTER: Minimal Luxury Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-[13px] font-medium text-[#252522]/80">
          <button
            onClick={onScrollToConfigurator}
            className="hover:text-[#1C1D1F] hover:text-[#C8A86B] transition-colors py-1 relative group cursor-pointer"
          >
            <span>Configurator</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8A86B] transition-all duration-300 group-hover:w-full" />
          </button>

          <a
            href="#catalogue"
            className="hover:text-[#1C1D1F] hover:text-[#C8A86B] transition-colors py-1 relative group cursor-pointer"
          >
            <span>Catalogue</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8A86B] transition-all duration-300 group-hover:w-full" />
          </a>

          <button
            onClick={onOpenShowroom}
            className="hover:text-[#1C1D1F] hover:text-[#C8A86B] transition-colors py-1 relative group cursor-pointer"
          >
            <span>Showroom</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C8A86B] transition-all duration-300 group-hover:w-full" />
          </button>

          {/* PLATFORM DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
              className={`flex items-center space-x-1.5 py-1 transition-colors cursor-pointer group ${
                platformDropdownOpen ? 'text-[#C8A86B]' : 'hover:text-[#C8A86B]'
              }`}
              aria-expanded={platformDropdownOpen}
              aria-haspopup="true"
            >
              <span>Platform</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  platformDropdownOpen ? 'rotate-180 text-[#C8A86B]' : 'text-[#252522]/50 group-hover:text-[#C8A86B]'
                }`}
              />
            </button>

            {/* Dropdown Menu Card */}
            {platformDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[#FDFBF7] rounded-xl shadow-xl border border-[#DDD8CF] p-2 animate-in fade-in zoom-in-95 duration-150 z-50">
                <button
                  onClick={() => {
                    onOpenDealer();
                    setPlatformDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-[#ECE8E1] transition-colors flex items-center space-x-3 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-md bg-[#ECE8E1] group-hover:bg-[#1C1D1F] group-hover:text-white flex items-center justify-center transition-colors text-[#6F513A]">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1C1D1F] block">
                      Dealer Economics
                    </span>
                    <span className="text-[10px] text-[#252522]/60 block leading-tight">
                      Zero-inventory partner margins
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenBOM();
                    setPlatformDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-[#ECE8E1] transition-colors flex items-center space-x-3 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-md bg-[#ECE8E1] group-hover:bg-[#1C1D1F] group-hover:text-white flex items-center justify-center transition-colors text-[#6F513A]">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1C1D1F] block">
                      Manufacturing Specification
                    </span>
                    <span className="text-[10px] text-[#252522]/60 block leading-tight">
                      CAD/CAM cut list & BOM
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenERP();
                    setPlatformDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-[#ECE8E1] transition-colors flex items-center space-x-3 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-md bg-[#ECE8E1] group-hover:bg-[#1C1D1F] group-hover:text-white flex items-center justify-center transition-colors text-[#6F513A]">
                    <Factory className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1C1D1F] block">
                      ERP Lifecycle
                    </span>
                    <span className="text-[10px] text-[#252522]/60 block leading-tight">
                      Peenya Unit 01 order tracking
                    </span>
                  </div>
                </button>

                <a
                  href="#roadmap"
                  onClick={() => setPlatformDropdownOpen(false)}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg hover:bg-[#ECE8E1] transition-colors flex items-center space-x-3 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-md bg-[#ECE8E1] group-hover:bg-[#1C1D1F] group-hover:text-white flex items-center justify-center transition-colors text-[#6F513A]">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1C1D1F] block">
                      Roadmap
                    </span>
                    <span className="text-[10px] text-[#252522]/60 block leading-tight">
                      Pan-India scaling strategy
                    </span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT: Premium CTA Button */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={onScrollToConfigurator}
            className="px-5 py-2.5 rounded-xl bg-[#1C1D1F] hover:bg-[#A58A63] text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2 border border-white/10 group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A86B] group-hover:text-white transition-colors" />
            <span>Design Your Furniture</span>
          </button>
        </div>

        {/* MOBILE / TABLET MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#1C1D1F] hover:bg-[#ECE8E1] transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 03. RESPONSIVE MOBILE NAVIGATION PANEL */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-b border-[#DDD8CF] px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => {
                onScrollToConfigurator();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1C1D1F] hover:bg-[#ECE8E1] transition-colors"
            >
              Configurator
            </button>

            <a
              href="#catalogue"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1C1D1F] hover:bg-[#ECE8E1] transition-colors block"
            >
              Catalogue
            </a>

            <button
              onClick={() => {
                onOpenShowroom();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1C1D1F] hover:bg-[#ECE8E1] transition-colors"
            >
              Showroom
            </button>

            {/* Mobile Platform Accordion */}
            <div className="pt-1 border-t border-[#DDD8CF]/60 mt-1">
              <button
                onClick={() => setMobilePlatformOpen(!mobilePlatformOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1C1D1F] hover:bg-[#ECE8E1] transition-colors"
              >
                <span>Platform</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#A58A63] transition-transform duration-200 ${
                    mobilePlatformOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobilePlatformOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1 bg-[#F7F5F0] rounded-lg mt-1 border border-[#DDD8CF]/50">
                  <button
                    onClick={() => {
                      onOpenDealer();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#252522]/80 hover:text-[#1C1D1F] flex items-center space-x-2"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#A58A63]" />
                    <span>Dealer Economics</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenBOM();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#252522]/80 hover:text-[#1C1D1F] flex items-center space-x-2"
                  >
                    <Cpu className="w-3.5 h-3.5 text-[#A58A63]" />
                    <span>Manufacturing Specification</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenERP();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#252522]/80 hover:text-[#1C1D1F] flex items-center space-x-2"
                  >
                    <Factory className="w-3.5 h-3.5 text-[#A58A63]" />
                    <span>ERP Lifecycle</span>
                  </button>

                  <a
                    href="#roadmap"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#252522]/80 hover:text-[#1C1D1F] flex items-center space-x-2 block"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#A58A63]" />
                    <span>Roadmap</span>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile CTA */}
          <div className="pt-2 border-t border-[#DDD8CF]/60">
            <button
              onClick={() => {
                onScrollToConfigurator();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-[#1C1D1F] hover:bg-[#A58A63] text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A86B]" />
              <span>Design Your Furniture</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
