---
description: Guia de estilo de código TypeScript, React Native, Expo
---

# Guia de Estilo de Código - SaberEspirita-Expo

Este documento define os padrões de código, convenções de nomenclatura e boas práticas para o projeto **SaberEspirita-Expo**.

---

## 📋 Índice

1. [TypeScript](#typescript)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Componentes React](#componentes-react)
4. [Gerenciamento de Estado](#gerenciamento-de-estado)
5. [Estilização](#estilização)
6. [Temas](#temas)
7. [Imports](#imports)
8. [Nomenclatura](#nomenclatura)
9. [Boas Práticas](#boas-práticas)

---

## TypeScript

### Configuração Base

- **Modo Strict**: Sempre ativado (`"strict": true`)
- **Path Aliases**: Usar `@/` para referenciar `src/`
  ```typescript
  import { useAppTheme } from "@/hooks/useAppTheme";
  import { DarkTheme } from "@/configs/theme";
  ```

### Tipagem

#### ✅ Sempre tipar explicitamente:

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

#### ❌ Evitar:

- `any` (usar `unknown` se necessário)
- Tipagem implícita em funções públicas
- Enums (preferir union types: `type Theme = "light" | "dark"`)

---

## Estrutura de Arquivos

### Organização de Pastas

```
src/
├── routers/               # Navegadores React Navigation
│   ├── RootNavigator.tsx  # Navegador raiz (Auth vs App)
│   ├── AuthNavigator.tsx  # Stack de autenticação
│   ├── AppNavigator.tsx   # Stack principal do app
│   ├── TabNavigator.tsx   # Navegação por abas (bottom tabs)
│   ├── PrayNavigator.tsx  # Stack do módulo Ore
│   └── types.ts           # Tipos TypeScript para navegação
├── pages/                 # Implementação das Telas (Lógica e UI)
│   └── feature-name/      # Ex: auth, pray, meditate, emotional-chat
│       ├── index.tsx      # Entry point da tela
│       ├── styles.ts      # Estilos da tela
│       ├── components/    # Componentes específicos da tela
│       └── hooks/         # Hooks específicos da tela
├── components/            # Componentes reutilizáveis globais
│   └── ComponentName/
│       ├── index.tsx      # Componente principal
│       └── styles.ts      # Estilos (se necessário)
├── configs/               # Configurações do projeto
│   ├── firebase/          # Configuração do Firebase
│   │   └── firebase.ts
│   └── theme/             # Sistema de temas
│       ├── types.ts
│       ├── light.ts
│       ├── dark.ts
│       └── index.ts
├── contexts/              # Context API providers
├── hooks/                 # Custom hooks globais
├── stores/                # Zustand stores
├── utils/                 # Funções utilitárias
├── services/              # Integração com APIs/Firebase
├── types/                 # Tipos TypeScript globais
└── data/                  # Dados estáticos (JSON, assets)
```

### Convenções de Nomeação de Arquivos

- **Navegadores**: `PascalCase` com sufixo `Navigator` (ex: `RootNavigator.tsx`, `TabNavigator.tsx`)
- **Telas**: Pasta em `kebab-case`, arquivo `index.tsx` (ex: `emotional-chat/index.tsx`)
- **Componentes**: `PascalCase` (ex: `AppInput/index.tsx`)
- **Hooks**: `camelCase` com prefixo `use` (ex: `useAppTheme.ts`)
- **Stores**: `camelCase` com sufixo `Store` (ex: `themeStore.ts`)
- **Tipos**: `PascalCase` ou `types.ts` (ex: `types.ts`, `ChatTypes.ts`)
- **Utilitários**: `camelCase` (ex: `formatDate.ts`)

---

## Componentes React

### Exports: Named vs Default

**Regra Geral**: Preferir **named exports** (`export function`) para todos os componentes.

**Exceção**: Usar **default export** (`export default function`) **APENAS** para:

- Entry point da aplicação (`App.tsx`)

### Arrow Functions vs Function Declarations

**Regra Geral**: Preferir **function declarations** (`function nome() {}`) ao invés de arrow functions.

**Razão**: Melhor legibilidade, stack traces mais claros, e familiaridade para desenvolvedores vindos de linguagens como Java.

**Quando usar Arrow Functions**:

- ✅ Callbacks inline (`.map()`, `.filter()`, `.forEach()`, etc.)
- ✅ Event handlers inline
- ✅ Funções passadas como props
- ✅ Closures que precisam capturar `this` (raro em React moderno)
- ✅ Zustand stores e middlewares

**Quando usar Function Declarations**:

- ✅ Componentes React
- ✅ Custom Hooks
- ✅ Funções utilitárias
- ✅ Handlers de eventos (quando não inline)
- ✅ Qualquer função nomeada e reutilizável

```typescript
// ✅ CORRETO - Function declaration para componente
export function UserCard({ name, email }: UserCardProps) {
  return <View>...</View>;
}

// ✅ CORRETO - Function declaration para handler
function handleSubmit() {
  console.log("Submitted");
}

// ✅ CORRETO - Arrow function para callback
const users = data.map((user) => user.name);

// ✅ CORRETO - Arrow function inline para evento
<Button onPress={() => setCount(count + 1)} />;

// ❌ EVITAR - Arrow function para componente
const UserCard = ({ name, email }: UserCardProps) => {
  return <View>...</View>;
};

// ❌ EVITAR - Arrow function para handler nomeado
const handleSubmit = () => {
  console.log("Submitted");
};
```

### Estrutura Padrão

#### Componentes Reutilizáveis (Named Export)

```typescript
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});
```

#### Telas React Navigation (Named Export)

```typescript
import { View, Text } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

// Named export para telas
export function LoginScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={theme.font.h1}>Login</Text>
    </View>
  );
}
```

#### Navegadores React Navigation (Named Export)

```typescript
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import { LoginScreen } from "@/pages/auth/login";
import { RegisterScreen } from "@/pages/auth/register";

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Named export para navegadores
export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
```

### Padrões de Componentes

#### 1. **Componentes de Tela** (Screens)

- ✅ Usar `export function NomeDaTela()` (named export) para telas em `src/pages/*/index.tsx`
- ✅ Sempre consumir `useAppTheme()` para temas dinâmicos
- ✅ Estilos em arquivo separado `styles.ts` usando `createStyles(theme)`
- ✅ Organizar por módulo funcional em `src/pages/nome-modulo/`
- ✅ Componentes específicos da tela em subpasta `components/`
- ✅ Hooks específicos da tela em subpasta `hooks/`

#### 2. **Navegadores React Navigation**

- ✅ Usar `export function NomeNavigator()` (named export)
- ✅ Sufixo `Navigator` no nome (ex: `AuthNavigator`, `TabNavigator`)
- ✅ Importar telas usando **named import** (ex: `import { LoginScreen } from "@/pages/auth/login"`)
- ✅ Definir tipos TypeScript para rotas (`ParamList`)
- ✅ Organizar em `src/routers/`

#### 3. **Compound Components (Abordagem Híbrida)**

**Quando usar Compound Components:**

Use quando o componente atende a **pelo menos 2** destes critérios:

- ✅ Tem **múltiplas variações** de layout
- ✅ Precisa de **composição flexível**
- ✅ Tem **estado compartilhado** entre sub-componentes
- ✅ Beneficia de **API declarativa**

**Quando usar Props Simples:**

Use quando o componente:

- ✅ Tem **estrutura fixa**
- ✅ Poucas variações (< 5 props)
- ✅ Não precisa de composição dinâmica
- ✅ Foco em **simplicidade**

---

**Exemplo 1: Compound Component (Input Complexo)**

```typescript
// src/components/AppInput/index.tsx
import React, { createContext, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import styles from "./styles";

interface InputContextData {
  value: string;
  error?: string;
  required?: boolean;
}

const InputContext = createContext<InputContextData>({} as InputContextData);

interface AppInputProps {
  children: React.ReactNode;
  value: string;
  error?: string;
  required?: boolean;
  onChangeText: (text: string) => void;
}

function AppInput({
  children,
  value,
  error,
  required,
  onChangeText,
}: AppInputProps) {
  return (
    <InputContext.Provider value={{ value, error, required }}>
      <View style={styles.container}>{children}</View>
    </InputContext.Provider>
  );
}

function Label({ text }: { text: string }) {
  const { required } = useContext(InputContext);
  const { theme } = useAppTheme();

  return (
    <Text style={[theme.font.subtitle2, styles.label]}>
      {text} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
    </Text>
  );
}

function Field(props: TextInputProps) {
  const { value } = useContext(InputContext);
  const { theme } = useAppTheme();

  return (
    <TextInput
      value={value}
      style={[
        theme.font.body1,
        styles.field,
        { borderColor: theme.colors.border },
      ]}
      placeholderTextColor={theme.colors.muted}
      {...props}
    />
  );
}

function Error() {
  const { error } = useContext(InputContext);
  const { theme } = useAppTheme();

  if (!error) return null;

  return (
    <Text style={[theme.font.caption, { color: theme.colors.error }]}>
      {error}
    </Text>
  );
}

function Icon({ name }: { name: string }) {
  const { theme } = useAppTheme();
  return <Ionicons name={name} size={20} color={theme.colors.icon} />;
}

// Composição
AppInput.Label = Label;
AppInput.Field = Field;
AppInput.Error = Error;
AppInput.Icon = Icon;

// Named export
export { AppInput };
```

**Uso:**

```tsx
import { AppInput } from "@/components/AppInput";

<AppInput value={email} error={emailError} required onChangeText={setEmail}>
  <AppInput.Label text="Email" />
  <AppInput.Field keyboardType="email-address" placeholder="seu@email.com" />
  <AppInput.Error />
</AppInput>

// Ou com ícone:
<AppInput value={password} onChangeText={setPassword}>
  <AppInput.Icon name="lock-closed" />
  <AppInput.Label text="Senha" />
  <AppInput.Field secureTextEntry />
</AppInput>
```

**Vantagens:**

- ✅ Composição flexível (com/sem ícone, com/sem erro)
- ✅ Estado compartilhado via Context
- ✅ API declarativa e intuitiva
- ✅ Fácil de estender (adicionar novos sub-componentes)

---

**Exemplo 2: Props Simples (Componente Atual)**

```typescript
// src/components/SettingsItem/index.tsx
import React from "react";
import { Text, TouchableOpacity, View, Switch } from "react-native";

import { ChevronRight, LucideIcon } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import styles from "./styles";

interface SettingsItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export function SettingsItem({
  icon: Icon,
  title,
  subtitle,
  onPress,
  isSwitch,
  switchValue,
  onSwitchChange,
}: SettingsItemProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Icon size={20} color={theme.colors.icon} />
      <View style={styles.content}>
        <Text style={theme.font.subtitle2}>{title}</Text>
        {subtitle && <Text style={theme.font.body2}>{subtitle}</Text>}
      </View>
      {isSwitch ? (
        <Switch value={switchValue} onValueChange={onSwitchChange} />
      ) : (
        <ChevronRight size={20} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}
```

**Uso:**

```tsx
<SettingsItem
  icon={Bell}
  title="Notificações"
  subtitle="Receba alertas"
  isSwitch
  switchValue={enabled}
  onSwitchChange={setEnabled}
/>
```

**Vantagens:**

- ✅ Simples e direto
- ✅ Menos código boilerplate
- ✅ Estrutura fixa e previsível
- ✅ Fácil de entender

---

**Exemplo 3: Quando NÃO usar Compound Components**

```typescript
// ❌ OVERKILL - Componente muito simples para compound pattern
<Button>
  <Button.Icon name="check" />
  <Button.Text>Salvar</Button.Text>
  <Button.Loading />
</Button>

// ✅ MELHOR - Props simples são suficientes
<Button icon="check" text="Salvar" loading={isLoading} />
```

---

**Checklist de Decisão:**

| Critério             | Props Simples         | Compound Components   |
| -------------------- | --------------------- | --------------------- |
| Estrutura            | Fixa                  | Flexível              |
| Variações            | < 5 props             | Múltiplas combinações |
| Composição           | Não necessária        | Essencial             |
| Estado compartilhado | Não                   | Sim                   |
| Complexidade         | Baixa/Média           | Média/Alta            |
| Exemplo              | Button, Avatar, Badge | Input, Card, Modal    |

---

#### 4. **Componentes Funcionais Puros**

- ✅ Sempre tipar props
- ✅ Usar **named exports** (`export function`)
- ✅ Usar **function declarations** (não arrow functions)
- ⚠️ Usar `React.memo()` apenas se houver problemas de performance comprovados

```typescript
// ✅ CORRETO - Function declaration + named export
export function Button({ label, onPress }: ButtonProps) {
  return <TouchableOpacity onPress={onPress}>...</TouchableOpacity>;
}

// ❌ EVITAR - Arrow function + default export
const Button = ({ label, onPress }: ButtonProps) => {
  return <TouchableOpacity onPress={onPress}>...</TouchableOpacity>;
};
export default Button;

// ❌ EVITAR - Arrow function mesmo com named export
export const Button = ({ label, onPress }: ButtonProps) => {
  return <TouchableOpacity onPress={onPress}>...</TouchableOpacity>;
};
```

---

## Gerenciamento de Estado

### Zustand (Preferido)

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

interface MyState {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: "my-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
```

### Context API (Casos Específicos)

- Usar para **autenticação** e **providers globais**
- Evitar para estado que muda frequentemente (usar Zustand)

```typescript
interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth() {
  return useContext(AuthContext);
}
```

---

## Estilização

### Regras Gerais

1. **Separação de estilos baseada em complexidade:**
   - **Telas simples** (< 200 linhas total): estilos no mesmo arquivo (inline com `StyleSheet.create()`)
   - **Telas complexas** (≥ 200 linhas): separar em arquivo `styles.ts`
2. **Sempre usar `StyleSheet.create()`** - Nunca inline objects
3. **Usar tokens do tema** - Aplicar cores, tipografia e espaçamentos do tema
4. **Evitar valores hardcoded** - Usar `theme.colors.*`, `theme.font.*`, `theme.spacing.*`, etc.
5. **PREFERIDO para telas complexas: Usar função `createStyles(theme)`** - Para estilos que dependem do tema

### Estrutura de Arquivos

**Telas simples (< 200 linhas):**

```
ComponentName/
└── index.tsx      # Lógica, JSX e estilos (StyleSheet.create no final)
```

**Telas complexas (≥ 200 linhas):**

```
ComponentName/
├── index.tsx      # Lógica e JSX
└── styles.ts      # Estilos (função createStyles ou export default)
```

---

### Padrão 1: Estilos Dinâmicos com Tema (PREFERIDO)

Use quando os estilos precisam de tokens do tema (cores, fontes, etc.).

**`styles.ts` (Função com Tema):**

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
      ...theme.font.h1,
      color: theme.colors.text,
    },
    subtitle: {
      ...theme.font.body1,
      color: theme.colors.textSecondary,
    },
  });
```

**`index.tsx` (Uso):**

```typescript
import React from "react";
import { View, Text } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

export function MyComponent() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Título</Text>
      <Text style={styles.subtitle}>Descrição</Text>
    </View>
  );
}
```

**Vantagens:**

- ✅ Todos os tokens do tema disponíveis no `styles.ts`
- ✅ JSX mais limpo (sem aplicações inline de tema)
- ✅ Suporte automático a Light/Dark mode
- ✅ Type-safe com TypeScript

---

### Padrão 2: Estilos Estáticos (Apenas quando necessário)

Use apenas para estilos que **não dependem** do tema (ex: dimensões fixas, layouts).

**`styles.ts` (Estático):**

```typescript
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
```

**`index.tsx` (Uso):**

```typescript
import React from "react";
import { View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import styles from "./styles";

export function MyComponent() {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Aplicar tema inline quando necessário */}
    </View>
  );
}
```

---

### Comparação de Padrões

| Critério           | `createStyles(theme)`    | `export default`              |
| ------------------ | ------------------------ | ----------------------------- |
| **Quando usar**    | Estilos dependem do tema | Estilos puramente estruturais |
| **Tokens do tema** | ✅ Dentro do `styles.ts` | ❌ Aplicados inline no JSX    |
| **JSX**            | Mais limpo               | Mais verboso                  |
| **Type-safety**    | ✅ Completo              | ⚠️ Parcial                    |
| **Recomendado**    | ✅ Sim (padrão)          | ⚠️ Apenas se necessário       |

---

### ❌ INCORRETO - Valores hardcoded

```typescript
// NÃO fazer isso - valores hardcoded:
<View style={{ padding: 16, backgroundColor: "#fff" }}>
  <Text style={{ color: "#333", fontSize: 18 }}>Texto</Text>
</View>;

// NÃO fazer isso - estilos no mesmo arquivo:
const styles = StyleSheet.create({
  container: { flex: 1 },
});

// NÃO fazer isso - cores/fontes hardcoded no styles.ts:
export default StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "Oswald_700Bold",
    color: "#000000", // ❌ Use createStyles(theme) e theme.colors.text
  },
});
```

---

## Temas

### Estrutura de Tema

Todos os temas devem implementar a interface `ITheme`:

```typescript
export interface ITheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  font: ThemeFont; // Renomeado de typography para font
  isDark: boolean;
}
```

### Consumo de Tema

**SEMPRE** consumir o tema via `useAppTheme()` hook:

```typescript
import { useAppTheme } from "@/hooks/useAppTheme";
import styles from "./styles";

export default function MyScreen() {
  const { theme, themeType, setThemeType } = useAppTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={theme.font.h1}>Título Principal</Text>
      <Text style={theme.font.body1}>Corpo do texto</Text>
    </View>
  );
}
```

### Tokens de Design Disponíveis

#### Cores (`theme.colors.*`)

- `primary`, `secondary`, `accent`
- `background`, `card`
- `text`, `textSecondary`
- `border`, `icon`, `muted`
- `error`, `success`
- `onPrimary`, `onSecondary`

#### Tipografia (`theme.font.*`)

- `h1`, `h2`, `h3` - Títulos
- `subtitle1`, `subtitle2` - Subtítulos
- `body1`, `body2` - Corpo de texto
- `caption` - Texto pequeno/legendas
- `button` - Texto de botões

**Exemplo de uso:**

```typescript
<Text style={theme.font.h1}>Título</Text>
<Text style={theme.font.body1}>Texto normal</Text>
<Text style={theme.font.caption}>Legenda</Text>
```

---

### ⚠️ ATENÇÃO CRÍTICA: Tipografia no Tema

**A interface `ITheme` NÃO possui a propriedade `font`!**

A interface possui:

- ✅ `typography`: Objeto com `weights` e `sizes`
- ✅ `text()`: Função helper para criar estilos de texto

**❌ INCORRETO - NÃO FUNCIONA:**

```typescript
// ERRO: theme.font não existe!
const styles = StyleSheet.create({
  title: {
    ...theme.font.h1, // ❌ ERRO!
    color: theme.colors.text,
  },
});
```

**✅ CORRETO - USE theme.text():**

```typescript
// Use a função helper theme.text(size, weight, color?)
const styles = StyleSheet.create({
  title: {
    ...theme.text("xxl", "semibold"), // ✅ CORRETO!
  },
  subtitle: {
    ...theme.text("lg", "regular", theme.colors.textSecondary), // ✅ CORRETO!
  },
  body: {
    ...theme.text("md", "regular"), // ✅ CORRETO!
  },
});
```

**Parâmetros de `theme.text()`:**

1. **size**: `"xs"` | `"sm"` | `"md"` | `"lg"` | `"xl"` | `"xxl"` | `"xxxl"`
2. **weight**: `"regular"` | `"medium"` | `"semibold"` | `"bold"`
3. **color** (opcional): Cor do texto (padrão: `theme.colors.text`)

**Exemplo completo correto:**

```typescript
import { StyleSheet } from "react-native";
import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    header: {
      ...theme.text("xxxl", "semibold"),
      marginBottom: theme.spacing.lg,
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
```

---

#### Espaçamento (`theme.spacing.*`)

- `xs` (4), `sm` (8), `md` (16)
- `lg` (24), `xl` (32), `xxl` (48)

**Exemplo de uso:**

```typescript
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md, // 16
    gap: theme.spacing.sm, // 8
  },
});
```

#### Bordas (`theme.radius.*`)

- `xs` (4), `sm` (8), `md` (16)
- `lg` (24), `xl` (32), `full` (999)

**Exemplo de uso:**

```typescript
const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md, // 16
  },
  avatar: {
    borderRadius: theme.radius.full, // 999 (círculo)
  },
});
```

---

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
import { Mail } from "lucide-react-native";

// 3. Imports internos
import { useAppTheme } from "@/hooks/useAppTheme";
import { FilledTextInput } from "@/components/FilledTextInput";
import { useAuth } from "@/contexts/AuthContext";

// 4. Tipos
import type { ITheme } from "@/configs/theme/types";
```

### Path Aliases

- **Sempre usar `@/`** para imports internos
- **Nunca usar caminhos relativos** (`../../`) para arquivos fora da pasta atual

---

## Nomenclatura

### Variáveis e Funções

- **camelCase** para variáveis e funções

  ```typescript
  const userName = "João";

  // Function declaration (preferido)
  function handleLogin() {
    // ...
  }

  // Arrow function (apenas para callbacks)
  const userNames = users.map((user) => user.name);
  ```

### Componentes e Tipos

- **PascalCase** para componentes, interfaces e tipos
  ```typescript
  interface UserData {}
  type ThemeType = "light" | "dark";
  function LoginScreen() {}
  ```

### Constantes

- **UPPER_SNAKE_CASE** para constantes globais
  ```typescript
  const API_BASE_URL = "https://api.example.com";
  const MAX_RETRY_ATTEMPTS = 3;
  ```

### Hooks Personalizados

- **Prefixo `use`** + **camelCase**
- **Function declaration** (não arrow function)

  ```typescript
  // ✅ CORRETO
  export function useAppTheme() {
    const { themeType } = useThemeStore();
    return { theme: getTheme(themeType) };
  }

  // ❌ EVITAR
  export const useAppTheme = () => {
    const { themeType } = useThemeStore();
    return { theme: getTheme(themeType) };
  };
  ```

### Stores (Zustand)

- **Prefixo `use`** + **PascalCase** + **Sufixo `Store`**
  ```typescript
  export const useThemeStore = create<ThemeState>()(...);
  export const useAuthStore = create<AuthState>()(...);
  ```

---

## Boas Práticas

### 1. **Sempre Usar TypeScript Strict**

- Ativar `strict: true` no `tsconfig.json`
- Tipar todas as props, estados e retornos de funções

### 2. **Componentização**

- Componentes devem ter **uma única responsabilidade**
- Extrair lógica complexa para **custom hooks**
- Reutilizar componentes via `src/components/`

### 3. **Performance**

- Usar `FlashList` para listas longas (não `FlatList`)
- Evitar re-renders desnecessários (memoização consciente)
- Usar `react-native-reanimated` para animações

### 4. **Acessibilidade**

- Sempre adicionar `accessibilityLabel` em botões e inputs
- Usar cores com contraste adequado (WCAG AA)

### 5. **Tratamento de Erros**

```typescript
const handleLogin = async () => {
  try {
    await signIn(email, password);
  } catch (err) {
    console.error("Login error:", err);
    Alert.alert("Erro", "Falha ao fazer login");
  }
};
```

### 6. **Async/Await**

- Preferir `async/await` a `.then()/.catch()`
- Sempre tratar erros com `try/catch`
- Usar **function declarations** para funções async nomeadas

```typescript
// ✅ CORRETO - Function declaration
async function fetchUserData(userId: string) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}

// ✅ CORRETO - Arrow function para callback
const loadUsers = async () => {
  const users = await Promise.all(userIds.map((id) => fetchUserData(id)));
};

// ❌ EVITAR - Arrow function para função nomeada exportada
export const fetchUserData = async (userId: string) => {
  // ...
};
```

### 7. **Comentários**

- **Evitar comentários óbvios**
- Comentar **por quê**, não **o quê**
- Usar JSDoc para funções públicas complexas

```typescript
/**
 * Calcula o progresso do usuário em um curso
 * @param completedLessons - Número de aulas concluídas
 * @param totalLessons - Total de aulas do curso
 * @returns Percentual de progresso (0-100)
 */
function calculateProgress(completedLessons: number, totalLessons: number): number {
  return (completedLessons / totalLessons) * 100;
}
```

### 8. **Evitar Código Morto**

- Remover imports não utilizados
- Remover código comentado (usar Git para histórico)
- Limpar logs de debug antes de commit

---

## Checklist de Code Review

Antes de fazer commit, verifique:

- [ ] Código está tipado corretamente (sem `any`)
- [ ] Imports estão organizados e usando `@/`
- [ ] Componentes consomem tema via `useAppTheme()`
- [ ] Estilos usam `StyleSheet.create()`
- [ ] Não há valores hardcoded (cores, espaçamentos)
- [ ] Funções assíncronas têm tratamento de erro
- [ ] Código está formatado (Prettier/ESLint)
- [ ] Sem logs de debug (`console.log`)
- [ ] Nomes de variáveis são descritivos

---

## Ferramentas Recomendadas

- **Linter**: ESLint (configuração Expo)
- **Formatter**: Prettier
- **Debug**: Reactotron (já configurado no projeto)
- **Testes**: React Native Testing Library (futuro)

---

**Última Atualização**: 24/12/2025  
**Versão**: 1.4.0  
**Changelog**: Migração do Expo Router para React Navigation
