import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { AnimatePresence } from 'framer-motion';
import PhaseEditor from './PhaseEditor';
import { JobPhase } from '../../types';

export default function PhaseList() {
  const { estimate } = useCalculatorStore();
  const phases = estimate.phases;

  if (phases.length === 0) return null;

  return (
    <div className="space-y-6 mt-8">
      <div>
        <h3 className="text-lg font-bold">2. Detalji posla ({phases.length})</h3>
        <p className="text-sm text-muted-foreground">Konfigurirajte odabrane usluge.</p>
      </div>

      <AnimatePresence>
        {phases.map((phase, index) => (
          <PhaseEditor key={phase.id} phase={phase} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}
