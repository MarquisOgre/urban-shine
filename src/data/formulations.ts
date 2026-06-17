import { FormulationData, PricingData, PackingData } from "./types";
import { formulationsData } from "./formulationsList";
import { productPricesData, packingMaterialsData, chemicalPrices } from "./pricingData";

// Map formulation "particulars" names to chemicalPrices "chemical" names
// when they don't match exactly. Lookup is case-insensitive and trimmed.
const chemicalAliasMap: Record<string, string> = {
  "color": "Colour",
  "colour": "Colour",
  "acid slury": "Acid Slurry",
  "soda ash": "Soda Ash (Sodium Carbonate)",
  "ss": "SS (Sodium Sulphate) - Global Salt",
  "sodium sulphate": "SS (Sodium Sulphate) - Global Salt",
  "tsp": "TSP (Trisodium Phosphate)",
  "sles": "SLES (Sodium Lauryl Ether Sulfate)",
  "aos": "AOS (Alpha Olefin Sulphonate)",
  "bkc": "BKC (Benzalkonium Chloride)",
  "aplhox": "Alphox 200",
};

const resolveChemicalRate = (particulars: string): number | null => {
  const key = particulars.trim().toLowerCase();
  const target = (chemicalAliasMap[key] || particulars).trim().toLowerCase();
  const match = chemicalPrices.find(
    (c) => c.chemical.trim().toLowerCase() === target
  );
  return match ? match.rate : null;
};

const applyDynamicRates = (formulation: FormulationData): FormulationData => {
  const ingredients = formulation.ingredients.map((ing) => {
    const dynamicRate = resolveChemicalRate(ing.particulars);
    if (dynamicRate === null && typeof console !== "undefined") {
      console.warn(
        `[formulations] No chemicalPrices entry for "${ing.particulars}". Add it (or an alias) in pricingData.ts.`
      );
    }
    const rate = dynamicRate !== null ? dynamicRate : (ing.rate ?? 0);
    return { ...ing, rate, amount: ing.qty * rate };
  });
  return { ...formulation, ingredients };
};

export const getFormulationById = (id: number): FormulationData | undefined => {
  const f = formulationsData.find((formulation) => formulation.id === id);
  return f ? applyDynamicRates(f) : undefined;
};

export const getFormulationBySlug = (slug: string): FormulationData | undefined => {
  const f = formulationsData.find((formulation) => formulation.slug === slug);
  return f ? applyDynamicRates(f) : undefined;
};

export const getProductPrices = (): PricingData[] => {
  return productPricesData;
};

export const getPackingMaterials = (): PackingData[] => {
  return packingMaterialsData;
};

// Re-export types and data for backward compatibility
export type { FormulationData, PricingData, PackingData, Ingredient } from "./types";
export { formulationsData, productPricesData, packingMaterialsData };
