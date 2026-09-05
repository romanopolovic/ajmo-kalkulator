import { ServiceDef } from '../types';

export const SERVICES: Record<string, ServiceDef> = {
  nosenje: {
    id: 'nosenje',
    name: 'Nošenje i Fizička Pomoć',
    description: 'Premještanje namještaja, materijala, kutija',
    pricingModel: 'PER_HOUR',
    unit: 'sati',
    basePricePerHour: 10,
    timePerUnit: 1,
    minHours: 2,
    subServices: []
  },
  utovar: {
    id: 'utovar',
    name: 'Utovar i Istovar',
    description: 'Utovar/istovar klijentovog kombija ili kamiona',
    pricingModel: 'PER_HOUR',
    unit: 'sati',
    basePricePerHour: 10,
    timePerUnit: 1, // 1 hour per 'unit' of time
    minHours: 2,
    subServices: [
      { id: 'katovi', name: 'Nošenje po katovima', type: 'PER_HOUR', price: 1.5, timePerUnit: 0.2 },
      { id: 'tesko', name: 'Posebno teški predmeti', type: 'PER_HOUR', price: 2, timePerUnit: 0.5 },
      { id: 'montaza', name: 'Demontaža / Montaža', type: 'PER_HOUR', price: 3, timePerUnit: 0.5 }
    ]
  },
  selidba: {
    id: 'selidba',
    name: 'Pomoć pri selidbi',
    description: 'Pomoć oko nošenja i pakiranja. BEZ PRIJEVOZA.',
    pricingModel: 'PER_HOUR',
    unit: 'sati',
    basePricePerHour: 12,
    timePerUnit: 1,
    minHours: 2,
    subServices: [
      { id: 'pakiranje', name: 'Pakiranje i raspremanje', type: 'PER_HOUR', price: 2, timePerUnit: 0 }
    ]
  },
  drva: {
    id: 'drva',
    name: 'Drva',
    description: 'Nošenje, slaganje, cijepanje',
    pricingModel: 'TIERED',
    unit: 'm³',
    minHours: 0,
    tiers: [
      { min: 0, max: 2, price: 10 },
      { min: 3, max: 5, price: 8 },
      { min: 6, max: 10, price: 7 },
      { min: 11, max: 9999, price: 6 }
    ],
    timePerUnit: 0.1, // Base time to handle 1m3 without subservices
    subServices: [
      { id: 'nosenje', name: 'Nošenje', type: 'PER_HOUR', price: 2, timePerUnit: 0.6 },
      { id: 'slaganje', name: 'Slaganje', type: 'PER_HOUR', price: 1.5, timePerUnit: 0.4 },
      { id: 'cijepanje', name: 'Cijepanje', type: 'PER_HOUR', price: 3, timePerUnit: 0.8 },
      { id: 'utovar_drva', name: 'Utovar (Vaše vozilo)', type: 'PER_HOUR', price: 2, timePerUnit: 0.3 }
    ]
  },
  dvoriste: {
    id: 'dvoriste',
    name: 'Dvorište i Okućnica',
    description: 'Košnja, grabljanje, korov, lišće',
    pricingModel: 'PER_HOUR',
    unit: 'sati',
    basePricePerHour: 10,
    minHours: 2,
    subServices: []
  },
  ciscenje: {
    id: 'ciscenje',
    name: 'Čišćenje',
    description: 'Kuće, dvorišta, garaže, podrumi',
    pricingModel: 'TIERED',
    unit: 'm²',
    minHours: 2,
    tiers: [
      { min: 0, max: 50, price: 1.5 },
      { min: 51, max: 100, price: 1.0 },
      { min: 101, max: 200, price: 0.8 },
      { min: 201, max: 99999, price: 0.6 }
    ],
    timePerUnit: 0.05, // 0.05h per m2 (~3 mins)
    subServices: [
      { id: 'jako', name: 'Jako zaprljano (x2)', type: 'PER_HOUR', price: 1.5, timePerUnit: 0.05 }
    ]
  },
  rasciscavanje: {
    id: 'rasciscavanje',
    name: 'Raščišćavanje',
    description: 'Priprema za odvoz, tavani, podrumi',
    pricingModel: 'PER_HOUR',
    unit: 'sati',
    basePricePerHour: 12,
    minHours: 4,
    subServices: [
      { id: 'suta', name: 'Nošenje šute', type: 'PER_HOUR', price: 2, timePerUnit: 0.2 },
      { id: 'opasno', name: 'Opasni materijali', type: 'PER_HOUR', price: 3, timePerUnit: 0 }
    ]
  },
  gradevina: {
    id: 'gradevina',
    name: 'Pomoćni građevinski radovi',
    description: 'Pomoć majstorima, nošenje i miješanje materijala',
    pricingModel: 'PER_HOUR',
    unit: 'sati',
    basePricePerHour: 12,
    minHours: 4,
    subServices: []
  },
  poljoprivreda: {
    id: 'poljoprivreda',
    name: 'Poljoprivredni i Sezonski poslovi',
    description: 'Branje voća/povrća, sadnja, kopanje',
    pricingModel: 'PER_HOUR',
    unit: 'sati',
    basePricePerHour: 7,
    minHours: 4,
    subServices: [
      { id: 'tesko_dostupno', name: 'Težak teren', type: 'PER_HOUR', price: 2, timePerUnit: 0 }
    ]
  },
  stariji: {
    id: 'stariji',
    name: 'Pomoć starijim osobama',
    description: 'Pomoć oko nošenja, drva, dvorišta',
    pricingModel: 'PER_HOUR',
    unit: 'sati',
    basePricePerHour: 8,
    minHours: 2,
    subServices: []
  },
  ostalo: {
    id: 'ostalo',
    name: 'Nešto Drugo?',
    description: 'Fizički posao po dogovoru',
    pricingModel: 'PER_HOUR',
    unit: 'sati',
    basePricePerHour: 8,
    minHours: 2,
    subServices: []
  }
};
