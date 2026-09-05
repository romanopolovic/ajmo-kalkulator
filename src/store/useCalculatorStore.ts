import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  JobEstimate,
  JobPhase,
  AdditionalExpense,
  CalculatedPhase,
} from "../types";
import { SERVICES } from "../data/services";

interface CalculatorState {
  estimate: JobEstimate;
  savedEstimates: JobEstimate[];

  // Actions
  addPhase: (serviceId: string) => void;
  updatePhase: (phaseId: string, updates: Partial<JobPhase>) => void;
  removePhase: (phaseId: string) => void;
  toggleSubService: (phaseId: string, subServiceId: string) => void;

  updateEstimate: (updates: Partial<JobEstimate>) => void;
  updateLocation: (updates: Partial<JobEstimate["location"]>) => void;

  addExpense: (expense: AdditionalExpense) => void;
  removeExpense: (expenseId: string) => void;

  reset: () => void;
  saveCurrentEstimate: () => void;
  loadEstimate: (id: string) => void;
  deleteSavedEstimate: (id: string) => void;
}

const generateId = () =>
  `RS-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.floor(
    Math.random() * 1000,
  )
    .toString()
    .padStart(3, "0")}`;

const initialEstimate: JobEstimate = {
  id: generateId(),
  phases: [],
  location: { address: "", distanceKm: 0, travelCostPerKm: 0.5 },
  date: null,
  startTime: null,
  additionalExpenses: [],
  discountValue: 0,
  discountType: "percentage",
  priority: "standard",
  clientName: "",
  clientPhone: "",
  clientNotes: "",
  status: "draft",
  createdAt: new Date().toISOString(),
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      estimate: { ...initialEstimate, id: generateId() },
      savedEstimates: [],

      addPhase: (serviceId) =>
        set((state) => ({
          estimate: {
            ...state.estimate,
            phases: [
              ...state.estimate.phases,
              {
                id: Math.random().toString(36).substring(2, 9),
                serviceId,
                description: "",
                workers: 2,
                quantity: 1,
                selectedSubServices: {},
                isManualHours: false,
                isManualPrice: false,
              },
            ],
          },
        })),

      updatePhase: (phaseId, updates) =>
        set((state) => ({
          estimate: {
            ...state.estimate,
            phases: state.estimate.phases.map((p) =>
              p.id === phaseId ? { ...p, ...updates } : p,
            ),
          },
        })),

      removePhase: (phaseId) =>
        set((state) => ({
          estimate: {
            ...state.estimate,
            phases: state.estimate.phases.filter((p) => p.id !== phaseId),
          },
        })),

      toggleSubService: (phaseId, subServiceId) =>
        set((state) => ({
          estimate: {
            ...state.estimate,
            phases: state.estimate.phases.map((p) => {
              if (p.id === phaseId) {
                return {
                  ...p,
                  selectedSubServices: {
                    ...p.selectedSubServices,
                    [subServiceId]: !p.selectedSubServices[subServiceId],
                  },
                };
              }
              return p;
            }),
          },
        })),

      updateEstimate: (updates) =>
        set((state) => ({
          estimate: { ...state.estimate, ...updates },
        })),

      updateLocation: (updates) =>
        set((state) => ({
          estimate: {
            ...state.estimate,
            location: { ...state.estimate.location, ...updates },
          },
        })),

      addExpense: (expense) =>
        set((state) => ({
          estimate: {
            ...state.estimate,
            additionalExpenses: [...state.estimate.additionalExpenses, expense],
          },
        })),

      removeExpense: (expenseId) =>
        set((state) => ({
          estimate: {
            ...state.estimate,
            additionalExpenses: state.estimate.additionalExpenses.filter(
              (e) => e.id !== expenseId,
            ),
          },
        })),

      reset: () => set({ estimate: { ...initialEstimate, id: generateId() } }),

      saveCurrentEstimate: () =>
        set((state) => {
          const existingIndex = state.savedEstimates.findIndex(
            (e) => e.id === state.estimate.id,
          );
          const updatedEstimates = [...state.savedEstimates];
          const jobToSave = { ...state.estimate, status: "confirmed" as const };

          if (existingIndex >= 0) {
            updatedEstimates[existingIndex] = jobToSave;
          } else {
            updatedEstimates.push(jobToSave);
          }

          return {
            savedEstimates: updatedEstimates,
            estimate: { ...initialEstimate, id: generateId() },
          };
        }),

      loadEstimate: (id) =>
        set((state) => {
          const found = state.savedEstimates.find((e) => e.id === id);
          return found ? { estimate: { ...found } } : state;
        }),

      deleteSavedEstimate: (id) =>
        set((state) => ({
          savedEstimates: state.savedEstimates.filter((e) => e.id !== id),
        })),
    }),
    {
      name: "radna-snaga-v2-storage",
    },
  ),
);

// Advanced Calculation Engine
export const calculateTotals = (estimate: JobEstimate) => {
  let phasesTotal = 0;
  let totalHours = 0;
  let maxWorkers = 0;
  const calculatedPhases: CalculatedPhase[] = [];

  estimate.phases.forEach((phase) => {
    const service = SERVICES[phase.serviceId];
    if (!service) return;

    if (phase.workers > maxWorkers) maxWorkers = phase.workers;

    let phasePrice = 0;
    let computedHours = 0;
    const breakdown = [];

    // 1. Calculate Base Time
    let baseTime = phase.quantity * (service.timePerUnit || 0);

    // 2. Add SubServices Time
    let subTime = 0;
    const activeSubs =
      service.subServices?.filter((s) => phase.selectedSubServices[s.id]) || [];
    activeSubs.forEach((sub) => {
      subTime += phase.quantity * (sub.timePerUnit || 0);
    });

    computedHours = (baseTime + subTime) / phase.workers;

    // Apply min hours rule
    if (service.minHours && computedHours < service.minHours) {
      computedHours = service.minHours;
    }

    // Round to nearest 0.5
    computedHours = Math.ceil(computedHours * 2) / 2;

    const finalHours =
      phase.isManualHours && phase.manualHoursOverride !== undefined
        ? phase.manualHoursOverride
        : computedHours;

    totalHours += finalHours;

    // 3. Calculate Base Price
    let basePrice = 0;
    if (service.pricingModel === "TIERED" && service.tiers) {
      const tier =
        service.tiers.find(
          (t) => phase.quantity >= t.min && phase.quantity <= t.max,
        ) || service.tiers[service.tiers.length - 1];
      basePrice = tier.price * phase.quantity * phase.workers;
      breakdown.push({
        name: `Osnovno (${phase.quantity} ${service.unit || ""} × ${phase.workers} rad.)`,
        amount: basePrice,
        detail: `${tier.price} € / ${service.unit || "jed."} po radniku`,
      });
    } else if (service.pricingModel === "PER_HOUR") {
      const totalBaseHours = phase.quantity * (service.timePerUnit || 1);
      basePrice =
        totalBaseHours * phase.workers * (service.basePricePerHour || 0);
      breakdown.push({
        name: `Osnova (× ${phase.workers} rad.)`,
        amount: basePrice,
        detail: `${service.basePricePerHour} €/h po radniku`,
      });
    } else if (service.pricingModel === "FIXED") {
      basePrice = (service.fixedPrice || 0) * phase.workers;
      breakdown.push({
        name: `Fiksna cijena (× ${phase.workers} rad.)`,
        amount: basePrice,
      });
    }

    phasePrice += basePrice;

    // 4. Calculate SubServices Price
    activeSubs.forEach((sub) => {
      let subPrice = 0;
      if (sub.type === "PER_HOUR") {
        const totalSubHours = phase.quantity * sub.timePerUnit;
        subPrice = totalSubHours * phase.workers * sub.price;
        breakdown.push({
          name: sub.name,
          amount: subPrice,
          detail: `+${sub.price} €/h po radniku`,
        });
      } else if (sub.type === "PER_UNIT") {
        subPrice = phase.quantity * sub.price * phase.workers;
        breakdown.push({
          name: sub.name,
          amount: subPrice,
          detail: `${sub.price} € / ${service.unit || "jed."} po radniku`,
        });
      } else if (sub.type === "FIXED") {
        subPrice = sub.price * phase.workers;
        breakdown.push({
          name: sub.name,
          amount: subPrice,
          detail: `Fiksno po radniku`,
        });
      }
      phasePrice += subPrice;
    });

    // 5. Manual Price Override
    const finalPhasePrice =
      phase.isManualPrice && phase.manualPriceOverride !== undefined
        ? phase.manualPriceOverride
        : phasePrice;

    if (phase.isManualPrice && phase.manualPriceOverride !== undefined) {
      breakdown.push({
        name: "Ručna korekcija",
        amount: finalPhasePrice - phasePrice,
        detail: "Administrator override",
      });
    }

    phasesTotal += finalPhasePrice;

    calculatedPhases.push({
      phaseId: phase.id,
      serviceName: service.name,
      estimatedHours: finalHours,
      totalPhasePrice: finalPhasePrice,
      breakdown,
    });
  });

  const travelTotal =
    (estimate.location.distanceKm || 0) *
    (estimate.location.travelCostPerKm || 0);
  const expensesTotal = estimate.additionalExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );

  let subtotal = phasesTotal + travelTotal + expensesTotal;

  if (estimate.priority === "urgent" || estimate.priority === "same_day")
    subtotal *= 1.2;
  if (estimate.priority === "weekend") subtotal *= 1.15;

  let total = subtotal;
  let discountAmount = 0;

  if (estimate.discountValue > 0) {
    if (estimate.discountType === "percentage") {
      discountAmount = subtotal * (estimate.discountValue / 100);
    } else {
      discountAmount = estimate.discountValue;
    }
    total = Math.max(0, subtotal - discountAmount);
  }

  return {
    phasesTotal,
    travelTotal,
    expensesTotal,
    subtotal,
    discountAmount,
    total,
    totalHours,
    maxWorkers,
    calculatedPhases,
  };
};
