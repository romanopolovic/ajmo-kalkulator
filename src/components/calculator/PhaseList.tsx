import React from "react";
import { useCalculatorStore } from "../../store/useCalculatorStore";
import { AnimatePresence } from "framer-motion";
import PhaseEditor from "./PhaseEditor";
import { JobPhase } from "../../types";

export default function PhaseList() {
  const { estimate } = useCalculatorStore();
  const phases = estimate.phases;

  if (phases.length === 0) return null;

  return (
    <div className="space-y-6 mt-8">
      <div>
        <h3 className="text-[17px] font-semibold tracking-wide flex items-center justify-between">
          <span>2. Detalji posla</span>
          <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
            {phases.length}
          </span>
        </h3>
        <p className="text-[13px] text-gray-400 mt-1">
          Konfigurirajte odabrane usluge.
        </p>
      </div>

      <AnimatePresence>
        {phases.map((phase, index) => (
          <PhaseEditor key={phase.id} phase={phase} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}
