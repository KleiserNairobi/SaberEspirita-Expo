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
- **[EXTREMAMENTE PROIBIDO]**: Tipos do `@react-native-firebase/firestore` (ex: `FirebaseFirestoreTypes`). Use sempre os tipos do SDK Web `firebase/firestore` (ex: `import { Timestamp } from "firebase/firestore"`). O SDK Nativo é voltado APENAS para Analytics neste projeto.

## Comentários e Documentação

- **Idioma Padrão (PT-BR)**: Todos os comentários inline, docblocks e explicações de decisões arquiteturais devem ser escritos em **Português do Brasil**.
- O código em si (nomes de variáveis, funções, classes, interfaces e arquivos) deve permanecer em inglês conforme padrão de mercado, mas a documentação auxiliar deve facilitar a leitura da equipe em PT-BR.

  ```typescript
  // ❌ Incorreto (Inglês)
  // Check if user is eligible for the certificate
  const isEligible = checkEligibility(user);

  // ✅ Correto (Português)
  // Verifica se o usuário é elegível para obter o certificado
  const isEligible = checkEligibility(user);
  ```
