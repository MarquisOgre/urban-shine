import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const phenylFormulation: FormulationData = {
  id: 1,
  name: "Phenyl",
  slug: "phenyl",
  category: "Household Cleaners",
  description: "Multi-surface phenyl cleaning formulation with excellent disinfecting properties",
  baseYield: 10.0,
  TotalQuantity: undefined,
  ingredients: [
    { slNo: 1, particulars: "Phenyl Concentrate", uom: "KGS", qty: 1.0 },
    { slNo: 2, particulars: "Perfume", uom: "LTR", qty: 0.03 },
    { slNo: 3, particulars: "Color", uom: "LTR", qty: 0.03 },
    { slNo: 4, particulars: "Alphox 200", uom: "LTR", qty: 0.03 },
    { slNo: 5, particulars: "RO Water", uom: "LTR", qty: 10 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: null,
  costPer1LBottle: 6.0,
  costPer5LBottle: 35.0,
  methodOfPreparation: [
    "Take clean water in mixing tank",
    "Add phenyl concentrate slowly while stirring",
    "Add color for product appeal",
    "Add perfume for pleasant fragrance",
    "Mix thoroughly for uniform consistency",
    "Check pH level (should be around 9-10)",
    "Filter if necessary",
    "Fill in bottles",
  ],
};
