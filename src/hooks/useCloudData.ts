import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  ChemicalData,
  FormulationData,
  Ingredient,
  PackingData,
  PricingData,
} from "@/data/types";

/* ------------------------------ chemicals ------------------------------ */

export const useChemicalPrices = () =>
  useQuery({
    queryKey: ["chemical_prices"],
    queryFn: async (): Promise<ChemicalData[]> => {
      const { data, error } = await supabase
        .from("chemical_prices")
        .select("*")
        .order("chemical");
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        chemical: r.chemical,
        rate: Number(r.rate),
        uom: r.uom,
      }));
    },
  });

/* --------------------------- packing materials -------------------------- */

export const usePackingMaterials = () =>
  useQuery({
    queryKey: ["packing_materials"],
    queryFn: async (): Promise<PackingData[]> => {
      const { data, error } = await supabase
        .from("packing_materials")
        .select("*")
        .order("product");
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        product: r.product,
        minimumOrder: Number(r.minimum_order),
        retailPrice: Number(r.retail_price),
      }));
    },
  });

/* ---------------------------- product prices ---------------------------- */

export const useProductPrices = () =>
  useQuery({
    queryKey: ["product_prices"],
    queryFn: async (): Promise<PricingData[]> => {
      const { data, error } = await supabase
        .from("product_prices")
        .select("*")
        .order("product");
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        product: r.product,
        uom: r.uom,
        minimumOrder: r.minimum_order === null ? null : Number(r.minimum_order),
        retailPrice: Number(r.retail_price),
        bulkPrice5Ltr: r.bulk_price_5ltr === null ? null : Number(r.bulk_price_5ltr),
        bulkPrice100Gms:
          r.bulk_price_100gms === null ? null : Number(r.bulk_price_100gms),
      }));
    },
  });

/* ------------------------------ formulations ---------------------------- */

// Map formulation "particulars" names to chemical names when they don't match
// exactly. Lookup is case-insensitive and trimmed.
const chemicalAliasMap: Record<string, string> = {
  color: "Color",
  "acid slurry": "Acid Slurry",
  "soda ash": "Soda Ash (Sodium Carbonate)",
  "sodium sulphate": "Sodium Sulphate",
  tsp: "TSP (Trisodium Phosphate)",
  sles: "SLES (Sodium Lauryl Ether Sulfate)",
  aos: "AOS (Alpha Olefin Sulphonate)",
  bkc: "BKC (Benzalkonium Chloride)",
  "alphox 200": "Alphox 200",
};

export const resolveChemicalRate = (
  particulars: string,
  chemicals: ChemicalData[]
): number => {
  const key = particulars.trim().toLowerCase();
  const target = (chemicalAliasMap[key] || particulars).trim().toLowerCase();
  const match = chemicals.find((c) => c.chemical.trim().toLowerCase() === target);
  return match ? match.rate : 0;
};

const mapFormulation = (row: any, chemicals: ChemicalData[]): FormulationData => {
  const ingredients: Ingredient[] = (row.ingredients ?? []).map((ing: any) => {
    const rate = resolveChemicalRate(ing.particulars, chemicals);
    const qty = Number(ing.qty);
    return {
      slNo: Number(ing.slNo),
      particulars: ing.particulars,
      uom: ing.uom,
      qty,
      rate,
      amount: qty * rate,
    };
  });

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    description: row.description,
    baseYield: Number(row.base_yield),
    TotalQuantity: row.total_quantity === null ? null : Number(row.total_quantity),
    ingredients,
    costPer500ML: 0,
    costPer1L: 0,
    costPer5L: 0,
    costPer500MLBottle:
      row.cost_per_500ml_bottle === null ? null : Number(row.cost_per_500ml_bottle),
    costPer1LBottle:
      row.cost_per_1l_bottle === null ? null : Number(row.cost_per_1l_bottle),
    costPer5LBottle:
      row.cost_per_5l_bottle === null ? null : Number(row.cost_per_5l_bottle),
    methodOfPreparation: row.method_of_preparation ?? [],
  };
};

export const useFormulations = () => {
  const chemicalsQuery = useChemicalPrices();
  const chemicals = chemicalsQuery.data;

  const query = useQuery({
    queryKey: ["formulations", chemicals?.map((c) => `${c.chemical}:${c.rate}`).join("|")],
    enabled: !!chemicals,
    queryFn: async (): Promise<FormulationData[]> => {
      const { data, error } = await supabase
        .from("formulations")
        .select("*")
        .order("name");
      if (error) throw error;
      return (data ?? []).map((row) => mapFormulation(row, chemicals ?? []));
    },
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading || chemicalsQuery.isLoading,
  };
};

export const useFormulationBySlug = (slug: string) => {
  const { data, isLoading } = useFormulations();
  return {
    formulation: data?.find((f) => f.slug === slug),
    isLoading,
  };
};

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* -------------------------- generic mutations --------------------------- */

type TableName =
  | "chemical_prices"
  | "packing_materials"
  | "product_prices"
  | "formulations";

export const useUpsertRow = (table: TableName) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: any) => {
      const { error } = row.id
        ? await supabase.from(table).update(row).eq("id", row.id)
        : await supabase.from(table).insert(row);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      qc.invalidateQueries({ queryKey: ["formulations"] });
    },
  });
};

export const useDeleteRow = (table: TableName) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      qc.invalidateQueries({ queryKey: ["formulations"] });
    },
  });
};
