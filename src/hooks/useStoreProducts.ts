import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  features: string[];
  usageInstructions: string;
  category: string;
  uom: string;
  price: number;
  mrp: number | null;
  inStock: boolean;
}

const mapRow = (r: any): StoreProduct => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  tagline: r.tagline,
  description: r.description,
  features: Array.isArray(r.features) ? (r.features as string[]) : [],
  usageInstructions: r.usage_instructions,
  category: r.category,
  uom: r.uom,
  price: Number(r.price),
  mrp: r.mrp === null ? null : Number(r.mrp),
  inStock: r.in_stock,
});

export const useStoreProducts = () =>
  useQuery({
    queryKey: ["store_products"],
    queryFn: async (): Promise<StoreProduct[]> => {
      const { data, error } = await supabase
        .from("store_products")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
  });

export const useStoreProduct = (slug?: string) => {
  const { data, isLoading } = useStoreProducts();
  return { product: data?.find((p) => p.slug === slug), isLoading, all: data };
};
