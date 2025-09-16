# 🔧 INSTRUÇÕES PARA CORRIGIR SALVAMENTO DE FOTOS

## 🚨 PROBLEMA IDENTIFICADO:
As fotos não estão sendo salvas permanentemente porque o schema do Supabase não estava configurado corretamente para aceitar inserções.

## 📋 SOLUÇÃO - Execute no Supabase SQL Editor:

### 1. **Acesse o Supabase Dashboard:**
- Vá para https://supabase.com/dashboard
- Selecione seu projeto `professional-fitness`
- Clique em **SQL Editor** no menu lateral

### 2. **Execute o SQL corrigido:**
Copie e cole o conteúdo do arquivo `supabase-setup-fixed.sql` no SQL Editor e execute.

**OU** execute este SQL simplificado:

```sql
-- QUICK FIX: Disable RLS temporarily for testing
ALTER TABLE media DISABLE ROW LEVEL SECURITY;
ALTER TABLE modalities DISABLE ROW LEVEL SECURITY;

-- Verify tables exist
SELECT COUNT(*) as total_modalities FROM modalities;
SELECT COUNT(*) as total_media FROM media;

-- Test insert
INSERT INTO media (modality_id, type, url, title, description, category) 
VALUES ('functional', 'image', 'https://via.placeholder.com/400x300', 'Teste Admin', 'Foto de teste', 'regular');

-- Check if insert worked
SELECT * FROM media ORDER BY created_at DESC LIMIT 5;
```

### 3. **Teste no Admin Panel:**
1. Acesse `/admin` no seu site
2. Tente adicionar uma foto
3. Verifique o console do navegador (F12) para logs
4. A foto deve aparecer na galeria pública

## 🔍 LOGS DE DEBUG:

O código agora tem logs detalhados. Abra o console do navegador para ver:
- `🔄 Saving media to Supabase...`
- `✅ Media saved to Supabase:`
- `❌ Error adding media:` (se houver erro)

## 🎯 RESULTADO ESPERADO:

Após executar o SQL:
- ✅ Fotos salvam permanentemente no Supabase
- ✅ Aparecem na galeria pública
- ✅ Persistem entre sessões
- ✅ Visíveis para todos os usuários

## 🛠️ SE AINDA NÃO FUNCIONAR:

Execute este teste manual no SQL Editor:

```sql
-- Teste manual de inserção
INSERT INTO media (modality_id, type, url, title, category) 
VALUES ('functional', 'image', 'https://picsum.photos/400/300', 'Foto Manual', 'regular');

-- Verificar se aparece
SELECT * FROM media;
```

Se o teste manual funcionar, o problema está no código. Se não funcionar, é no banco de dados.