
export interface Ingredient {
  slNo: number;
  particulars: string;
  uom: string;
  qty: number;
  // rate & amount are resolved dynamically from chemical prices at read time.
  rate?: number;
  amount?: number;
}

export interface FormulationData {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  ingredients: Ingredient[];
  baseYield: number; // Base yield for the formulation
  TotalQuantity?: number | null; // Optional manual override for total quantity
  costPer500ML: number;
  costPer1L: number;
  costPer5L: number;
  costPer500MLBottle: number | null;
  costPer1LBottle: number | null;
  costPer5LBottle: number | null;
  methodOfPreparation: string[];
}

export interface PricingData {
  id: string;
  product: string;
  uom?: string | null;
  minimumOrder?: number | null;
  retailPrice: number;
  bulkPrice5Ltr?: number | null;
  bulkPrice100Gms?: number | null;
}

export interface PackingData {
  id: string;
  product: string;
  minimumOrder: number;
  retailPrice: number;
}

export interface ChemicalData {
  id: string;
  chemical: string;
  rate: number;
  uom: string;
}
