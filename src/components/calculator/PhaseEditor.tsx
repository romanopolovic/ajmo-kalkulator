import React from 'react';
import { useCalculatorStore, calculateTotals } from '../../store/useCalculatorStore';
import { SERVICES } from '../../data/services';
import { JobPhase } from '../../types';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Trash2, Settings2, Calculator, Clock, Users } from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface PhaseEditorProps {
  phase: JobPhase;
  index: number;
}

const PhaseEditor: React.FC<PhaseEditorProps> = ({ phase, index }) => {
  const { updatePhase, removePhase, toggleSubService, estimate } = useCalculatorStore();
  const service = SERVICES[phase.serviceId];
  const totals = calculateTotals(estimate);
  const calcPhase = totals.calculatedPhases.find(cp => cp.phaseId === phase.id);

  if (!service) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="p-5 border-border bg-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="font-bold text-xl">{service.name}</h4>
            <span className="text-xs text-yellow-500 font-semibold uppercase tracking-wider">Faza {index + 1} • {service.pricingModel === 'TIERED' ? 'Količinski obračun' : 'Obračun po satu'}</span>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removePhase(phase.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Quantity & Workers */}
          <div className="space-y-4">
            {service.unit && (
              <div>
                <Label className="mb-2 block flex items-center gap-2"><Calculator className="w-4 h-4"/> Količina ({service.unit})</Label>
                <Input 
                  type="number" 
                  min="1" 
                  step="0.5"
                  value={phase.quantity || ''}
                  onChange={(e) => updatePhase(phase.id, { quantity: parseFloat(e.target.value) || 0 })}
                  className="h-12 text-lg font-bold"
                />
              </div>
            )}
            <div>
              <Label className="mb-2 block flex items-center gap-2"><Users className="w-4 h-4"/> Broj radnika</Label>
              <select 
                className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 font-bold focus-visible:ring-2 focus-visible:ring-yellow-500"
                value={phase.workers}
                onChange={(e) => updatePhase(phase.id, { workers: parseInt(e.target.value) })}
              >
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n} className="bg-dark text-white">{n} {n === 1 ? 'radnik' : 'radnika'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sub Services */}
          {service.subServices && service.subServices.length > 0 && (
            <div>
              <Label className="mb-2 block flex items-center gap-2"><Settings2 className="w-4 h-4"/> Dodatne usluge</Label>
              <div className="space-y-2 border border-border p-4 rounded-lg bg-black/50">
                {service.subServices.map(sub => (
                  <label key={sub.id} className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 bg-transparent"
                        checked={!!phase.selectedSubServices[sub.id]}
                        onChange={() => toggleSubService(phase.id, sub.id)}
                      />
                      <span className="text-sm font-medium">{sub.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {sub.type === 'FIXED' ? formatCurrency(sub.price) : `+${formatCurrency(sub.price)}/${sub.type === 'PER_HOUR' ? 'h' : 'jed.'}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Breakdown & Overrides */}
        <div className="border-t border-border pt-4 mt-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
            <div className="flex-1 space-y-2 w-full">
              {calcPhase?.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-300">{item.name}</span>
                    {item.detail && <span className="text-muted-foreground text-xs ml-2">({item.detail})</span>}
                  </div>
                  <span className="font-mono">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
            
            <div className="text-right border-l border-border pl-6 min-w-[150px]">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Cijena faze</span>
              <span className="text-2xl font-bold text-yellow-500">{formatCurrency(calcPhase?.totalPhasePrice || 0)}</span>
              <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" /> Procjena: {calcPhase?.estimatedHours}h
              </div>
            </div>
          </div>

          {/* Overrides Toggle */}
          <div className="pt-4 border-t border-border/50 flex gap-4">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-white transition-colors">
              <input 
                type="checkbox" 
                checked={phase.isManualHours} 
                onChange={(e) => updatePhase(phase.id, { isManualHours: e.target.checked, manualHoursOverride: calcPhase?.estimatedHours })}
                className="rounded bg-transparent border-gray-600 text-yellow-500"
              />
              Ručna korekcija sati
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-white transition-colors">
              <input 
                type="checkbox" 
                checked={phase.isManualPrice} 
                onChange={(e) => updatePhase(phase.id, { isManualPrice: e.target.checked, manualPriceOverride: calcPhase?.totalPhasePrice })}
                className="rounded bg-transparent border-gray-600 text-yellow-500"
              />
              Ručna korekcija cijene
            </label>
          </div>
          
          {(phase.isManualHours || phase.isManualPrice) && (
            <div className="flex gap-4 mt-3 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
              {phase.isManualHours && (
                <div className="flex-1">
                  <Label className="text-xs text-yellow-500 mb-1 block">Fiksni sati</Label>
                  <Input 
                    type="number" step="0.5" className="h-8 bg-black"
                    value={phase.manualHoursOverride ?? ''} 
                    onChange={e => updatePhase(phase.id, { manualHoursOverride: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              )}
              {phase.isManualPrice && (
                <div className="flex-1">
                  <Label className="text-xs text-yellow-500 mb-1 block">Fiksna cijena (€)</Label>
                  <Input 
                    type="number" className="h-8 bg-black"
                    value={phase.manualPriceOverride ?? ''} 
                    onChange={e => updatePhase(phase.id, { manualPriceOverride: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              )}
            </div>
          )}
        </div>

      </Card>
    </motion.div>
  );
};

export default PhaseEditor;
