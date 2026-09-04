-- Storefront products
CREATE TABLE public.store_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  usage_instructions text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  uom text NOT NULL DEFAULT '1 Ltr',
  price numeric NOT NULL DEFAULT 0,
  mrp numeric,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  in_stock boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.store_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_products TO authenticated;
GRANT ALL ON public.store_products TO service_role;

ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store products are public" ON public.store_products FOR SELECT USING (true);
CREATE POLICY "Authenticated manage store products" ON public.store_products FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER store_products_updated_at BEFORE UPDATE ON public.store_products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Guest orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  shipping numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'UPI',
  transaction_id text,
  payment_screenshot_path text,
  status text NOT NULL DEFAULT 'Placed',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests can place orders" ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated can place orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins read orders" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated USING (true);

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();