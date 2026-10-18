import React from 'react';
import type { ValidationIssue } from '../../types/configurator';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: ValidationIssue[];
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  issues,
}) => {
  if (!isOpen) return null;

  const errors = issues.filter((i) => i.type === 'error');
  const warnings = issues.filter((i) => i.type === 'warning');
  const infos = issues.filter((i) => i.type === 'info');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFEFC] rounded-2xl border border-[#DDD8CF] shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#DDD8CF] flex items-center justify-between bg-[#F7F5F0]">
          <div className="flex items-center space-x-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                errors.length > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {errors.length > 0 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#252522]">
                Manufacturing Feasibility Check
              </h3>
              <p className="text-xs text-[#252522]/60">
                Flexispace Automated DFM (Design for Manufacturing) Engine v2.4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#252522]/50 hover:text-[#252522] rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-serif text-lg font-medium text-[#252522]">
                Configuration 100% Validated
              </h4>
              <p className="text-sm text-[#252522]/70 mt-1 max-w-sm mx-auto">
                All selected materials, structural joints, dimensions, and hardware packages satisfy current factory production guidelines.
              </p>
            </div>
          ) : (
            <>
              {errors.map((issue) => (
                <div
                  key={issue.code}
                  className="p-4 rounded-xl border border-red-200 bg-red-50/70 space-y-2.5"
                >
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-red-900">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-red-800 mt-1 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                  {issue.suggestedAction && (
                    <div className="pt-2 border-t border-red-200 flex justify-end">
                      <button
                        onClick={() => {
                          issue.suggestedAction?.applyFix();
                          onClose();
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-900 text-white hover:bg-red-800 transition"
                      >
                        {issue.suggestedAction.label}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {warnings.map((issue) => (
                <div
                  key={issue.code}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 space-y-1.5"
                >
                  <div className="flex items-start space-x-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-900">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {infos.map((issue) => (
                <div
                  key={issue.code}
                  className="p-4 rounded-xl border border-[#DDD8CF] bg-[#F7F5F0]/60 space-y-1.5"
                >
                  <div className="flex items-start space-x-2.5">
                    <Info className="w-5 h-5 text-[#A58A63] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#252522]">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-[#252522]/70 mt-1 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Transparent Demonstration Disclaimer */}
          <div className="p-3 bg-[#ECE8E1] rounded-xl text-[11px] text-[#252522]/70 leading-relaxed border border-[#DDD8CF]">
            <span className="font-semibold text-[#252522]">Engineering Disclosure:</span> Demonstration validation rules are illustrative and model realistic factory jointing constraints. Final structural sign-off occurs during technical discovery prior to production CNC G-code compilation.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DDD8CF] bg-[#F7F5F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#252522] text-white hover:bg-[#A58A63] transition"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
