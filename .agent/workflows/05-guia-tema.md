---
description: Guia de Estilização e Temas para o SaberEspirita-Expo
---

# Guia de Estilo: Estilização e Temas

Este documento define as convenções para uso do StyleSheet e dos tokens de Tema no **SaberEspirita-Expo**.

## Estilização

### Regras Gerais

1. **Sempre usar `StyleSheet.create()`** - Nunca inline objects para estilos fixos.
2. **Usar tokens do tema** - Nunca usar cores e tamanhos em pixels fixos sem passarem por `theme.*`.
3. **Separação baseada em complexidade:**
   - **Telas simples** (< 200 linhas total): estilos no mesmo arquivo (`index.tsx`).
   - **Telas complexas** (≥ 200 linhas): separar em arquivo `styles.ts`.

### Estilos Dinâmicos (createStyles)

Utilize este padrão quando seus estilos precisarem acessar cores, fontes e propriedades dinâmicas do tema (o que é quase sempre):

**`styles.ts`**:

```typescript
import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    title: {
      ...theme.text("xxl", "semibold"),
    },
  });
```

**`index.tsx` (Uso no arquivo principal):**

```typescript
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

export function MyComponent() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Título</Text>
    </View>
  );
}
```

## Temas

Todos os temas implementam a interface `ITheme`. Consuma o tema via `useAppTheme()`.

### Tokens de Cores (`theme.colors.*`)

- `primary`, `secondary`, `accent`
- `background`, `card`
- `text`, `textSecondary`
- `border`, `icon`, `muted`
- `error`, `success`
- `onPrimary`, `onSecondary`

### Espaçamento (`theme.spacing.*`)

- `xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32), `xxl` (48).

### Bordas (`theme.radius.*`)

- `xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32), `full` (999).

### ⚠️ Tipografia do Tema

A interface `ITheme` não possui a propriedade `font`. Você **NUNCA DEVE** tentar acessar `theme.font.algo`.

Em vez disso, use a função auxiliar `theme.text(...)`:

```typescript
const styles = StyleSheet.create({
  // ✅ Padrões Corretos:
  title: {
    ...theme.text("xxxl", "semibold"),
  },
  subtitle: {
    ...theme.text("lg", "regular", theme.colors.textSecondary),
  },
  body: {
    ...theme.text("md", "regular"), // Cor padrão é theme.colors.text
  },
  caption: {
    ...theme.text("sm", "regular", theme.colors.muted),
  },
});
```

Parâmetros do `theme.text()`:

1. `size`: "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"
2. `weight`: "regular", "medium", "semibold", "bold"
3. `color`: [opcional] (padrão é text)
