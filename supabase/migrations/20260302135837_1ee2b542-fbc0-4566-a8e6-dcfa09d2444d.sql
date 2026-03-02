
DROP POLICY IF EXISTS "Anyone can read product prices" ON public.product_prices;
DROP POLICY IF EXISTS "Authenticated users can modify product prices" ON public.product_prices;
DROP TABLE IF EXISTS public.product_prices;

DROP POLICY IF EXISTS "Anyone can read chemical prices" ON public.chemical_prices;
DROP POLICY IF EXISTS "Authenticated users can modify chemical prices" ON public.chemical_prices;
DROP TABLE IF EXISTS public.chemical_prices;

DROP POLICY IF EXISTS "Anyone can read packing materials" ON public.packing_materials;
DROP POLICY IF EXISTS "Authenticated users can modify packing materials" ON public.packing_materials;
DROP TABLE IF EXISTS public.packing_materials;
