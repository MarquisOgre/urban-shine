import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const detergentPowderFormulation: FormulationData = {
  id: 9,
  name: "Detergent Powder",
  slug: "detergent-powder",
  category: "Laundry Care",
  description: "High-efficiency detergent powder for all fabrics",
  baseYield: 6,
  TotalQuantity: undefined,
  ingredients: [
    { slNo: 1, particulars: "Soda Ash", uom: "KGS", qty: 4.0 },
    { slNo: 2, particulars: "Acid Slury", uom: "KGS", qty: 1.0 },
    { slNo: 3, particulars: "SS", uom: "KGS", qty: 1.0 },
    { slNo: 4, particulars: "Jasmine Perfume", uom: "KGS", qty: 0.025 },
    { slNo: 5, particulars: "TSP", uom: "KGS", qty: 0.5 },
    { slNo: 6, particulars: "Crystals", uom: "KGS", qty: 0.1 },
    { slNo: 7, particulars: "Tinopal", uom: "KGS", qty: 0.025 },
    { slNo: 8, particulars: "Robin Blue", uom: "KGS", qty: 0.01 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: 1.0,
  costPer1LBottle: 2.0,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Mix all dry ingredients thoroughly",
    "Add perfume and mix well",
    "Ensure uniform distribution",
    "Pack in moisture-proof containers",
  ],
};
