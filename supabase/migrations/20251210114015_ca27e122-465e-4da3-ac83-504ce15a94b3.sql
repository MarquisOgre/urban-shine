-- Enable RLS on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributor_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_materials_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indent_sheet_entries ENABLE ROW LEVEL SECURITY;

-- Create public access policies (since this appears to be a single-user app without auth)
CREATE POLICY "Allow public read on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on customers" ON public.customers FOR DELETE USING (true);

CREATE POLICY "Allow public read on invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert on invoices" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on invoices" ON public.invoices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on invoices" ON public.invoices FOR DELETE USING (true);

CREATE POLICY "Allow public read on payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on payments" ON public.payments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on payments" ON public.payments FOR DELETE USING (true);

CREATE POLICY "Allow public read on settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on settings" ON public.settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on settings" ON public.settings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on settings" ON public.settings FOR DELETE USING (true);

CREATE POLICY "Allow public read on warehouse_stock" ON public.warehouse_stock FOR SELECT USING (true);
CREATE POLICY "Allow public insert on warehouse_stock" ON public.warehouse_stock FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on warehouse_stock" ON public.warehouse_stock FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on warehouse_stock" ON public.warehouse_stock FOR DELETE USING (true);

CREATE POLICY "Allow public read on distributor_stock" ON public.distributor_stock FOR SELECT USING (true);
CREATE POLICY "Allow public insert on distributor_stock" ON public.distributor_stock FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on distributor_stock" ON public.distributor_stock FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on distributor_stock" ON public.distributor_stock FOR DELETE USING (true);

CREATE POLICY "Allow public read on raw_materials_stock" ON public.raw_materials_stock FOR SELECT USING (true);
CREATE POLICY "Allow public insert on raw_materials_stock" ON public.raw_materials_stock FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on raw_materials_stock" ON public.raw_materials_stock FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on raw_materials_stock" ON public.raw_materials_stock FOR DELETE USING (true);

CREATE POLICY "Allow public read on indent_sheet_entries" ON public.indent_sheet_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert on indent_sheet_entries" ON public.indent_sheet_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on indent_sheet_entries" ON public.indent_sheet_entries FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on indent_sheet_entries" ON public.indent_sheet_entries FOR DELETE USING (true);