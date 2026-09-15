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
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
            Detalji Usluga
            <span className="bg-yellow-500 text-black text-[12px] px-2.5 py-0.5 rounded-full font-bold">
              {phases.length}
            </span>
          </h3>
          <p className="text-[14px] text-gray-400 mt-1 font-medium">
            Konfigurirajte količinu, radnike i dodatke za svaku uslugu
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {phases.map((phase, index) => (
            <PhaseEditor key={phase.id} phase={phase} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
