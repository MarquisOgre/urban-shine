CREATE TABLE public.formulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'General',
  description text NOT NULL DEFAULT '',
  base_yield numeric NOT NULL DEFAULT 10,
  total_quantity numeric,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  cost_per_500ml_bottle numeric,
  cost_per_1l_bottle numeric,
  cost_per_5l_bottle numeric,
  method_of_preparation jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.formulations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.formulations TO authenticated;
GRANT ALL ON public.formulations TO service_role;
ALTER TABLE public.formulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Formulations are public" ON public.formulations FOR SELECT USING (true);
CREATE POLICY "Authenticated manage formulations" ON public.formulations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER formulations_updated_at BEFORE UPDATE ON public.formulations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.product_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product text NOT NULL,
  uom text,
  minimum_order numeric,
  retail_price numeric NOT NULL DEFAULT 0,
  bulk_price_5ltr numeric,
  bulk_price_100gms numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_prices TO authenticated;
GRANT ALL ON public.product_prices TO service_role;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product prices are public" ON public.product_prices FOR SELECT USING (true);
CREATE POLICY "Authenticated manage product prices" ON public.product_prices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER product_prices_updated_at BEFORE UPDATE ON public.product_prices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.packing_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product text NOT NULL,
  minimum_order numeric NOT NULL DEFAULT 0,
  retail_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.packing_materials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packing_materials TO authenticated;
GRANT ALL ON public.packing_materials TO service_role;
ALTER TABLE public.packing_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Packing materials are public" ON public.packing_materials FOR SELECT USING (true);
CREATE POLICY "Authenticated manage packing materials" ON public.packing_materials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER packing_materials_updated_at BEFORE UPDATE ON public.packing_materials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.chemical_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chemical text NOT NULL,
  rate numeric NOT NULL DEFAULT 0,
  uom text NOT NULL DEFAULT 'KG',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.chemical_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chemical_prices TO authenticated;
GRANT ALL ON public.chemical_prices TO service_role;
ALTER TABLE public.chemical_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chemical prices are public" ON public.chemical_prices FOR SELECT USING (true);
CREATE POLICY "Authenticated manage chemical prices" ON public.chemical_prices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER chemical_prices_updated_at BEFORE UPDATE ON public.chemical_prices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();