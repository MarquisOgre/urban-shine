import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const brassCleaningFormulation: FormulationData = {
  id: 3,
  name: "Copper Cleaning Liquid",
  slug: "copper-cleaning-liquid",
  category: "Metal Cleaners",
  description: "Effective formulation for cleaning copper surfaces, removes tarnish and restores shine.",
  baseYield: 10.0,
  TotalQuantity: 10,
  ingredients: [
    { slNo: 1, particulars: "SLES", uom: "KGS", qty: 3 },
    { slNo: 2, particulars: "Citric Acid", uom: "KGS", qty: 0.75 },
    { slNo: 3, particulars: "Salt", uom: "KGS", qty: 0.75 },
    { slNo: 4, particulars: "Colour", uom: "LTR", qty: 0.05 },
    { slNo: 5, particulars: "RO Water", uom: "LTR", qty: 7 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: 9.5,
  costPer1LBottle: null,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Add water to a clean mixing vessel",
    "Slowly Citric Acid to the water and mix well",
    "Add Salt and continue stirring until fully dissolved",
    "Add SLES to thicken the liquid",
    "Add Colour to the solution and stir well",
    "Add perfume as required for fragrance",
    "Mix the solution thoroughly until uniform consistency is achieved",
    "Let the liquid settle and filter if necessary",
    "Fill into 500 ml or 1 L bottles using clean equipment",
    "Store in a cool, dry place away from sunlight",
  ],
};
