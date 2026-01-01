-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  gst_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_address TEXT,
  customer_phone TEXT,
  customer_gst TEXT,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  balance_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_type TEXT NOT NULL,
  setting_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(setting_type, user_id)
);

-- Create warehouse_stock table
CREATE TABLE public.warehouse_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  product_name TEXT NOT NULL,
  opening NUMERIC(10,2) NOT NULL DEFAULT 0,
  manufactured NUMERIC(10,2) NOT NULL DEFAULT 0,
  sales NUMERIC(10,2) NOT NULL DEFAULT 0,
  closing NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month, product_name)
);

-- Create distributor_stock table
CREATE TABLE public.distributor_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  product_name TEXT NOT NULL,
  opening NUMERIC(10,2) NOT NULL DEFAULT 0,
  received NUMERIC(10,2) NOT NULL DEFAULT 0,
  sales NUMERIC(10,2) NOT NULL DEFAULT 0,
  closing NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month, product_name)
);

-- Create raw_materials_stock table
CREATE TABLE public.raw_materials_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  chemical_name TEXT NOT NULL,
  opening NUMERIC(10,2) NOT NULL DEFAULT 0,
  purchased NUMERIC(10,2) NOT NULL DEFAULT 0,
  used NUMERIC(10,2) NOT NULL DEFAULT 0,
  closing NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month, chemical_name)
);

-- Create indent_sheet_entries table
CREATE TABLE public.indent_sheet_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  formulation_name TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 0,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  new_invoice_number TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-%';
  
  new_invoice_number := 'INV-' || LPAD(next_num::TEXT, 4, '0');
  RETURN new_invoice_number;
END;
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_warehouse_stock_updated_at
  BEFORE UPDATE ON public.warehouse_stock
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_distributor_stock_updated_at
  BEFORE UPDATE ON public.distributor_stock
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_raw_materials_stock_updated_at
  BEFORE UPDATE ON public.raw_materials_stock
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();