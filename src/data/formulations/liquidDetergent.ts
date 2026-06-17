import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const liquidDetergentFormulation: FormulationData = {
  id: 7,
  name: "Liquid Detergent",
  slug: "liquid-detergent",
  category: "Laundry Care",
  description: "Concentrated liquid detergent for machine wash",
  baseYield: 10,
  TotalQuantity: undefined,
  ingredients: [
    { slNo: 1, particulars: "Slurry", uom: "KGS", qty: 1.25 },
    { slNo: 2, particulars: "Perfume", uom: "LTR", qty: 0.04 },
    { slNo: 3, particulars: "SLES", uom: "KGS", qty: 0.4 },
    { slNo: 4, particulars: "Colour", uom: "LTR", qty: 0.03 },
    { slNo: 5, particulars: "Aplhox", uom: "LTR", qty: 0.04 },
    { slNo: 6, particulars: "Citric Acid", uom: "LTR", qty: 0.05 },
    { slNo: 7, particulars: "RO Water", uom: "LTR", qty: 8.5 },
    { slNo: 8, particulars: "Caustic Soda", uom: "KGS", qty: 0.025 },
    { slNo: 9, particulars: "Tinopal", uom: "KGS", qty: 0.005 },
    { slNo: 10, particulars: "Sodium Benzoate", uom: "KGS", qty: 0.005 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: null,
  costPer1LBottle: 19,
  costPer5LBottle: 21,
  methodOfPreparation: [
    "Heat water to 60°C",
    "Add caustic soda carefully",
    "Add linear alkyl benzene slowly",
    "Mix until clear solution forms",
    "Add salt for viscosity",
    "Add color and perfume when cool",
  ],
};
