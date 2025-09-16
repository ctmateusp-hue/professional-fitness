-- Script para corrigir políticas RLS que estão bloqueando inserção de mídia
-- Execute este script no Supabase SQL Editor

-- 1. Remover políticas antigas que verificam auth.role()
DROP POLICY IF EXISTS "Allow authenticated users to insert transformation_media" ON transformation_media;
DROP POLICY IF EXISTS "Allow authenticated users to update transformation_media" ON transformation_media;
DROP POLICY IF EXISTS "Allow authenticated users to delete transformation_media" ON transformation_media;

DROP POLICY IF EXISTS "Allow authenticated users to insert transformation_stories" ON transformation_stories;
DROP POLICY IF EXISTS "Allow authenticated users to update transformation_stories" ON transformation_stories;
DROP POLICY IF EXISTS "Allow authenticated users to delete transformation_stories" ON transformation_stories;

-- 2. Criar novas políticas mais permissivas para admin
-- (Como não usamos autenticação Supabase, permitimos todas as operações)

-- Políticas para transformation_stories
CREATE POLICY "Allow all operations on transformation_stories" ON transformation_stories
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para transformation_media  
CREATE POLICY "Allow all operations on transformation_media" ON transformation_media
  FOR ALL USING (true) WITH CHECK (true);

-- 3. Verificar se as políticas foram aplicadas
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

-- Mensagem de sucesso
SELECT 'Políticas RLS atualizadas com sucesso! Agora deve ser possível adicionar mídia.' as status;