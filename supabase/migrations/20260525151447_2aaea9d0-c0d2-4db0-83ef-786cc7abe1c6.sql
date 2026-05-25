
CREATE TABLE public.fabric_skus (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sku_code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  width_cm numeric(8,1),
  color text,
  collection text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.fabric_rolls (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_id text UNIQUE NOT NULL,
  sku_code text REFERENCES public.fabric_skus(sku_code),
  qr_code_value text UNIQUE NOT NULL,
  meters_initial numeric(8,2) NOT NULL,
  meters_remaining numeric(8,2) NOT NULL,
  location_id text NOT NULL,
  status text DEFAULT 'ACTIVE',
  reserved_for_order text,
  received_date date,
  supplier text,
  doc_no text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.fabric_movements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  datetime timestamptz DEFAULT now(),
  user_id text DEFAULT 'U1',
  roll_id text NOT NULL,
  sku_code text NOT NULL,
  qty_meters numeric(8,2) NOT NULL,
  from_location_id text,
  to_location_id text,
  order_no text,
  note text,
  source text DEFAULT 'warehouse'
);

CREATE TABLE public.quotes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number text UNIQUE NOT NULL,
  client_name text,
  quote_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'DRAFT',
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.quote_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE,
  quote_number text NOT NULL,
  fabric_name text NOT NULL,
  width_m numeric(8,2) NOT NULL DEFAULT 0,
  height_m numeric(8,2) NOT NULL DEFAULT 0,
  pleating_factor numeric(8,2) NOT NULL DEFAULT 1,
  qty integer NOT NULL DEFAULT 1,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.fabric_skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabric_rolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabric_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open_all" ON public.fabric_skus FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_all" ON public.fabric_rolls FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_all" ON public.fabric_movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_all" ON public.quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_all" ON public.quote_items FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_rolls_sku ON public.fabric_rolls(sku_code);
CREATE INDEX idx_rolls_status ON public.fabric_rolls(status);
CREATE INDEX idx_movements_roll ON public.fabric_movements(roll_id);
CREATE INDEX idx_quote_items_quote ON public.quote_items(quote_id);
CREATE INDEX idx_quote_items_number ON public.quote_items(quote_number);
