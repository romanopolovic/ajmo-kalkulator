import React from "react";
import ServiceSelector from "../components/calculator/ServiceSelector";
import PhaseList from "../components/calculator/PhaseList";
import LocationAndDetails from "../components/calculator/LocationAndDetails";
import LiveSummary from "../components/calculator/LiveSummary";
import { Button } from "../components/ui/button";
import { RotateCcw } from "lucide-react";
import { useCalculatorStore } from "../store/useCalculatorStore";

export default function CalculatorPage() {
  const reset = useCalculatorStore((state) => state.reset);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Controls */}
      <div className="flex justify-between items-center bg-[#1c1c1e]/60 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-sm">
        <div className="pl-2">
          <h2 className="text-lg font-semibold text-white tracking-wide">
            Novi posao
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Odaberi usluge za izračun
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="text-gray-400 hover:text-white bg-white/5 rounded-full px-4 h-10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <ServiceSelector />
      <PhaseList />
      <LocationAndDetails />

      {/* Summary fits inline at the bottom */}
      <div className="mt-2">
        <LiveSummary />
      </div>
    </div>
  );
}
