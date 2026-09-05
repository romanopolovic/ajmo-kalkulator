export type PricingModel = "TIERED" | "PER_HOUR" | "FIXED" | "CUSTOM";

export interface Tier {
  min: number;
  max: number;
  price: number;
}

export type SubServiceType = "PER_HOUR" | "PER_UNIT" | "FIXED";

export interface SubServiceDef {
  id: string;
  name: string;
  type: SubServiceType;
  price: number;
  timePerUnit: number;
}

export interface ServiceDef {
  id: string;
  name: string;
  description: string;
  pricingModel: PricingModel;
  unit?: string; // e.g., 'm³', 'm²', 'sati', 'kg'
  tiers?: Tier[];
  basePricePerHour?: number;
  fixedPrice?: number;
  timePerUnit?: number; // Base time per unit for 1 worker
  minHours?: number;
  subServices?: SubServiceDef[];
}

export interface PhaseBreakdownItem {
  name: string;
  amount: number;
  detail?: string;
}

export interface JobPhase {
  id: string;
  serviceId: string;
  description: string;
  workers: number;
  quantity: number;
  selectedSubServices: Record<string, boolean>;

  // Overrides
  isManualHours: boolean;
  manualHoursOverride?: number;
  isManualPrice: boolean;
  manualPriceOverride?: number;
}

export interface AdditionalExpense {
  id: string;
  name: string;
  amount: number;
}

export interface JobLocation {
  address: string;
  lat?: number;
  lng?: number;
  accuracy?: number;
  distanceKm: number;
  travelCostPerKm: number;
}

export interface JobEstimate {
  id: string;
  phases: JobPhase[];
  location: JobLocation;
  date: string | null;
  startTime: string | null;
  additionalExpenses: AdditionalExpense[];
  discountValue: number;
  discountType: "percentage" | "fixed";
  priority: "standard" | "urgent" | "same_day" | "weekend";
  clientName: string;
  clientPhone: string;
  clientNotes: string;
  status:
    | "draft"
    | "pending"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled";
  createdAt: string;
}

export interface CalculatedPhase {
  phaseId: string;
  serviceName: string;
  estimatedHours: number;
  totalPhasePrice: number;
  breakdown: PhaseBreakdownItem[];
}
