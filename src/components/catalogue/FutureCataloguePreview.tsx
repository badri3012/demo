import React, { useState } from 'react';
import { CATALOGUE_PRODUCTS } from '../../data/catalogueData';
import type { CatalogueItem } from '../../data/catalogueData';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Ruler,
  CheckCircle2,
  Calendar,
  Info,
} from 'lucide-react';

interface FutureCataloguePreviewProps {
  onSelectActiveCot: () => void;
}

export const FutureCataloguePreview: React.FC<FutureCataloguePreviewProps> = ({
  onSelectActiveCot,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<CatalogueItem | null>(null);

  return (
    <section id="catalogue" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <span className="text-xs font-bold tracking-widest text-[#A58A63] uppercase">
          Ecosystem Product Families
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#252522] tracking-tight">
          Crafted for Every Room in the Home
        </h2>
        <p className="text-sm sm:text-base text-[#252522]/70 leading-relaxed">
          While the <strong className="text-[#252522]">Aura Platform Bed</strong> serves as our flagship working 3D configuration model today, Flexispace's manufacturing-aware engine is architected to scale across a complete residential collection.
        </p>
      </div>

      {/* Catalogue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATALOGUE_PRODUCTS.map((prod) => {
          const isActive = prod.status === 'active';
          const isRoadmap = prod.status === 'future_roadmap';

          return (
            <div
              key={prod.id}
              className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white shadow-sm hover:shadow-md ${
                isActive
                  ? 'border-[#A58A63] ring-1 ring-[#A58A63]/30'
                  : 'border-[#DDD8CF] hover:border-[#A58A63]/50'
              }`}
            >
              {/* Product Visual Thumbnail Area */}
              <div className="h-44 bg-gradient-to-br from-[#ECE8E1] to-[#DDD8CF] p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#252522] backdrop-blur-sm border border-black/5">
                    {prod.category}
                  </span>
                  {isActive ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>Live 3D Model</span>
                    </span>
                  ) : isRoadmap ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      Phase 4 Roadmap
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#252522]/10 text-[#252522]">
                      Concept Ready
                    </span>
                  )}
                </div>

                {/* Minimalist Graphic Icon / Visual */}
                <div className="flex items-center justify-center my-auto">
                  <h3 className="font-serif text-2xl font-bold text-[#252522]/80 text-center tracking-tight">
                    {prod.title}
                  </h3>
                </div>

                <div className="text-[11px] text-[#252522]/60 flex items-center justify-between">
                  <span>{prod.dimensionsRange}</span>
                  <span className="font-mono">{prod.id}</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#A58A63]">
                    {prod.tagline}
                  </p>
                  <p className="text-xs text-[#252522]/70 leading-relaxed line-clamp-3">
                    {prod.description}
                  </p>
                </div>

                {/* Materials Tags */}
                <div className="space-y-2 pt-2 border-t border-[#DDD8CF]/60">
                  <div className="flex flex-wrap gap-1.5">
                    {prod.materialsPreview.map((mat, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#F7F5F0] text-[#252522]/80 border border-[#DDD8CF]/70 font-medium"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#252522]/60 pt-2">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#A58A63]" />
                      <span>{prod.estimatedLeadTime}</span>
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  {isActive ? (
                    <button
                      onClick={onSelectActiveCot}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#252522] hover:bg-[#A58A63] text-white text-xs font-bold transition flex items-center justify-center space-x-2"
                    >
                      <span>Configure Live in 3D</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className="w-full py-2.5 px-3 rounded-xl border border-[#DDD8CF] hover:bg-[#F7F5F0] text-[#252522] text-xs font-semibold transition flex items-center justify-center space-x-1.5"
                    >
                      <Info className="w-3.5 h-3.5 text-[#A58A63]" />
                      <span>Inspect Architecture</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Popover Modal for Concept Products */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FFFEFC] rounded-2xl border border-[#DDD8CF] shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A58A63]">
                  {selectedProduct.category} • Concept Blueprint
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#252522]">
                  {selectedProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-xs p-1 text-[#252522]/50 hover:text-[#252522]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#252522]/80 leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="p-3 bg-[#F7F5F0] rounded-xl border border-[#DDD8CF] text-xs space-y-1.5">
              <div><strong>Parametric Dimensions:</strong> {selectedProduct.dimensionsRange}</div>
              <div><strong>Core Materials:</strong> {selectedProduct.materialsPreview.join(' • ')}</div>
              <div><strong>Production Target:</strong> {selectedProduct.estimatedLeadTime}</div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Ecosystem Roadmap:</strong> This product configuration schema is defined in Flexispace's parametric master model. Full 3D interactive viewport compilation is planned for deployment during Phase 4 of the commercial rollout.
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full py-2.5 rounded-xl bg-[#252522] text-white text-xs font-semibold hover:bg-[#A58A63] transition"
            >
              Return to Catalogue
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
