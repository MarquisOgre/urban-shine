import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const floorCleaningFormulation: FormulationData = {
  id: 8,
  name: "Floor Cleaning Liquid",
  slug: "floor-cleaning-liquid",
  category: "Household Cleaners",
  description: "All-purpose floor cleaner with pleasant fragrance",
  baseYield: 10,
  TotalQuantity: undefined,
  ingredients: [
    { slNo: 1, particulars: "SLES", uom: "KGS", qty: 1 },
    { slNo: 2, particulars: "BKC", uom: "LTR", qty: 0.5 },
    { slNo: 3, particulars: "Perfume", uom: "LTR", qty: 0.05 },
    { slNo: 4, particulars: "Color", uom: "LTR", qty: 0.05 },
    { slNo: 5, particulars: "RO Water", uom: "LTR", qty: 8.5 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: null,
  costPer1LBottle: 16.0,
  costPer5LBottle: 35.0,
  methodOfPreparation: [
    "Mix water and BKC",
    "Add SLES for cleaning action",
    "Add color for appeal",
    "Add perfume for fragrance",
    "Mix thoroughly",
  ],
};
