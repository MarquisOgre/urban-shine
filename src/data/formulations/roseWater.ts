import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const roseWaterFormulation: FormulationData = {
  id: 10,
  name: "Rose Water",
  slug: "rose-water",
  category: "Personal Care",
  description: "Pure rose water for skincare and aromatherapy",
  baseYield: 5.0,
  TotalQuantity: undefined,
  ingredients: [
    { slNo: 1, particulars: "Rose Extract", uom: "LTR", qty: 0.025 },
    { slNo: 2, particulars: "RO Water", uom: "LTR", qty: 5.0 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: null,
  costPer1LBottle: 6.0,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Take distilled water",
    "Add rose extract",
    "Add preservative",
    "Mix gently",
    "Filter and bottle",
  ],
};
