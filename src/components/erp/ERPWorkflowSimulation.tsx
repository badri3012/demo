import React, { useState, useEffect } from 'react';
import type { ConfigurationState, ERPStage } from '../../types/configurator';
import { generateManufacturingSpec } from '../../utils/bomGenerator';
import {
  Factory,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  X,
  Truck,
  Wrench,
  Check,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface ERPWorkflowSimulationProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigurationState;
}

export const ERPWorkflowSimulation: React.FC<ERPWorkflowSimulationProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const spec = generateManufacturingSpec(config);

  const initialStages: ERPStage[] = [
    {
      id: 'received',
      title: 'Order Review & Commercial Validation',
      facility: 'Order Management Service (Bengaluru)',
      description: 'Dealer showroom logs customer configuration with confirmed specifications and commercial terms.',
      timestamp: 'Today, 10:15 AM',
      status: 'completed',
      operatorNotes: `Validated configuration SKU ${spec.configId} against standard production guidelines.`,
    },
    {
      id: 'cad_validation',
      title: 'Technical Validation & DFM Check',
      facility: 'Engineering Automation Hub',
      description: 'Parametric tolerance check and substrate suitability validation before factory scheduling.',
      timestamp: 'Today, 10:20 AM',
      status: 'completed',
      operatorNotes: `${spec.coreSubstrate} core matched with ${spec.exteriorFinish} specification. Zero dimensional conflicts.`,
    },
    {
      id: 'manufacturing_approval',
      title: 'Manufacturing Approval & Work Order Release',
      facility: 'Central Production Planning',
      description: 'Work order approved for material allocation and machine staging.',
      timestamp: 'Today, 11:30 AM',
      status: 'completed',
      operatorNotes: 'Simulated Work Order #WO-8924 released for production batching.',
    },
    {
      id: 'production_queue',
      title: 'Production & Precision Panel Processing',
      facility: 'Manufacturing Facility (Bengaluru)',
      description: 'Material staged from inventory to computerized sizing, routing, and edge-banding cells.',
      timestamp: 'Estimated Tomorrow, 09:00 AM',
      status: 'in_progress',
      operatorNotes: `Staged ${spec.bomItems.length} line-item components for calibrated machining.`,
    },
    {
      id: 'quality_inspection',
      title: 'Quality Check & Dimensional Tolerance Audit',
      facility: 'Quality Assurance Cell',
      description: 'Visual surface audit, dimensional tolerance verification, and dry-fit inspection.',
      timestamp: 'Day 5, 04:30 PM',
      status: 'pending',
      operatorNotes: 'Checked against ±0.2mm tolerance envelope and surface sheen standards.',
    },
    {
      id: 'flatpack_dispatch',
      title: 'Flat-Pack Kitting & Dispatch',
      facility: 'Central Logistics Hub (Bengaluru)',
      description: 'Packaged into protective flat-pack cartons with barcode identifiers for transport.',
      timestamp: 'Day 8, 11:00 AM',
      status: 'pending',
      operatorNotes: `Allocated to ${spec.flatPackBoxes} multi-wall cartons with edge guards (~${spec.estimatedWeightKg} kg total).`,
    },
    {
      id: 'dealer_installation',
      title: 'Dealer Delivery & White-Glove Installation',
      facility: 'Customer Residence (Bengaluru)',
      description: 'Certified dealer technician executes on-site assembly and customer handover.',
      timestamp: 'Day 10, 02:00 PM',
      status: 'pending',
      operatorNotes: 'On-site assembly and customer handover sign-off.',
    },
    {
      id: 'completed',
      title: 'Final Handover & Warranty Activation',
      facility: 'Customer Service & Warranty Portal',
      description: 'Final order sign-off, commercial settlement, and warranty record activation.',
      timestamp: 'Day 10, 06:00 PM',
      status: 'pending',
      operatorNotes: 'Structural warranty registered in Flexispace customer database.',
    },
  ];

  const [stages, setStages] = useState<ERPStage[]>(initialStages);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(3); // Starts at in_progress index

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Advance simulation to next state
  const advanceToNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextIndex = currentStageIndex + 1;
      const updated = stages.map((st, i) => {
        if (i < nextIndex) return { ...st, status: 'completed' as const };
        if (i === nextIndex) return { ...st, status: 'in_progress' as const, timestamp: 'Simulated Just Now' };
        return { ...st, status: 'pending' as const };
      });
      setStages(updated);
      setCurrentStageIndex(nextIndex);
    }
  };

  // Reset simulation
  const resetSimulation = () => {
    setStages(initialStages);
    setCurrentStageIndex(3);
  };

  if (!isOpen) return null;

  const activeStage = stages[currentStageIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFEFC] rounded-2xl border border-[#DDD8CF] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#DDD8CF] bg-[#F7F5F0] shrink-0">
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                ERP Workflow Concept — Simulation Only
              </span>
              <span className="text-[11px] text-[#252522]/60 font-medium hidden sm:inline">
                • Illustrative Lifecycle
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={resetSimulation}
                className="p-1.5 sm:p-2 text-[#252522]/60 hover:text-[#252522] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                aria-label="Close ERP Simulation"
                className="p-1.5 sm:p-2 text-[#252522]/60 hover:text-[#252522] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#252522] text-[#A58A63] flex items-center justify-center shrink-0">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#252522] leading-tight">
                Simulated Order-to-Manufacturing Execution
              </h2>
              <p className="text-[11px] sm:text-xs text-[#252522]/60 mt-0.5">
                Conceptual workflow demonstrating end-to-end production handoff
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1">
          {/* Explicit Concept Disclaimer */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold block">ERP Workflow Concept — Simulation Only:</strong>
              This interactive simulation demonstrates how customer configurations can translate to factory floor execution, quality control checkpoints, and dealer installation. No live production ERP (SAP / NetSuite / Odoo) is connected during this concept demonstration.
            </div>
          </div>

          {/* Active Work Order Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 bg-[#F7F5F0] p-3.5 sm:p-4 rounded-xl border border-[#DDD8CF] text-xs">
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Demo Order Ref</span>
              <span className="font-mono font-bold text-[#252522] block mt-0.5">ORD-BLR-2026-9042</span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Facility</span>
              <span className="font-bold text-[#252522] block mt-0.5">Manufacturing Hub</span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Configured SKU</span>
              <span className="font-mono font-bold text-[#252522] block mt-0.5 truncate">{spec.configId}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Current Lifecycle</span>
              <span className="font-semibold text-purple-900 block mt-0.5">
                Stage {currentStageIndex + 1} of {stages.length}
              </span>
            </div>
          </div>

          {/* Interactive Stepper Advance Action */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#252522] to-[#3D3A34] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider block">
                Active Manufacturing State
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FFFEFC] mt-0.5">
                {activeStage.title}
              </h3>
              <p className="text-xs text-white/70 mt-1 max-w-md leading-relaxed">
                {activeStage.description}
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              {currentStageIndex < stages.length - 1 ? (
                <button
                  onClick={advanceToNextStage}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#A58A63] hover:bg-[#BCA27B] text-[#252522] text-xs font-bold transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                >
                  <span>Simulate Next Stage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-600/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center justify-center space-x-1.5">
                  <Check className="w-4 h-4" />
                  <span>Full Lifecycle Completed</span>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Timeline Visualizer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#252522]/70">
              End-to-End Production Progression
            </h4>
            <div className="space-y-2 sm:space-y-2.5">
              {stages.map((stage, idx) => {
                const isCompleted = stage.status === 'completed';
                const isCurrent = stage.status === 'in_progress';
                return (
                  <div
                    key={stage.id}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-colors flex items-start space-x-3 ${
                      isCurrent
                        ? 'border-purple-300 bg-purple-50/70 ring-1 ring-purple-300'
                        : isCompleted
                        ? 'border-[#DDD8CF] bg-white'
                        : 'border-[#DDD8CF]/60 bg-[#F7F5F0]/50 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-purple-600 text-white animate-pulse'
                          : 'bg-[#DDD8CF] text-[#252522]/60'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-xs font-bold text-[#252522]">{stage.title}</span>
                        <span className="text-[10px] text-[#252522]/50 font-mono">{stage.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#252522]/70 mt-0.5">{stage.facility}</p>
                      <div className="mt-1.5 text-[10px] bg-black/5 p-2 rounded-md font-mono text-[#252522]/80 break-words">
                        <strong>Log:</strong> {stage.operatorNotes}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[#DDD8CF] bg-[#F7F5F0] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[#252522]/60 text-center sm:text-left">
            ERP Workflow Concept — Simulation Only.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-semibold bg-[#252522] text-white hover:bg-[#A58A63] transition-colors cursor-pointer"
          >
            Close ERP Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
