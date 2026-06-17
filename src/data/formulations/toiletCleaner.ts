import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const toiletCleanerFormulation: FormulationData = {
  id: 4,
  name: "Toilet Cleaner",
  slug: "toilet-cleaner",
  category: "Bathroom Cleaners",
  description: "Powerful toilet cleaning formulation with acid-based formula",
  baseYield: 10,
  TotalQuantity: undefined,
  ingredients: [
    { slNo: 1, particulars: "Acid Thickener", uom: "KGS", qty: 0.25 },
    { slNo: 2, particulars: "Acid", uom: "LTR", qty: 2.0 },
    { slNo: 3, particulars: "Color", uom: "LTR", qty: 0.001 },
    { slNo: 4, particulars: "RO Water", uom: "LTR", qty: 8.0 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: null,
  costPer1LBottle: 19.0,
  costPer5LBottle: 35.0,
  methodOfPreparation: [
    "Start RO water in a suitable mixing container.",
    "Add color to the water and stir thoroughly to ensure uniform dispersion.",
    "Gradually add Acid Thickener to the colored water while stirring continuously. Mix until the solution achieves a consistent viscosity.",
    "Carefully add Acid to the mixture. Stir slowly and continuously to blend the acid evenly into the solution.",
    "If desired, add perfume at this stage to enhance the fragrance of the final product.",
    "Mix the entire solution thoroughly to ensure all ingredients are well combined.",
    "Transfer the finished toilet cleaner into acid-resistant containers and store in a cool, dry place.",
  ],
};
