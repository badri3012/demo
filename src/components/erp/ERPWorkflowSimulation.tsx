import React, { useState } from 'react';
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
  if (!isOpen) return null;

  const spec = generateManufacturingSpec(config);

  const initialStages: ERPStage[] = [
    {
      id: 'received',
      title: 'Order Received & Verified',
      facility: 'Flexispace Cloud Hub (Bengaluru)',
      description: 'Dealer showroom captured order with initial customer advance payment token.',
      timestamp: 'Today, 10:15 AM',
      status: 'completed',
      operatorNotes: 'Verified dealer credit line and customer configuration hash.',
    },
    {
      id: 'cad_validation',
      title: 'Automated DFM & CAD Check',
      facility: 'Engineering Automation Service',
      description: 'Geometric tolerance validation and automatic parametric panel nesting compilation.',
      timestamp: 'Today, 10:18 AM',
      status: 'completed',
      operatorNotes: 'Action TESA HDHMR core matched with 2mm laser edgeband profile. Zero errors.',
    },
    {
      id: 'manufacturing_approval',
      title: 'Manufacturing Release (WO Release)',
      facility: 'Central Planning Office',
      description: 'Work order released for production scheduling and raw material pull.',
      timestamp: 'Today, 11:30 AM',
      status: 'completed',
      operatorNotes: 'Released Work Order #WO-8924. Scheduled for Factory Unit 01 (Peenya, Bengaluru).',
    },
    {
      id: 'production_queue',
      title: 'Factory Unit 01: Production Queue',
      facility: 'Factory Unit 01 (Peenya Industrial Area, Bengaluru)',
      description: 'Material assigned from raw board staging to automated CNC nesting machine.',
      timestamp: 'Estimated Tomorrow, 09:00 AM',
      status: 'in_progress',
      operatorNotes: 'Nesting optimization batch 4-B. Expected yield efficiency: 94.2%.',
    },
    {
      id: 'cnc_machining',
      title: '5-Axis CNC Machining & PUR Edgebanding',
      facility: 'Factory Unit 01 — Machine Cell 03',
      description: 'High-speed router cuts mitres, dowel borings, and applies zero-joint PUR edgeband.',
      timestamp: 'Day 3, 02:00 PM',
      status: 'pending',
      operatorNotes: 'Biesse Rover 5-axis cell programmed for 45-degree corner mitres.',
    },
    {
      id: 'quality_inspection',
      title: 'QC Inspection & Tolerance Gauge',
      facility: 'Quality Assurance Lab (Peenya)',
      description: 'Digital caliper scan, finish gloss level reading, and dry-fit drawer slide check.',
      timestamp: 'Day 5, 04:30 PM',
      status: 'pending',
      operatorNotes: 'Dimensional tolerance tolerance checked within ±0.2mm tolerance.',
    },
    {
      id: 'flatpack_dispatch',
      title: 'Flat-Pack Kitting & Logistics Dispatch',
      facility: 'Bengaluru Central Distribution Hub',
      description: 'Packed into 3 honeycomb corrugated cartons with barcode labels for dealer tracking.',
      timestamp: 'Day 8, 11:00 AM',
      status: 'pending',
      operatorNotes: 'Consignment allocated to Flexispace Dedicated Logistics Van #KA-04-E-2194.',
    },
    {
      id: 'dealer_installation',
      title: 'Dealer Showroom Delivery & Assembly',
      facility: 'Customer Residence (Whitefield, Bengaluru)',
      description: 'Certified dealer technician executes on-site flatpack assembly.',
      timestamp: 'Day 10, 02:00 PM',
      status: 'pending',
      operatorNotes: 'Signed digital customer delivery & satisfaction receipt on dealer app.',
    },
    {
      id: 'completed',
      title: 'Order Completed & Commercial Settlement',
      facility: 'Finance & ERP Accounting',
      description: 'Final invoice generated, dealer margin released, and warranty certificate activated.',
      timestamp: 'Day 10, 06:00 PM',
      status: 'pending',
      operatorNotes: '5-year warranty registered in Flexispace customer database.',
    },
  ];

  const [stages, setStages] = useState<ERPStage[]>(initialStages);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(3); // Starts at in_progress index

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

  const activeStage = stages[currentStageIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFEFC] rounded-2xl border border-[#DDD8CF] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#DDD8CF] bg-[#F7F5F0] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#252522] text-[#A58A63] flex items-center justify-center">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  ERP Operations Preview
                </span>
                <span className="text-xs text-[#252522]/50">• Factory Order Lifecycle</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#252522] mt-0.5">
                Simulated Order-to-Manufacturing Execution
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={resetSimulation}
              className="p-2 rounded-lg border border-[#DDD8CF] hover:bg-white text-[#252522] transition"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#252522]/50 hover:text-[#252522] rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Explicit Concept Disclaimer */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">ERP Workflow Concept — Simulation Only:</strong> This interactive simulation demonstrates how customer configurations hand off to factory floor execution, dual-facility routing (Peenya Unit 01 & Dobbspet Unit 02), and dealer installation. No real production ERP (SAP / Odoo / ERPNext) is actively connected during this concept demonstration.
            </div>
          </div>

          {/* Active Work Order Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F5F0] p-4 rounded-xl border border-[#DDD8CF] text-xs">
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Live Demo Order ID</span>
              <span className="font-mono font-bold text-[#252522] block mt-0.5">ORD-BLR-2026-9042</span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Target Facility</span>
              <span className="font-bold text-[#252522] block mt-0.5">Unit 01 (Peenya, BLR)</span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Configured SKU</span>
              <span className="font-mono font-bold text-[#252522] block mt-0.5">{spec.configId}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#252522]/50 uppercase font-bold block">Current Lifecycle</span>
              <span className="font-semibold text-purple-800 block mt-0.5 capitalize">
                Stage {currentStageIndex + 1} of {stages.length}
              </span>
            </div>
          </div>

          {/* Interactive Stepper Advance Action */}
          <div className="p-4 bg-gradient-to-r from-[#252522] to-[#3D3A34] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider block">
                Active Manufacturing State
              </span>
              <h3 className="font-serif text-xl font-bold text-[#FFFEFC] mt-0.5">
                {activeStage.title}
              </h3>
              <p className="text-xs text-white/70 mt-1 max-w-md">
                {activeStage.description}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {currentStageIndex < stages.length - 1 ? (
                <button
                  onClick={advanceToNextStage}
                  className="px-5 py-2.5 rounded-xl bg-[#A58A63] hover:bg-[#BCA27B] text-[#252522] text-xs font-bold transition flex items-center space-x-2 shadow-sm"
                >
                  <span>Simulate Next Stage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-emerald-600/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center space-x-1.5">
                  <Check className="w-4 h-4" />
                  <span>Full Lifecycle Completed</span>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Timeline Visualizer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#252522]/70">
              Complete End-to-End Factory Progression
            </h4>
            <div className="space-y-2.5">
              {stages.map((stage, idx) => {
                const isCompleted = stage.status === 'completed';
                const isCurrent = stage.status === 'in_progress';
                return (
                  <div
                    key={stage.id}
                    className={`p-3.5 rounded-xl border transition flex items-start space-x-3.5 ${
                      isCurrent
                        ? 'border-purple-300 bg-purple-50/60 ring-1 ring-purple-400'
                        : isCompleted
                        ? 'border-[#DDD8CF] bg-white'
                        : 'border-[#DDD8CF]/60 bg-[#F7F5F0]/50 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-purple-600 text-white animate-pulse'
                          : 'bg-[#DDD8CF] text-[#252522]/60'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-xs font-bold text-[#252522]">{stage.title}</span>
                        <span className="text-[10px] text-[#252522]/50 font-mono">{stage.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#252522]/70 mt-0.5">{stage.facility}</p>
                      <div className="mt-2 text-[10px] bg-black/5 p-2 rounded-md font-mono text-[#252522]/80">
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
        <div className="p-4 border-t border-[#DDD8CF] bg-[#F7F5F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#252522] text-white hover:bg-[#A58A63] transition"
          >
            Close ERP Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
