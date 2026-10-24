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
- **[EXTREMAMENTE PROIBIDO]**: Tipos ou bibliotecas do Firebase para banco de dados ou autenticação. Nosso backend roda em servidor próprio (Spring Boot Java + PostgreSQL na Hostinger). O pacote `@react-native-firebase/analytics` é restrito exclusivamente a Analytics.

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
