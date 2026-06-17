import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const acidFormulation: FormulationData = {
  id: 5,
  name: "Acid",
  slug: "acid",
  category: "Industrial Cleaners",
  description: "General purpose acid cleaner for heavy-duty cleaning",
  baseYield: 10.0,
  TotalQuantity: undefined,
  ingredients: [
    { slNo: 1, particulars: "Acid", uom: "LTR", qty: 10.0 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: null,
  costPer1LBottle: 6.0,
  costPer5LBottle: 35.0,
  methodOfPreparation: [
    "Carefully add Acid to a acid-resistant vessel",
    "Add color for identification",
    "Mix gently",
    "Store in acid-resistant containers",
  ],
};
