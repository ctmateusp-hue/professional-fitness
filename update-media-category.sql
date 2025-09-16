-- Script para adicionar a categoria 'before_after' ao banco de dados
-- Execute este comando no seu Supabase SQL Editor

-- Primeiro, remove o constraint existente (se existir)
ALTER TABLE transformation_media 
DROP CONSTRAINT IF EXISTS transformation_media_media_category_check;

-- Adiciona o novo constraint com a categoria 'before_after'
ALTER TABLE transformation_media 
ADD CONSTRAINT transformation_media_media_category_check 
CHECK (media_category IN ('before', 'after', 'before_after', 'during', 'video_testimonial'));

-- Atualiza o comentário da coluna
COMMENT ON COLUMN transformation_media.media_category IS 'Categoria da mídia: before, after, before_after, during, video_testimonial';

-- Verifica se a alteração foi aplicada
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'transformation_media_media_category_check';