# Deployment no GitHub Pages

## Status Atual

✅ **Workflow CI/CD configurado** — GitHub Actions build e deploy automático  
✅ **Vite configurado** — base path correto para `/novototaldocumentos03/`  
⏳ **Secrets não configurados** — precisa adicionar manualmente no GitHub  

## Próximas Etapas (Manual)

### 1. Adicionar Secrets do Supabase

Acesse: https://github.com/senacomercial/novototaldocumentos03/settings/secrets/actions

Clique em **"New repository secret"** e adicione:

```
Name: VITE_SUPABASE_URL
Value: https://bpofkdijgplyokazqlvl.supabase.co
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwb2ZrZGlqZ3BseW9rYXpxbHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODA1NTAsImV4cCI6MjA5NTU1NjU1MH0.HAfvKUD80EajNtfUcG-tvpUwXJn9po1yVIcOEvThCC0
```

### 2. Configurar GitHub Pages

Acesse: https://github.com/senacomercial/novototaldocumentos03/settings/pages

- **Source:** Deploy from a branch  
- **Branch:** `gh-pages` / `/ (root)`  
- Clique em **Save**

### 3. Disparar Deploy

Uma vez que os secrets estejam configurados, o deploy será disparado automaticamente a cada push para:
- `main`
- `claude/**` branches

Ou faça um push vazio para forçar:
```bash
git commit --allow-empty -m "Trigger deployment"
git push origin claude/cool-meitner-6XcVu
```

## Acompanhar Build

Acesse: https://github.com/senacomercial/novototaldocumentos03/actions

O site estará disponível em:  
🚀 **https://senacomercial.github.io/novototaldocumentos03/**

## Arquivos de Configuração

- `.github/workflows/deploy.yml` — GitHub Actions workflow
- `vite.config.ts` — configurado com base path `/novototaldocumentos03/`
- `.env` — credenciais locais (não versionado em GitHub)

## Troubleshooting

Se o build falhar:

1. **Type errors**: Rode `npm run lint` localmente
2. **Build errors**: Rode `npm run build` localmente  
3. **Deploy fails**: Verifique se os secrets estão configurados corretamente
4. **Site não carrega**: Aguarde 2-3 minutos após o deploy; limpe o cache

## Ambiente Local

Para testar localmente com o mesmo path:
```bash
npm run build
npx http-server dist -p 8080
```

Acesse: http://localhost:8080/novototaldocumentos03/
