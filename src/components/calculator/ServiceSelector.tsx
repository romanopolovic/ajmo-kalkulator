import React, { useState } from "react";
import { SERVICES } from "../../data/services";
import { useCalculatorStore } from "../../store/useCalculatorStore";
import { Card } from "../ui/card";
import { Check, Plus, PackageOpen, Home, HardHat, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { cn, formatCurrency } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  {
    id: "nosenje",
    name: "Premještanje i Nošenje",
    icon: PackageOpen,
    services: ["nosenje", "utovar", "selidba"],
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  {
    id: "okucnica",
    name: "Kuća i Okućnica",
    icon: Home,
    services: ["drva", "dvoriste", "ciscenje"],
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20"
  },
  {
    id: "tesko",
    name: "Teški i Građevinski Radovi",
    icon: HardHat,
    services: ["rasciscavanje", "gradevina"],
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20"
  },
  {
    id: "razno",
    name: "Razno",
    icon: MoreHorizontal,
    services: ["poljoprivreda", "stariji", "ostalo"],
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20"
  }
];

export default function ServiceSelector() {
  const addPhase = useCalculatorStore((state) => state.addPhase);
  const removePhase = useCalculatorStore((state) => state.removePhase);
  const phases = useCalculatorStore((state) => state.estimate.phases);
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>("nosenje");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Odaberite Usluge
          </h3>
          <p className="text-[14px] text-gray-400 mt-1 font-medium">
            Pronađite usluge po kategorijama i dodajte u izračun
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {CATEGORIES.map((category) => {
          const isExpanded = expandedCategory === category.id;
          const selectedCountInCategory = category.services.filter(sId => phases.some(p => p.serviceId === sId)).length;
          const Icon = category.icon;

          return (
            <Card 
              key={category.id} 
              className={cn(
                "border transition-all duration-300 rounded-[24px] overflow-hidden backdrop-blur-2xl",
                isExpanded ? "bg-[#1c1c1e]/60 border-white/20" : "bg-[#1c1c1e]/40 border-white/5 hover:border-white/10 hover:bg-[#1c1c1e]/50"
              )}
            >
              <div 
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-[16px] flex items-center justify-center", category.bg)}>
                    <Icon className={cn("w-6 h-6", category.color)} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px] text-white tracking-tight">
                      {category.name}
                    </h4>
                    <p className="text-[13px] text-gray-400 font-medium mt-0.5">
                      {category.services.length} {category.services.length === 1 ? "usluga" : "usluga"} dostupno
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {selectedCountInCategory > 0 && (
                    <span className="bg-yellow-500 text-black text-[12px] font-bold px-2.5 py-1 rounded-full">
                      {selectedCountInCategory} odabrano
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-white/5 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {category.services.map((serviceId) => {
                          const service = SERVICES[serviceId];
                          const isSelected = phases.some((p) => p.serviceId === service.id);

                          return (
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              key={service.id}
                              onClick={() => {
                                if (isSelected) {
                                  // Find the phase and remove it
                                  const phaseToRemove = phases.find((p) => p.serviceId === service.id);
                                  if (phaseToRemove) removePhase(phaseToRemove.id);
                                } else {
                                  addPhase(service.id);
                                }
                              }}
                              className={cn(
                                "cursor-pointer p-4 rounded-[20px] transition-all duration-300 border flex flex-col h-full",
                                isSelected
                                  ? "border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_24px_rgba(234,179,8,0.15)]"
                                  : "border-white/5 bg-black/20 hover:bg-black/40"
                              )}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <span className={cn(
                                  "font-bold text-[15px] leading-tight transition-colors",
                                  isSelected ? "text-yellow-500" : "text-white"
                                )}>
                                  {service.name}
                                </span>
                                <div className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                                  isSelected ? "bg-yellow-500 text-black" : "bg-white/10 text-gray-400"
                                )}>
                                  {isSelected ? (
                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                  ) : (
                                    <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                                  )}
                                </div>
                              </div>
                              <div className="mt-auto pt-2">
                                <span className="text-[13px] text-gray-400 block leading-snug font-medium line-clamp-2">
                                  {service.description}
                                </span>
                                <span className="text-[12px] font-bold text-white mt-3 block bg-white/5 w-fit px-2.5 py-1 rounded-lg">
                                  {service.pricingModel === "TIERED" && service.tiers
                                    ? `od ${formatCurrency(service.tiers[service.tiers.length - 1].price)}/${service.unit}`
                                    : ""}
                                  {service.pricingModel === "PER_HOUR" && service.basePricePerHour
                                    ? `${formatCurrency(service.basePricePerHour)}/h`
                                    : ""}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
