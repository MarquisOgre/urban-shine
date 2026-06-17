import { FormulationData } from "../types";

// Rates are resolved dynamically from chemicalPrices (see pricingData.ts).
export const handWashFormulation: FormulationData = {
  id: 6,
  name: "Hand Wash Liquid",
  slug: "hand-wash-liquid",
  category: "Personal Care",
  description: "Gentle hand washing liquid with moisturizing properties",
  baseYield: 10.0,
  TotalQuantity: undefined,
  ingredients: [
    { slNo: 1, particulars: "Handwash Base - Pearl", uom: "LTR", qty: 1.0 },
    { slNo: 2, particulars: "SLES", uom: "KGS", qty: 1.0 },
    { slNo: 3, particulars: "Sodium Sulphate", uom: "KGS", qty: 1.0 },
    { slNo: 4, particulars: "Perfume", uom: "LTR", qty: 0.03 },
    { slNo: 5, particulars: "Glycerin", uom: "KGS", qty: 0.1 },
    { slNo: 6, particulars: "Color", uom: "LTR", qty: 0.03 },
    { slNo: 7, particulars: "RO Water", uom: "LTR", qty: 10.0 },
  ],
  costPer500ML: 0,
  costPer1L: 0,
  costPer5L: 0,
  costPer500MLBottle: 14.0,
  costPer1LBottle: 6.0,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Heat water to 40°C",
    "Add SLES slowly while mixing",
    "Add salt to achieve viscosity",
    "Add glycerin for moisturizing",
    "Add color and perfume",
    "Mix thoroughly",
  ],
};
