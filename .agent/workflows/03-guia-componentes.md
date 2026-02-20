---
description: Guia de Componentes React e Imports para o SaberEspirita-Expo
---

# Guia de Estilo: Componentes React e Imports

Este documento define os padrões para criação de componentes e gerenciamento de imports no **SaberEspirita-Expo**.

## Componentes React

### Exports: Named vs Default

- **Regra Geral**: Preferir **named exports** (`export function`) para todos os componentes.
- **Exceção**: Usar **default export** (`export default function`) **APENAS** para o entry point da aplicação (`App.tsx`).

### Arrow Functions vs Function Declarations

**Regra Geral**: Preferir **function declarations** (`function nome() {}`) ao invés de arrow functions.

- ✅ **Quando usar Function Declarations**: Componentes React, Custom Hooks, Funções utilitárias, Handlers nomeados.
- ✅ **Quando usar Arrow Functions**: Callbacks inline, Event handlers inline, Zustand stores, Closures.

```typescript
// ✅ CORRETO - Function declaration para componente
export function UserCard({ name, email }: UserCardProps) {
  return <View>...</View>;
}

// ❌ EVITAR - Arrow function para componente
const UserCard = ({ name, email }: UserCardProps) => {
  return <View>...</View>;
};
```

### Padrões de Componentes

1.  **Componentes de Tela (Screens)**:
    - Usar `export function NomeDaTela()` em `src/pages/*/index.tsx`.
    - Sempre consumir `useAppTheme()`.
    - Estilos em `styles.ts` usando `createStyles(theme)`.
2.  **Navegadores React Navigation**:
    - Usar `export function NomeNavigator()`.
    - Sufixo `Navigator` no nome.
    - Definir tipos TypeScript para rotas (`ParamList`).
3.  **Compound Components (Abordagem Híbrida)**:
    - Usar para componentes com múltiplas variações, composição flexível ou estado compartilhado (ex: Inputs complexos, Cards).
4.  **Props Simples**:
    - Usar para componentes com estrutura fixa, poucas variações e sem estado muito elaborado.

## Imports

### Ordem de Imports

1. **React e React Native**
2. **Bibliotecas externas** (Expo, Firebase, etc.)
3. **Imports internos** (usando `@/`)
4. **Tipos e interfaces**

```typescript
// 1. React/React Native
import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";

// 2. Bibliotecas externas
import { Link } from "expo-router";

// 3. Imports internos
import { useAppTheme } from "@/hooks/useAppTheme";

// 4. Tipos
import type { ITheme } from "@/configs/theme/types";
```

### Path Aliases

- **Sempre usar `@/`** para imports internos da pasta `src/`.
- **Nunca usar caminhos relativos longos** (`../../`) para arquivos fora da pasta atual.
