---
description: Analisa as alterações do projeto e realiza um git commit automatizado
---

# 🚀 Workflow de Commit (Padrão SaberEspirita)

Toda vez que o usuário chamar este workflow (via `/commit` ou pedindo para commitar o código), siga rigorosamente os passos abaixo em sequência para garantir o versionamento limpo e padronizado:

1. Analise o que foi alterado recentemente no projeto para entender o escopo do código.

```bash
git status
```

2. Adicione todas as alterações (tracked e untracked) na staging area do Git.
   // turbo

```bash
git add .
```

3. Gere uma mensagem de commit mentalmente, seguindo o padrão **Conventional Commits**, usando o idioma Português (PT-BR).
   - _Tipos válidos:_ `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`.
   - _Exemplo:_ `feat: adiciona componente MeditationCard no módulo Medite`

4. Efetue o commit substituindo os valores do comando abaixo pela mensagem que você gerou:
   // turbo

```bash
git commit -m "<TIPO>: <MENSAGEM>"
```

5. Responda ao usuário com o resumo do que você acabou de commitar e a mensagem utilizada!
