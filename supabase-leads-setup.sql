-- Leads system for Professional Fitness
-- Execute this SQL in your Supabase SQL Editor

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  objective TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  notes TEXT
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- Enable RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts from anyone (for lead capture forms)
CREATE POLICY "Allow anonymous lead creation" ON leads
  FOR INSERT WITH CHECK (true);

-- Policy to only allow viewing leads for authenticated admin users
CREATE POLICY "Admin can view all leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at (if you add this column later)
-- CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
--   FOR EACH ROW EXECUTE FUNCTION update_leads_updated_at();

-- Test insert to verify everything works
INSERT INTO leads (name, phone, objective) 
VALUES ('João Silva', '(17) 99999-9999', 'Perder peso e ganhar massa muscular');

-- Verify the insert worked
SELECT * FROM leads;