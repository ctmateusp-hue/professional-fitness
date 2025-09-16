-- SQL para adicionar sistema de histórias de transformação "Faça como eles!"
-- Execute este SQL no Supabase SQL Editor

-- 1. Criar tabela para histórias de transformação
CREATE TABLE IF NOT EXISTS transformation_stories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  student_name TEXT NOT NULL,
  description TEXT NOT NULL,
  before_description TEXT,
  after_description TEXT,
  transformation_period TEXT, -- Ex: "6 meses", "1 ano"
  featured BOOLEAN DEFAULT false, -- Para destacar histórias principais
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela para mídia das histórias (fotos antes/depois, vídeos)
CREATE TABLE IF NOT EXISTS transformation_media (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  story_id TEXT NOT NULL REFERENCES transformation_stories(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  media_category TEXT NOT NULL CHECK (media_category IN ('before', 'after', 'before_after', 'during', 'video_testimonial')),
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  thumbnail TEXT, -- Para vídeos
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_transformation_stories_featured ON transformation_stories(featured);
CREATE INDEX IF NOT EXISTS idx_transformation_stories_sort_order ON transformation_stories(sort_order);
CREATE INDEX IF NOT EXISTS idx_transformation_media_story_id ON transformation_media(story_id);
CREATE INDEX IF NOT EXISTS idx_transformation_media_category ON transformation_media(media_category);
CREATE INDEX IF NOT EXISTS idx_transformation_media_sort_order ON transformation_media(sort_order);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE transformation_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformation_media ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow public read access on transformation_stories" ON transformation_stories;
DROP POLICY IF EXISTS "Allow public read access on transformation_media" ON transformation_media;
DROP POLICY IF EXISTS "Allow authenticated users to insert transformation_stories" ON transformation_stories;
DROP POLICY IF EXISTS "Allow authenticated users to update transformation_stories" ON transformation_stories;
DROP POLICY IF EXISTS "Allow authenticated users to delete transformation_stories" ON transformation_stories;
DROP POLICY IF EXISTS "Allow authenticated users to insert transformation_media" ON transformation_media;
DROP POLICY IF EXISTS "Allow authenticated users to update transformation_media" ON transformation_media;
DROP POLICY IF EXISTS "Allow authenticated users to delete transformation_media" ON transformation_media;
DROP POLICY IF EXISTS "Allow all operations on transformation_stories" ON transformation_stories;
DROP POLICY IF EXISTS "Allow all operations on transformation_media" ON transformation_media;

-- 6. Criar políticas para leitura pública
CREATE POLICY "Allow public read access on transformation_stories" ON transformation_stories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on transformation_media" ON transformation_media
  FOR SELECT USING (true);

-- 7. Criar políticas para operações admin (sem autenticação Supabase)
-- Como usamos autenticação local, permitimos todas as operações
CREATE POLICY "Allow all operations on transformation_stories" ON transformation_stories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on transformation_media" ON transformation_media
  FOR ALL USING (true) WITH CHECK (true);

-- 8. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_transformation_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Criar triggers para updated_at (com proteção contra duplicação)
DROP TRIGGER IF EXISTS update_transformation_stories_updated_at ON transformation_stories;
DROP TRIGGER IF EXISTS update_transformation_media_updated_at ON transformation_media;

CREATE TRIGGER update_transformation_stories_updated_at 
  BEFORE UPDATE ON transformation_stories
  FOR EACH ROW EXECUTE FUNCTION update_transformation_updated_at_column();

CREATE TRIGGER update_transformation_media_updated_at 
  BEFORE UPDATE ON transformation_media
  FOR EACH ROW EXECUTE FUNCTION update_transformation_updated_at_column();

-- 10. Inserir dados de exemplo para testar
INSERT INTO transformation_stories (
  id, 
  title, 
  student_name, 
  description, 
  before_description, 
  after_description, 
  transformation_period, 
  featured, 
  sort_order
) VALUES 
(
  'example-1',
  'Transformação Incrível: De Sedentário a Atleta',
  'João Silva',
  'Uma jornada inspiradora de mudança de vida através do exercício e dedicação.',
  'Sedentário há anos, sem disposição e com sobrepeso.',
  'Atlético, saudável e cheio de energia para enfrentar o dia.',
  '8 meses',
  true,
  1
),
(
  'example-2', 
  'Força e Determinação: A História da Maria',
  'Maria Santos',
  'Como a musculação mudou não só o corpo, mas toda a mentalidade.',
  'Baixa autoestima e falta de força para atividades básicas.',
  'Confiante, forte e inspirando outras mulheres.',
  '6 meses',
  true,
  2
)
ON CONFLICT (id) DO NOTHING;

-- 11. Comentários para documentação
COMMENT ON TABLE transformation_stories IS 'Histórias de transformação dos alunos para a seção "Faça como eles!"';
COMMENT ON TABLE transformation_media IS 'Fotos e vídeos das histórias de transformação (antes/depois/testemunhos)';
COMMENT ON COLUMN transformation_stories.featured IS 'Marca histórias para destaque na página principal';
COMMENT ON COLUMN transformation_stories.transformation_period IS 'Tempo que levou para a transformação (ex: "6 meses")';
COMMENT ON COLUMN transformation_media.media_category IS 'Categoria da mídia: before, after, before_after, during, video_testimonial';

-- Fim do script SQL
