import React from "react";
import { SERVICES } from "../../data/services";
import { useCalculatorStore } from "../../store/useCalculatorStore";
import { Card } from "../ui/card";
import { Check, Plus } from "lucide-react";
import { cn, formatCurrency } from "../../lib/utils";
import { motion } from "framer-motion";

export default function ServiceSelector() {
  const addPhase = useCalculatorStore((state) => state.addPhase);
  const phases = useCalculatorStore((state) => state.estimate.phases);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[17px] font-semibold tracking-wide">
          1. Odaberi vrstu posla
        </h3>
        <p className="text-[13px] text-gray-400 mt-1">
          Dodirnite uslugu za dodavanje u izračun
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.values(SERVICES).map((service) => {
          const isSelected = phases.some((p) => p.serviceId === service.id);

          return (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              key={service.id}
            >
              <Card
                className={cn(
                  "cursor-pointer h-full transition-all border-white/5 bg-[#1c1c1e] rounded-2xl",
                  isSelected
                    ? "border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                    : "hover:bg-[#2c2c2e]",
                )}
                onClick={() => addPhase(service.id)}
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-[13px] leading-tight text-white">
                      {service.name}
                    </span>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-yellow-500 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                  </div>
                  <div className="mt-auto pt-2">
                    <span className="text-[11px] text-gray-400 block leading-tight">
                      {service.description}
                    </span>
                    <span className="text-[11px] font-semibold text-yellow-500 mt-2 block">
                      {service.pricingModel === "TIERED" && service.tiers
                        ? `od ${formatCurrency(service.tiers[service.tiers.length - 1].price)}/${service.unit}`
                        : ""}
                      {service.pricingModel === "PER_HOUR" &&
                      service.basePricePerHour
                        ? `${formatCurrency(service.basePricePerHour)}/h`
                        : ""}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
