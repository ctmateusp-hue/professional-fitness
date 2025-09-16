-- FIXED Supabase setup with proper UUID handling
-- Execute this SQL in your Supabase SQL Editor

-- Drop existing tables to recreate with proper UUID setup
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS modalities CASCADE;

-- Create modalities table with UUID primary key
CREATE TABLE modalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- Keep text slug for referencing
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media table with UUID primary key
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modality_slug TEXT NOT NULL REFERENCES modalities(slug) ON DELETE CASCADE,
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
CREATE INDEX idx_media_modality_slug ON media(modality_slug);
CREATE INDEX idx_media_category ON media(category);
CREATE INDEX idx_media_created_at ON media(created_at DESC);

-- Insert default modalities with slugs
INSERT INTO modalities (slug, title, description) VALUES 
  ('functional', 'FUNCIONAL/CROSS', 'Nossos treinos são elaborados com uma metodologia própria. Voltado para as pessoas da nossa cidade. São exercícios que usam bastante o peso corporal associados com aparelhos de musculação.'),
  ('musculacao', 'MUSCULAÇÃO', 'Treinos elaborados com exercícios de resultado, ou seja, focando no que o corpo mais precisa, tanto para estética, fortalecimento, ganho de massa….etc.'),
  ('zumba', 'ZUMBA', 'Aula de dança com as melhores e mais animadas músicas! Coreografias adaptadas para você aproveitar o máximo a aula!');

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

-- DISABLE RLS for now to allow anonymous inserts (easier testing)
ALTER TABLE modalities DISABLE ROW LEVEL SECURITY;
ALTER TABLE media DISABLE ROW LEVEL SECURITY;

-- Test insert to verify everything works
INSERT INTO media (modality_slug, type, url, title, description, category) 
VALUES ('functional', 'image', 'https://example.com/test.jpg', 'Test Image', 'Test description', 'regular');

-- Verify the insert worked
SELECT * FROM media;