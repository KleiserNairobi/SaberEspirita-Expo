---
description: Guia de Estrutura de Arquivos e Nomenclatura para o SaberEspirita-Expo
---

# Guia de Estilo: Estrutura de Arquivos e Nomenclatura

Este documento define como organizar arquivos e nomear elementos no projeto **SaberEspirita-Expo**.

## Estrutura de Arquivos

### Organização de Pastas

```text
src/
├── assets/                # Imagens, sons e outros assets locais
├── components/            # Componentes reutilizáveis globais
│   └── ComponentName/
│       ├── index.tsx      # Componente principal
│       └── styles.ts      # Estilos (se necessário)
├── configs/               # Configurações (ex: theme, firebase)
├── contexts/              # Context API providers
├── data/                  # Dados estáticos, mocks (JSON)
├── hooks/                 # Custom hooks globais
├── pages/                 # Implementação das Telas (Lógica e UI)
│   └── feature-name/      # Ex: auth, pray, meditate
│       ├── index.tsx      # Entry point da tela
│       ├── styles.ts      # Estilos da tela
│       ├── components/    # Componentes específicos da tela
│       └── hooks/         # Hooks específicos da tela
├── routers/               # Navegadores React Navigation
├── services/              # Integração com APIs/Firebase
├── stores/                # Zustand stores
├── templates/             # Templates do app (ex: certificados)
├── types/                 # Tipos TypeScript globais
└── utils/                 # Funções utilitárias
```

### Convenções de Nomeação de Arquivos

- **Navegadores**: `PascalCase` com sufixo `Navigator` (ex: `RootNavigator.tsx`)
- **Telas**: Pasta em `kebab-case`, arquivo `index.tsx` (ex: `emotional-chat/index.tsx`)
- **Componentes**: `PascalCase` (ex: `AppInput/index.tsx`)
- **Hooks**: `camelCase` com prefixo `use` (ex: `useAppTheme.ts`)
- **Stores**: `camelCase` com sufixo `Store` (ex: `themeStore.ts`)
- **Tipos**: `PascalCase` ou `types.ts`
- **Utilitários**: `camelCase` (ex: `formatDate.ts`)

## Nomenclatura no Código

### Variáveis e Funções

- **camelCase** para variáveis e funções.
- Preferir Function declarations: `function handleLogin() {}`.

### Componentes e Tipos

- **PascalCase** para componentes, interfaces e tipos (`interface UserData {}`).

### Constantes

- **UPPER_SNAKE_CASE** para constantes globais (`const API_BASE_URL = "https://api.example.com";`).

### Hooks Personalizados

- **Prefixo `use`** + **camelCase** (ex: `useAppTheme`).

### Stores (Zustand)

- **Prefixo `use`** + **PascalCase** + **Sufixo `Store`** (ex: `useThemeStore`).
