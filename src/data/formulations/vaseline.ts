import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const whitePetroleumJellyFormulation: FormulationData = {
  id: 12,
  name: "White Petroleum Jelly",
  slug: "white-petroleum-jelly",
  category: "Personal Care",
  description: "Pure white petroleum jelly similar to Vaseline",
  baseYield: 0.25,
  TotalQuantity: undefined,
  ingredients: [
    { slNo: 1, particulars: "White Petroleum Jelly Base", uom: "KGS", qty: 0.25 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: 15.0,
  costPer1LBottle: null,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Melt petroleum jelly base gently",
    "Add vitamin E for nourishment",
    "Add antioxidant for preservation",
    "Mix thoroughly",
    "Pour into sterile containers",
  ],
};
