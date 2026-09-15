import React, { useState, useEffect } from "react";
import ServiceSelector from "../components/calculator/ServiceSelector";
import PhaseList from "../components/calculator/PhaseList";
import LocationAndDetails from "../components/calculator/LocationAndDetails";
import LiveSummary from "../components/calculator/LiveSummary";
import { Button } from "../components/ui/button";
import { RotateCcw, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useCalculatorStore } from "../store/useCalculatorStore";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function CalculatorPage() {
  const reset = useCalculatorStore((state) => state.reset);
  const phases = useCalculatorStore((state) => state.estimate.phases);
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // If we reset, go back to step 1
  useEffect(() => {
    if (phases.length === 0 && currentStep > 1) {
      setCurrentStep(1);
    }
  }, [phases.length, currentStep]);

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canGoNext = () => {
    if (currentStep === 1) return phases.length > 0;
    return true;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full items-start">
      <div className="flex-1 w-full flex flex-col gap-6">
        {/* Top Controls & Stepper */}
        <div className="bg-[#1c1c1e]/40 backdrop-blur-3xl p-5 md:p-6 rounded-[32px] border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Novi posao
              </h2>
              <p className="text-[14px] text-gray-400 mt-1 font-medium">
                Ispunite korake za izračun
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                reset();
                setCurrentStep(1);
              }}
              className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full px-5 h-12 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((step) => {
              const isActive = step === currentStep;
              const isPast = step < currentStep;
              return (
                <div key={step} className="flex-1 flex flex-col gap-2">
                  <div 
                    className={cn(
                      "h-1.5 w-full rounded-full transition-all duration-500",
                      isActive ? "bg-yellow-500" : isPast ? "bg-yellow-500/50" : "bg-white/10"
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-[12px] font-bold tracking-wider uppercase transition-colors duration-300",
                      isActive ? "text-yellow-500" : isPast ? "text-gray-300" : "text-gray-600"
                    )}>
                      {step === 1 ? "1. Usluge" : step === 2 ? "2. Detalji" : "3. Lokacija"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ServiceSelector />
              </motion.div>
            )}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PhaseList />
              </motion.div>
            )}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LocationAndDetails />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-4 pt-6 border-t border-white/5">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={cn(
              "rounded-[16px] h-12 px-6 font-semibold transition-all",
              currentStep === 1 ? "opacity-0 pointer-events-none" : "bg-white/5 hover:bg-white/10 text-white"
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nazad
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canGoNext() || currentStep === totalSteps}
            className={cn(
              "rounded-[16px] h-12 px-8 font-bold transition-all shadow-[0_4px_20px_rgba(234,179,8,0.3)]",
              currentStep === totalSteps ? "opacity-0 pointer-events-none" : "bg-yellow-500 hover:bg-yellow-400 text-black"
            )}
          >
            Dalje
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Summary fits inline at the bottom on mobile, sticky on right on desktop */}
      <div className={cn(
        "w-full xl:w-[420px] xl:sticky xl:top-8 mt-2 xl:mt-0 shrink-0",
        currentStep === totalSteps ? "block" : "hidden xl:block"
      )}>
        <LiveSummary />
      </div>
    </div>
  );
}
