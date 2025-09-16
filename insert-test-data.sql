-- Insert test transformation story
INSERT INTO transformation_stories (id, title, student_name, description, before_description, after_description, transformation_period, featured, sort_order, created_at, updated_at)
VALUES (
  'test-story-001',
  'Transformação João Silva',
  'João Silva',
  'História incrível de transformação de 6 meses com resultados surpreendentes',
  'João estava com sobrepeso e sedentário, pesando 95kg.',
  'Após 6 meses de treino, João chegou aos 78kg e ganhou massa muscular.',
  '6 meses',
  true,
  1,
  NOW(),
  NOW()
);

-- Insert test media for the story
INSERT INTO transformation_media (id, story_id, type, url, media_category, title, description, sort_order, created_at, updated_at)
VALUES 
  (
    'media-before-001',
    'test-story-001',
    'image',
    'https://via.placeholder.com/400x600/ff0000/ffffff?text=ANTES',
    'before',
    'Foto Antes',
    'Foto antes da transformação',
    1,
    NOW(),
    NOW()
  ),
  (
    'media-after-001',
    'test-story-001',
    'image',
    'https://via.placeholder.com/400x600/00ff00/ffffff?text=DEPOIS',
    'after',
    'Foto Depois',
    'Foto depois da transformação',
    2,
    NOW(),
    NOW()
  ),
  (
    'media-before-after-001',
    'test-story-001',
    'image',
    'https://via.placeholder.com/800x600/0000ff/ffffff?text=ANTES+E+DEPOIS',
    'before_after',
    'Comparação Antes e Depois',
    'Foto comparativa antes e depois',
    3,
    NOW(),
    NOW()
  );

-- Check the data
SELECT 'Stories:' as table_name;
SELECT * FROM transformation_stories;

SELECT 'Media:' as table_name;
SELECT * FROM transformation_media;