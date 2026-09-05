import React, { useState } from 'react';
import { useCalculatorStore, calculateTotals } from '../../store/useCalculatorStore';
import { Card } from '../ui/card';
import { formatCurrency } from '../../lib/utils';
import { ChevronUp, ChevronDown, CheckCircle2, FileText, MessageCircle, Save } from 'lucide-react';
import JobSummaryModal from './JobSummaryModal';
import ClientMessageModal from './ClientMessageModal';
import { Button } from '../ui/button';

export default function LiveSummary() {
  const estimate = useCalculatorStore(state => state.estimate);
  const saveCurrentEstimate = useCalculatorStore(state => state.saveCurrentEstimate);
  const totals = calculateTotals(estimate);
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);

  const isConfigured = totals.phasesTotal > 0;

  return (
    <>
      <div className="bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col h-full transition-all">
        
        <div 
          className="p-5 flex justify-between items-center cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div>
            <h3 className="font-semibold text-white tracking-wide text-sm flex items-center gap-2">
              Ukupna Cijena
              {isConfigured && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </h3>
          </div>
          <div className="text-right flex items-center gap-3">
            <div>
              <div className="text-3xl font-bold text-white tracking-tight">
                {formatCurrency(totals.total)}
              </div>
            </div>
            <div className="text-muted-foreground bg-white/5 p-1.5 rounded-full">
              {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </div>
          </div>
        </div>

        <div className={`px-5 pb-5 flex-1 overflow-y-auto ${expanded ? 'block' : 'hidden'} transition-all`}>
          
          <div className="space-y-4 pt-4 border-t border-white/5">
            {totals.calculatedPhases.map((phase, i) => (
              <div key={phase.phaseId} className="border-b border-white/5 pb-3 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm text-white">{i + 1}. {phase.serviceName}</span>
                  <span className="font-semibold text-sm">{formatCurrency(phase.totalPhasePrice)}</span>
                </div>
                <div className="ml-3 space-y-0.5">
                  {phase.breakdown.map((b, idx) => (
                    <div key={idx} className="flex justify-between text-[13px] text-gray-400">
                      <span>{b.name}</span>
                      <span>{formatCurrency(b.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            <div className="flex justify-between text-[13px] text-gray-400">
              <span>Putni trošak ({estimate.location.distanceKm || 0}km)</span>
              <span>{formatCurrency(totals.travelTotal)}</span>
            </div>
            {totals.expensesTotal > 0 && (
              <div className="flex justify-between text-[13px] text-gray-400">
                <span>Dodatni troškovi</span>
                <span>{formatCurrency(totals.expensesTotal)}</span>
              </div>
            )}
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-[13px] text-green-400 font-medium">
                <span>Popust</span>
                <span>-{formatCurrency(totals.discountAmount)}</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-5 border-t border-white/5 space-y-3 text-sm">
            <div className="flex justify-between items-center text-gray-400">
              <span>Broj radnika u smjeni:</span>
              <span className="font-semibold text-white">{totals.maxWorkers}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Procjena radnih sati:</span>
              <span className="font-semibold text-white">~{totals.totalHours} h</span>
            </div>
            
            {totals.maxWorkers > 0 && (
              <div className="mt-4 flex justify-between items-center bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
                <span className="font-semibold text-green-400 tracking-wide text-xs">ZARADA PO RADNIKU</span>
                <span className="font-bold text-green-400 text-xl">{formatCurrency(totals.total / totals.maxWorkers)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 bg-black/20 border-t border-white/5 mt-auto">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button 
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl h-14 shadow-[0_4px_20px_rgba(22,163,74,0.3)] transition-transform active:scale-95"
              disabled={!isConfigured}
              onClick={() => setClientModalOpen(true)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Poruka
            </Button>
            <Button 
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl h-14 shadow-[0_4px_20px_rgba(234,179,8,0.3)] transition-transform active:scale-95"
              disabled={!isConfigured}
              onClick={() => setModalOpen(true)}
            >
              <FileText className="w-5 h-5 mr-2" />
              Ekipa
            </Button>
          </div>
          <Button 
            variant="ghost"
            className="w-full text-gray-400 hover:text-white font-medium h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            disabled={!isConfigured}
            onClick={() => {
              saveCurrentEstimate();
              alert('Posao je uspješno spremljen u vaše lokalne poslove.');
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            Spremi lokalno
          </Button>
        </div>
      </div>
      
      <JobSummaryModal open={modalOpen} onOpenChange={setModalOpen} />
      <ClientMessageModal open={clientModalOpen} onOpenChange={setClientModalOpen} />
    </>
  );
}
