import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const painReliefBalmFormulation: FormulationData = {
  id: 11,
  name: "Pain Relief Balm",
  slug: "pain-relief-balm",
  category: "Personal Care",
  description: "Herbal pain relief balm similar to Zandu Balm",
  baseYield: 0.25,
  TotalQuantity: undefined,
  ingredients: [
    { slNo: 1, particulars: "Balm Pack", uom: "KGS", qty: 0.25 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: 15.0,
  costPer1LBottle: null,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Melt petroleum jelly gently",
    "Add menthol and camphor",
    "Add essential oils",
    "Mix thoroughly while cooling",
    "Pour into containers before setting",
  ],
};
