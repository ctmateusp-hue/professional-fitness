# 🏋️ Professional Fitness - Configuração Supabase

## 📋 **Configuração do Supabase**

### **1. Configurar o Banco de Dados**

Execute o SQL abaixo no Supabase SQL Editor para criar as tabelas:

```sql
-- Cole o conteúdo do arquivo supabase-setup.sql
```

Ou copie e cole o conteúdo do arquivo `supabase-setup.sql` diretamente no SQL Editor do Supabase.

### **2. Variáveis de Ambiente**

O arquivo `.env` já está configurado com:

```env
VITE_SUPABASE_URL=https://cgrkvayldjctwdaqtbfd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncmt2YXlsZGpjdHdkYXF0YmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTQ4NDIsImV4cCI6MjA3MzAzMDg0Mn0.wCxEJ9PzyDsmqjQTYAWrPAonHLCKM6gyWqbR_OdOFe8
```

### **3. Funcionalidades**

✅ **Fallback Inteligente:**
- Se Supabase estiver disponível → dados sincronizados na nuvem
- Se Supabase estiver indisponível → fallback para localStorage

✅ **Storage Híbrido:**
- Dados principais no Supabase
- Backup local no localStorage
- Sincronização automática

✅ **Tipos de Mídia:**
- `regular`: Galeria normal das modalidades
- `transformation`: Página "Faça como eles"

### **4. Como Usar**

1. **Desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   vercel --prod --yes
   ```

### **5. Estrutura do Banco**

**Tabelas:**
- `modalities`: Modalidades da academia
- `media`: Fotos e vídeos

**Segurança:**
- RLS (Row Level Security) habilitado
- Leitura pública permitida
- Escrita apenas para usuários autenticados

### **6. Logs no Console**

A aplicação mostra no console qual storage está sendo usado:
- 🚀 Tentando carregar do Supabase...
- ✅ Dados carregados do Supabase
- ⚠️ Supabase indisponível, usando localStorage

## 🚀 **Deploy Configurado**

- **GitHub:** https://github.com/ctmateusp-hue/professional-fitness
- **Vercel:** Configurado para deploy automático
- **Supabase:** Banco de dados configurado

## 📱 **Features Implementadas**

- ✅ Sistema de storage híbrido (Supabase + localStorage)
- ✅ Galeria de modalidades
- ✅ Página de transformações "Faça como eles"
- ✅ Admin panel para gerenciar mídia
- ✅ Integração com Instagram e WhatsApp
- ✅ Design responsivo
- ✅ Cards alinhados com botões uniformes
- ✅ Preços com asteriscos
- ✅ Botão Google Maps com cor original
