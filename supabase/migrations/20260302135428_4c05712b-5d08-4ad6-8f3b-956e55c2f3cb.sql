
-- Customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  gst_no TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage customers"
ON public.customers FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_gst_no TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending',
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage invoices"
ON public.invoices FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Product prices table
CREATE TABLE public.product_prices (
  id SERIAL PRIMARY KEY,
  product TEXT NOT NULL,
  uom TEXT,
  retail_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  bulk_price_5ltr NUMERIC(10,2),
  bulk_price_100gms NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;

-- Anyone can read product prices
CREATE POLICY "Anyone can read product prices"
ON public.product_prices FOR SELECT TO anon, authenticated
USING (true);

-- Only authenticated can modify
CREATE POLICY "Authenticated users can modify product prices"
ON public.product_prices FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Seed product prices from existing data
INSERT INTO public.product_prices (id, product, uom, retail_price, bulk_price_5ltr, bulk_price_100gms) VALUES
(5, 'Acid', '1 Ltr', 50, 200, NULL),
(3, 'Brass Cleaning Liquid', '500 ML', 100, 100, NULL),
(7, 'Detergent Powder', '1 Kg', 150, 750, NULL),
(2, 'Dish Wash Liquid', '500 ML', 80, 800, NULL),
(9, 'Floor Cleaning Liquid', '1 Ltr', 100, 500, NULL),
(6, 'Hand Wash Liquid', '500 ML', 100, 1000, NULL),
(8, 'Liquid Detergent', '1 Ltr', 100, 500, NULL),
(1, 'Phenyl', '1 Ltr', 60, 300, NULL),
(10, 'Rose Water', '1 Ltr', 60, 300, NULL),
(4, 'Toilet Cleaner', '1 Ltr', 100, 500, NULL),
(12, 'Vaseline', '25 Gms', 25, NULL, 100),
(11, 'Zandu Balm', '25 Gms', 80, NULL, 320);

-- Chemical prices table
CREATE TABLE public.chemical_prices (
  id SERIAL PRIMARY KEY,
  chemical TEXT NOT NULL,
  rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  uom TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chemical_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chemical prices"
ON public.chemical_prices FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can modify chemical prices"
ON public.chemical_prices FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Seed chemical prices
INSERT INTO public.chemical_prices (id, chemical, rate, uom) VALUES
(1, 'Acid Slurry', 180, 'KG'),
(2, 'Acid Thickener', 400, 'KG'),
(3, 'Alphox 200', 240, 'LTR'),
(4, 'AOS (Alpha Olefin Sulphonate)', 250, 'KG'),
(5, 'Balm Pack', 880, 'NOS'),
(6, 'BKC (Benzalkonium Chloride)', 150, 'LTR'),
(7, 'Caustic Soda', 80, 'KG'),
(8, 'Citric Acid', 150, 'KG'),
(9, 'Colour', 400, 'LTR'),
(10, 'Crystals', 80, 'KG'),
(11, 'Glycerin', 200, 'LTR'),
(12, 'Handwash Base - Pearl', 200, 'KG'),
(13, 'Acid', 20, 'LTR'),
(14, 'Jasmine Perfume', 1000, 'LTR'),
(15, 'Perfume', 1000, 'LTR'),
(16, 'Phenyl Concentrate', 180, 'LTR'),
(17, 'Robin Blue', 400, 'KG'),
(18, 'RO Water', 0.5, 'LTR'),
(19, 'Rose Extract', 1000, 'LTR'),
(20, 'Salt', 30, 'KG'),
(21, 'SLES (Sodium Lauryl Ether Sulfate)', 100, 'KG'),
(22, 'Slurry', 180, 'KG'),
(23, 'Soda Ash (Sodium Carbonate)', 60, 'KG'),
(24, 'Sodium Benzoate', 280, 'KG'),
(25, 'SS (Sodium Sulphate) - Global Salt', 35, 'KG'),
(26, 'Tinopal', 220, 'KG'),
(27, 'TSP (Trisodium Phosphate)', 30, 'KG'),
(28, 'White Petroleum Jelly Base', 320, 'KG');

-- Packing materials table
CREATE TABLE public.packing_materials (
  id SERIAL PRIMARY KEY,
  product TEXT NOT NULL,
  minimum_order INTEGER NOT NULL DEFAULT 0,
  retail_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.packing_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read packing materials"
ON public.packing_materials FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can modify packing materials"
ON public.packing_materials FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Seed packing materials
INSERT INTO public.packing_materials (id, product, minimum_order, retail_price) VALUES
(8, '5 Ltrs Transparent Bottle', 0, 21),
(9, '5 Ltrs HDPE Can', 0, 36),
(1, 'Acid Bottles - 1 Ltr', 105, 4.3),
(6, 'Colin Glass Cleaner Bottle - 500 ML', 0, 16),
(4, 'Dish Wash Bottles - 500 ML', 200, 9.5),
(7, 'Floor Cleaner Bottle - 500 ML & 1 Ltr', 0, 10),
(5, 'Hand Wash with Pump Bottle - 500 ML', 200, 14),
(2, 'Phenyl Bottles - 1 Ltr', 128, 6.3),
(3, 'Toilet Cleaner Bottles - 1 Ltr', 180, 18.5),
(10, 'Zandu Balm & Vaseline Bottle - 25 Gms', 12, 4.2);
