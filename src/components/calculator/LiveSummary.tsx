import React, { useState } from "react";
import {
  useCalculatorStore,
  calculateTotals,
} from "../../store/useCalculatorStore";
import { useClientStore } from "../../store/useClientStore";
import { Card } from "../ui/card";
import { formatCurrency } from "../../lib/utils";
import {
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  FileText,
  MessageCircle,
  Save,
  Download,
} from "lucide-react";
import JobSummaryModal from "./JobSummaryModal";
import ClientMessageModal from "./ClientMessageModal";
import { Button } from "../ui/button";

export default function LiveSummary() {
  const estimate = useCalculatorStore((state) => state.estimate);
  const saveCurrentEstimate = useCalculatorStore(
    (state) => state.saveCurrentEstimate,
  );
  const totals = calculateTotals(estimate);
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);

  const isConfigured = totals.phasesTotal > 0;

  return (
    <>
      <div className="bg-[#1c1c1e]/40 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col h-full transition-all">
        <div
          className="p-6 flex justify-between items-center cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div>
            <h3 className="font-semibold text-gray-400 tracking-wide text-xs uppercase flex items-center gap-2 mb-1">
              Ukupna Cijena
              {isConfigured && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
            </h3>
            <div className="text-4xl font-black text-white tracking-tighter">
              {formatCurrency(totals.total)}
            </div>
          </div>
          <div className="text-right flex items-center gap-3">
            <div className="text-gray-400 bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors">
              {expanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        <div
          className={`px-6 pb-6 flex-1 overflow-y-auto ${expanded ? "block" : "hidden"} transition-all`}
        >
          <div className="space-y-4 pt-4 border-t border-white/5">
            {totals.calculatedPhases.map((phase, i) => (
              <div
                key={phase.phaseId}
                className="border-b border-white/5 pb-3 last:border-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-[15px] text-white tracking-tight">
                    {i + 1}. {phase.serviceName}
                  </span>
                  <span className="font-bold text-[15px] text-yellow-500">
                    {formatCurrency(phase.totalPhasePrice)}
                  </span>
                </div>
                <div className="ml-3 space-y-1">
                  {phase.breakdown.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-[13px] text-gray-400 font-medium"
                    >
                      <span>{b.name}</span>
                      <span>{formatCurrency(b.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            <div className="flex justify-between text-[13px] text-gray-400 font-medium">
              <span>Putni trošak ({estimate.location.distanceKm || 0}km)</span>
              <span>{formatCurrency(totals.travelTotal)}</span>
            </div>
            {totals.expensesTotal > 0 && (
              <div className="flex justify-between text-[13px] text-gray-400 font-medium">
                <span>Dodatni troškovi</span>
                <span>{formatCurrency(totals.expensesTotal)}</span>
              </div>
            )}
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-[13px] text-green-400 font-bold">
                <span>Popust</span>
                <span>-{formatCurrency(totals.discountAmount)}</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
            <div className="flex justify-between items-center text-gray-400 font-medium text-[14px]">
              <span>Radnika u smjeni:</span>
              <span className="font-bold text-white text-[15px]">
                {totals.maxWorkers}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-400 font-medium text-[14px]">
              <span>Procjena sati:</span>
              <span className="font-bold text-white text-[15px]">
                ~{totals.totalHours} h
              </span>
            </div>

            {totals.maxWorkers > 0 && (
              <div className="mt-6 flex justify-between items-center bg-green-500/10 p-5 rounded-2xl border border-green-500/20">
                <span className="font-bold text-green-500 tracking-wide text-xs uppercase">
                  ZARADA PO RADNIKU
                </span>
                <span className="font-black text-green-500 text-2xl tracking-tight">
                  {formatCurrency(totals.total / totals.maxWorkers)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-black/20 border-t border-white/5 mt-auto">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button
              className="w-full bg-[#1c1c1e] hover:bg-white/10 text-white font-bold rounded-[18px] h-14 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all active:scale-95"
              disabled={!isConfigured}
              onClick={() => setClientModalOpen(true)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Poruka
            </Button>
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black tracking-wide rounded-[18px] h-14 shadow-[0_4px_24px_rgba(234,179,8,0.4)] transition-all active:scale-95"
              disabled={!isConfigured}
              onClick={() => setModalOpen(true)}
            >
              <FileText className="w-5 h-5 mr-2" />
              Ekipa
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-white font-semibold h-12 rounded-[16px] bg-white/5 hover:bg-white/10 transition-colors"
              disabled={!isConfigured}
              onClick={() => {
                import("../../lib/pdf").then(({ generateEstimatePDF }) => {
                  generateEstimatePDF(estimate);
                });
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              PDF Ponuda
            </Button>
            <Button
              variant="ghost"
              className="w-full text-gray-400 hover:text-white font-semibold h-12 rounded-[16px] bg-white/5 hover:bg-white/10 transition-colors"
              disabled={!isConfigured}
              onClick={() => {
                if (estimate.clientName) {
                  useClientStore.getState().upsertClient({
                    name: estimate.clientName,
                    phone: estimate.clientPhone || "",
                    address: estimate.location.address || "",
                    notes: estimate.clientNotes || "",
                  });
                }
                saveCurrentEstimate();
                alert("Posao je uspješno spremljen u vaše lokalne poslove.");
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Spremi
            </Button>
          </div>
        </div>
      </div>

      <JobSummaryModal open={modalOpen} onOpenChange={setModalOpen} />
      <ClientMessageModal
        open={clientModalOpen}
        onOpenChange={setClientModalOpen}
      />
    </>
  );
}
