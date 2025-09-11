-- Create modalities table
CREATE TABLE IF NOT EXISTS modalities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  modality_id TEXT NOT NULL REFERENCES modalities(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'regular' CHECK (category IN ('regular', 'transformation')),
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_modality_id ON media(modality_id);
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at);

-- Insert default modalities
INSERT INTO modalities (id, title, description) VALUES 
  ('functional', 'FUNCIONAL/CROSS', 'Nossos treinos são elaborados com uma metodologia própria. Voltado para as pessoas da nossa cidade. São exercícios que usam bastante o peso corporal associados com aparelhos de musculação.'),
  ('musculacao', 'MUSCULAÇÃO', 'Treinos elaborados com exercícios de resultado, ou seja, focando no que o corpo mais precisa, tanto para estética, fortalecimento, ganho de massa….etc.'),
  ('zumba', 'ZUMBA', 'Aula de dança com as melhores e mais animadas músicas! Coreografias adaptadas para você aproveitar o máximo a aula!')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Allow public read access on modalities" ON modalities;
DROP POLICY IF EXISTS "Allow public read access on media" ON media;
DROP POLICY IF EXISTS "Allow authenticated users to insert modalities" ON modalities;
DROP POLICY IF EXISTS "Allow authenticated users to update modalities" ON modalities;
DROP POLICY IF EXISTS "Allow authenticated users to delete modalities" ON modalities;
DROP POLICY IF EXISTS "Allow authenticated users to insert media" ON media;
DROP POLICY IF EXISTS "Allow authenticated users to update media" ON media;
DROP POLICY IF EXISTS "Allow authenticated users to delete media" ON media;

-- Create policies for public read access
CREATE POLICY "Allow public read access on modalities" ON modalities
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on media" ON media
  FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert modalities" ON modalities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update modalities" ON modalities
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete modalities" ON modalities
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert media" ON media
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update media" ON media
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete media" ON media
  FOR DELETE USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_modalities_updated_at BEFORE UPDATE ON modalities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
