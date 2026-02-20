---
description: Guia de TypeScript para o SaberEspirita-Expo
---

# Guia de Estilo: TypeScript

Este documento define os padrões de uso do TypeScript para o projeto **SaberEspirita-Expo**.

## Configuração Base

- **Modo Strict**: Sempre ativado (`"strict": true`)
- **Path Aliases**: Usar `@/` para referenciar `src/`
  ```typescript
  import { useAppTheme } from "@/hooks/useAppTheme";
  import { DarkTheme } from "@/configs/theme";
  ```

## Tipagem

### ✅ Sempre tipar explicitamente:

- **Interfaces de Props**

  ```typescript
  interface InputProps {
    children: React.ReactNode;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    required?: boolean;
  }
  ```

- **Tipos de Estado (Zustand)**

  ```typescript
  interface ThemeState {
    themeType: ThemeType;
    setThemeType: (type: ThemeType) => void;
    toggleTheme: () => void;
    getResolvedTheme: () => "light" | "dark";
  }
  ```

- **Tipos de Tema**
  ```typescript
  export type ThemeColors = {
    background: string;
    primary: string;
    text: string;
    // ...
  };
  ```

### ❌ Evitar:

- `any` (usar `unknown` se necessário)
- Tipagem implícita em funções públicas
- Enums (preferir union types: `type Theme = "light" | "dark"`)
