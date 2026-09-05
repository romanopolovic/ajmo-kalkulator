import React from "react";
import {
  useCalculatorStore,
  calculateTotals,
} from "../../store/useCalculatorStore";
import { SERVICES } from "../../data/services";
import { JobPhase } from "../../types";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Trash2, Settings2, Calculator, Clock, Users } from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface PhaseEditorProps {
  phase: JobPhase;
  index: number;
}

const PhaseEditor: React.FC<PhaseEditorProps> = ({ phase, index }) => {
  const { updatePhase, removePhase, toggleSubService, estimate } =
    useCalculatorStore();
  const service = SERVICES[phase.serviceId];
  const totals = calculateTotals(estimate);
  const calcPhase = totals.calculatedPhases.find(
    (cp) => cp.phaseId === phase.id,
  );

  if (!service) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="p-5 border-white/5 bg-[#1c1c1e] rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600" />

        <div className="flex justify-between items-start mb-6">
          <div className="pt-1">
            <h4 className="font-semibold text-[19px] leading-tight text-white">
              {service.name}
            </h4>
            <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider block mt-1">
              Faza {index + 1} •{" "}
              {service.pricingModel === "TIERED" ? "Količinski" : "Po satu"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl w-10 h-10"
            onClick={() => removePhase(phase.id)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Quantity & Workers */}
          <div className="space-y-4">
            {service.unit && (
              <div>
                <Label className="mb-1 block flex items-center gap-1.5 text-gray-400 text-[13px]">
                  <Calculator className="w-4 h-4" /> Količina ({service.unit})
                </Label>
                <Input
                  type="number"
                  min="1"
                  step="0.5"
                  value={phase.quantity || ""}
                  onChange={(e) =>
                    updatePhase(phase.id, {
                      quantity: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-black/50 border-white/10 h-12 rounded-xl text-white text-lg font-semibold"
                />
              </div>
            )}
            <div>
              <Label className="mb-1 block flex items-center gap-1.5 text-gray-400 text-[13px]">
                <Users className="w-4 h-4" /> Broj radnika
              </Label>
              <select
                className="flex h-12 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 font-semibold text-white focus-visible:ring-2 focus-visible:ring-yellow-500"
                value={phase.workers}
                onChange={(e) =>
                  updatePhase(phase.id, { workers: parseInt(e.target.value) })
                }
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n} className="bg-[#1c1c1e] text-white">
                    {n} {n === 1 ? "radnik" : "radnika"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sub Services */}
          {service.subServices && service.subServices.length > 0 && (
            <div>
              <Label className="mb-1 block flex items-center gap-1.5 text-gray-400 text-[13px]">
                <Settings2 className="w-4 h-4" /> Dodatne usluge
              </Label>
              <div className="space-y-2 border border-white/5 p-3 rounded-2xl bg-black/50">
                {service.subServices.map((sub) => (
                  <label
                    key={sub.id}
                    className="flex items-center justify-between p-2 rounded-xl active:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md flex items-center justify-center border transition-all",
                          phase.selectedSubServices[sub.id]
                            ? "bg-yellow-500 border-yellow-500"
                            : "bg-transparent border-white/20",
                        )}
                      >
                        {phase.selectedSubServices[sub.id] && (
                          <div className="w-2.5 h-2.5 bg-black rounded-sm" />
                        )}
                      </div>
                      <span className="text-[13px] font-medium text-white">
                        {sub.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium bg-white/5 px-2 py-1 rounded-md">
                      {sub.type === "FIXED"
                        ? formatCurrency(sub.price)
                        : `+${formatCurrency(sub.price)}/${sub.type === "PER_HOUR" ? "h" : "jed."}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Breakdown & Overrides */}
        <div className="border-t border-white/5 pt-5 mt-2">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex-1 space-y-1.5 w-full bg-black/30 p-4 rounded-2xl border border-white/5">
              {calcPhase?.breakdown.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-[13px]"
                >
                  <div className="truncate pr-2">
                    <span className="text-gray-300">{item.name}</span>
                    {item.detail && (
                      <span className="text-gray-500 text-[11px] ml-1.5">
                        ({item.detail})
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-white whitespace-nowrap">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-end pl-2">
              <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5" /> Procjena:{" "}
                {calcPhase?.estimatedHours}h
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-0.5">
                  Cijena faze
                </span>
                <span className="text-2xl font-bold text-yellow-500">
                  {formatCurrency(calcPhase?.totalPhasePrice || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Overrides Toggle */}
          <div className="pt-5 border-t border-white/5 flex gap-5">
            <label className="flex items-center gap-2.5 text-[13px] text-gray-400 cursor-pointer active:text-white transition-colors">
              <div
                className={cn(
                  "w-4 h-4 rounded-md flex items-center justify-center border transition-all",
                  phase.isManualHours
                    ? "bg-yellow-500 border-yellow-500"
                    : "bg-transparent border-white/20",
                )}
              >
                {phase.isManualHours && (
                  <div className="w-2 h-2 bg-black rounded-sm" />
                )}
              </div>
              Ručna korekcija sati
              {/* hidden input for state sync */}
              <input
                type="checkbox"
                checked={phase.isManualHours}
                onChange={(e) =>
                  updatePhase(phase.id, {
                    isManualHours: e.target.checked,
                    manualHoursOverride: calcPhase?.estimatedHours,
                  })
                }
                className="hidden"
              />
            </label>
            <label className="flex items-center gap-2.5 text-[13px] text-gray-400 cursor-pointer active:text-white transition-colors">
              <div
                className={cn(
                  "w-4 h-4 rounded-md flex items-center justify-center border transition-all",
                  phase.isManualPrice
                    ? "bg-yellow-500 border-yellow-500"
                    : "bg-transparent border-white/20",
                )}
              >
                {phase.isManualPrice && (
                  <div className="w-2 h-2 bg-black rounded-sm" />
                )}
              </div>
              Ručna korekcija cijene
              {/* hidden input for state sync */}
              <input
                type="checkbox"
                checked={phase.isManualPrice}
                onChange={(e) =>
                  updatePhase(phase.id, {
                    isManualPrice: e.target.checked,
                    manualPriceOverride: calcPhase?.totalPhasePrice,
                  })
                }
                className="hidden"
              />
            </label>
          </div>

          {(phase.isManualHours || phase.isManualPrice) && (
            <div className="flex gap-4 mt-4 bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/20">
              {phase.isManualHours && (
                <div className="flex-1">
                  <Label className="text-[11px] text-yellow-500 font-semibold mb-1.5 block">
                    Fiksni sati
                  </Label>
                  <Input
                    type="number"
                    step="0.5"
                    className="h-10 bg-black/50 border-white/10 text-white rounded-xl"
                    value={phase.manualHoursOverride ?? ""}
                    onChange={(e) =>
                      updatePhase(phase.id, {
                        manualHoursOverride: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              )}
              {phase.isManualPrice && (
                <div className="flex-1">
                  <Label className="text-[11px] text-yellow-500 font-semibold mb-1.5 block">
                    Fiksna cijena (€)
                  </Label>
                  <Input
                    type="number"
                    className="h-10 bg-black/50 border-white/10 text-white rounded-xl"
                    value={phase.manualPriceOverride ?? ""}
                    onChange={(e) =>
                      updatePhase(phase.id, {
                        manualPriceOverride: parseFloat(e.target.value) || 0,
                      })
                    }
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
