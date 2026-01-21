# 🎨 Design System - Referência Rápida

**Última Atualização:** 04/01/2026

---

## ⚠️ AVISO CRÍTICO

**OS PROTÓTIPOS STITCH NÃO USAM NOSSO DESIGN SYSTEM!**

Ao implementar telas baseadas nos protótipos em `artifacts/stitch-prototypes/`:

- ✅ **USE:** Layout, estrutura, hierarquia visual
- ❌ **IGNORE:** Cores, fontes, valores CSS de tipografia

---

## 🎨 Cores (Dark Theme)

```typescript
// Principais
background: "#121E31"; // Fundo principal
card: "#162235"; // Cards e superfícies
primary: "#8F9D7E"; // Verde oliva (ações principais)
accent: "#2A3645"; // Azul escuro (destaques)

// Texto
text: "#E0E0E0"; // Texto principal
textSecondary: "#A0A0A0"; // Texto secundário
muted: "#546072"; // Texto discreto

// UI
border: "#2A3645"; // Bordas
icon: "#A3B09A"; // Ícones
tabBar: "#1E2A3C"; // Barra de navegação

// Estados
error: "#CF6679"; // Erros
success: "#81C784"; // Sucesso

// Gradientes
gradientStart: "#121E31";
gradientEnd: "#0C1624";
```

---

## 📝 Tipografia

### Fontes

```typescript
regular: "BarlowCondensed_400Regular";
medium: "BarlowCondensed_500Medium";
semibold: "BarlowCondensed_600SemiBold";
bold: "Oswald_700Bold";
```

### Tamanhos

```typescript
xs: 12; // Legendas muito pequenas
sm: 14; // Legendas, captions
md: 16; // Corpo de texto padrão
lg: 18; // Subtítulos pequenos
xl: 20; // Subtítulos
xxl: 24; // Títulos de seção
xxxl: 32; // Títulos principais
```

### Como Usar

```typescript
// ❌ INCORRETO - theme.font NÃO EXISTE!
...theme.font.h1

// ✅ CORRETO - Use theme.text()
...theme.text("xxl", "semibold")
...theme.text("lg", "regular", theme.colors.textSecondary)
...theme.text("md", "regular")
```

**Parâmetros de `theme.text()`:**

1. **size**: `"xs"` | `"sm"` | `"md"` | `"lg"` | `"xl"` | `"xxl"` | `"xxxl"`
2. **weight**: `"regular"` | `"medium"` | `"semibold"` | `"bold"`
3. **color** (opcional): Cor do texto (padrão: `theme.colors.text`)

---

## 📏 Espaçamento

```typescript
xs: 4; // Micro espaçamentos
sm: 8; // Pequenos gaps
md: 16; // Padrão (padding de cards)
lg: 24; // Seções
xl: 32; // Grandes espaçamentos
xxl: 48; // Espaçamentos extra grandes
```

---

## 🔲 Bordas

```typescript
xs: 4; // Bordas sutis
sm: 8; // Bordas pequenas
md: 16; // Bordas médias (padrão cards)
lg: 24; // Bordas grandes
xl: 32; // Bordas extra grandes
full: 999; // Círculos perfeitos
```

---

## 📋 Exemplo Completo

```typescript
import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export function createStyles(theme: ITheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    card: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    title: {
      ...theme.text("xxl", "semibold"),
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.text("lg", "regular", theme.colors.textSecondary),
      marginBottom: theme.spacing.md,
    },
    body: {
      ...theme.text("md", "regular"),
      lineHeight: 24,
    },
    caption: {
      ...theme.text("sm", "regular", theme.colors.muted),
    },
  });
}
```

---

## 🔗 Referências

- **Tema Dark:** `src/configs/theme/dark.ts`
- **Tema Light:** `src/configs/theme/light.ts`
- **Tipos:** `src/configs/theme/types.ts`
- **Hook:** `src/hooks/useAppTheme.ts`
- **Guia Completo:** `.agent/workflows/code-style-guide.md`

---

## ✅ Checklist de Implementação

Ao criar um novo componente/tela:

- [ ] Importei `useAppTheme` hook
- [ ] Usei `createStyles(theme)` para estilos dinâmicos
- [ ] Usei `theme.text()` para tipografia (não `theme.font`)
- [ ] Usei `theme.colors.*` para cores (sem hardcode)
- [ ] Usei `theme.spacing.*` para espaçamentos
- [ ] Usei `theme.radius.*` para bordas
- [ ] Ignorei cores/fontes dos protótipos Stitch
- [ ] Segui o padrão de named exports + function declarations

---

**Dúvidas?** Consulte o guia completo em `.agent/workflows/code-style-guide.md`
