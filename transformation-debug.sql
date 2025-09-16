-- Script de diagnóstico e correção para erro de mídia em transformações
-- Execute este script no Supabase SQL Editor para diagnosticar e corrigir problemas

-- 1. Verificar se as tabelas existem
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_name IN ('transformation_stories', 'transformation_media')
ORDER BY table_name;

-- 2. Verificar estrutura da tabela transformation_media
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'transformation_media'
ORDER BY ordinal_position;

-- 3. Verificar constraints existentes
SELECT 
  tc.constraint_name, 
  tc.constraint_type,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'transformation_media'
AND tc.constraint_type = 'CHECK';

-- 4. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('transformation_stories', 'transformation_media')
ORDER BY tablename, policyname;

-- 5. Tentar corrigir o constraint media_category se necessário
DO $$
BEGIN
  -- Remove constraint antigo se existir
  BEGIN
    ALTER TABLE transformation_media 
    DROP CONSTRAINT transformation_media_media_category_check;
  EXCEPTION 
    WHEN undefined_object THEN 
      RAISE NOTICE 'Constraint não existe, continuando...';
  END;
  
  -- Adiciona novo constraint
  ALTER TABLE transformation_media 
  ADD CONSTRAINT transformation_media_media_category_check 
  CHECK (media_category IN ('before', 'after', 'before_after', 'during', 'video_testimonial'));
  
  RAISE NOTICE 'Constraint atualizado com sucesso!';
END$$;

-- 6. Verificar se há dados na tabela
SELECT 
  COUNT(*) as total_stories
FROM transformation_stories;

SELECT 
  COUNT(*) as total_media,
  media_category,
  type
FROM transformation_media
GROUP BY media_category, type
ORDER BY media_category, type;

-- 7. Testar inserção de dados
DO $$
BEGIN
  -- Teste de inserção de história
  INSERT INTO transformation_stories (
    id,
    title,
    student_name,
    description,
    transformation_period,
    featured
  ) VALUES (
    'test-story-' || extract(epoch from now())::text,
    'Teste de História',
    'Usuário Teste',
    'Descrição de teste para verificar funcionamento.',
    '3 meses',
    false
  );
  
  RAISE NOTICE 'História de teste criada com sucesso!';
  
EXCEPTION 
  WHEN OTHERS THEN 
    RAISE NOTICE 'Erro ao criar história de teste: %', SQLERRM;
END$$;

-- Fim do script de diagnóstico