---
description: commitar as alterações do projeto seguindo Conventional Commits em PT-BR
---

// turbo-all

1. Verifique o status do repositório para entender o que mudou:

```
git status
```

2. Analise as mudanças para compor uma mensagem de commit coerente:

```
git diff --staged; git diff
```

3. Adicione todos os arquivos modificados ao staging:

```
git add .
```

4. Gere e execute o commit seguindo **obrigatoriamente** o padrão Conventional Commits:
   - **Formato**: `<tipo>(<escopo opcional>): <descrição em PT-BR>`
   - **Tipos**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
   - **Descrição**: imperativo presente em PT-BR (ex: "adiciona", "corrige", "remove")
   - **Escopo**: módulo, tela ou feature afetada (ex: `auth`, `player`, `quiz`)
   - **Exemplos**:
     - `feat(meditation): adiciona cache de áudio no player`
     - `fix(auth): corrige loop infinito no refresh token`
     - `chore: atualiza dependências do projeto`

```
git commit -m "<mensagem gerada>"
```

5. Confirme o commit exibindo o log:

```
git log --oneline -5
```
