# Saber Espírita - Expo App

Versão moderna e reimaginada do aplicativo **Saber Espírita**, construída utilizando as tecnologias mais recentes do ecossistema React Native e Expo.

Este projeto representa a evolução do **SaberEspirita-Cli** (focado apenas em quizzes). Aqui, o objetivo é aumentar a retenção de usuários expandindo o escopo para **Educação e Aprendizado**.

## 🎯 Objetivo e Evolução

A versão anterior (CLI) focava exclusivamente em "testar conhecimentos" via quizzes. Percebemos que apenas testar não era suficiente para manter os usuários engajados a longo prazo.

**A nova proposta (Expo) une:**

1.  **Cursos Completos**: Módulos de aprendizado estruturado sobre a Doutrina Espírita.
2.  **Quizzes (Legado aprimorado)**: A mecânica de testes continua, mas agora integrada aos cursos para validação do aprendizado.
3.  **Interface Premium**: Uma nova experiência visual para encantar e reter.

## 📱 Funcionalidades

- **Cursos & Aulas**: Conteúdo didático organizado em trilhas de aprendizado.
- **Quizzes Gamificados**: Testes de conhecimento (feature migrada e melhorada do projeto anterior).
- **Arquitetura Modular**: Organização por módulos funcionais (auth, pray, meditate, emotional-chat, etc.).
- **Navegação**: React Navigation com stacks e bottom tabs.
- **Autenticação**: Login e Registro integrados com Firebase Auth.
- **Proteção de Rotas**: Redirecionamento inteligente entre áreas públicas e privadas.
- **Temas**: Suporte nativo a Dark/Light mode com persistência.
- **Armazenamento Local**: MMKV para performance máxima.

## 🛠 Tech Stack

Principais tecnologias utilizadas:

- **Core**: [React Native](https://reactnative.dev/) (v0.81) com [Expo](https://expo.dev/) (v54).
- **Navegação**: [React Navigation](https://reactnavigation.org/) (v7) com Native Stack e Bottom Tabs.
- **Gerenciamento de Estado**: [Zustand](https://github.com/pmndrs/zustand) para estado global.
- **Backend / BaaS**: Firebase (JS SDK Oficial v12.6).
  > **Decisão Técnica Importante**: Diferente do projeto CLI que usava `react-native-firebase`, optamos pelo **SDK JS Oficial** nesta versão. Embora o SDK nativo tenha mais recursos, ele traz complexidade de manutenção e quebras frequentes em atualizações do React Native. O SDK JS é mais leve, fácil de instalar e garante maior estabilidade a longo prazo no ecossistema Expo.
- **Armazenamento Local**: `react-native-mmkv` (via Nitro Modules) para persistência ultra-rápida.
- **Estilização**: Sistema de tema customizado com tokens de design.
- **Animações**: `react-native-reanimated` para animações fluidas.
- **Ícones**: `lucide-react-native` para ícones modernos e consistentes.

## 📂 Estrutura do Projeto

A estrutura segue uma arquitetura modular com React Navigation:

```
SaberEspirita-Expo/
├── src/
│   ├── routers/                      # Navegadores React Navigation
│   │   ├── RootNavigator.tsx        # Navegador raiz (Auth vs App)
│   │   ├── AuthNavigator.tsx        # Stack de autenticação (Login, Register)
│   │   ├── AppNavigator.tsx         # Stack principal do app
│   │   ├── TabNavigator.tsx         # Bottom tabs (Study, Pray, Meditate, Fix, Account)
│   │   ├── PrayNavigator.tsx        # Stack do módulo Ore
│   │   └── types.ts                 # Tipos TypeScript para navegação
│   │
│   ├── pages/                        # Implementação das telas (organizadas por módulo)
│   │   ├── auth/                    # Módulo de autenticação
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── pray/                    # Módulo Ore (orações)
│   │   │   ├── index.tsx            # Tela principal
│   │   │   ├── styles.ts            # Estilos
│   │   │   ├── components/          # Componentes específicos
│   │   │   ├── hooks/               # Hooks específicos
│   │   │   ├── category/            # Tela de categoria
│   │   │   └── prayer/              # Tela de oração individual
│   │   ├── meditate/                # Módulo Medite
│   │   ├── emotional-chat/          # Módulo Pergunte ao Guia
│   │   ├── study/                   # Módulo Estude
│   │   ├── fix/                     # Módulo Fixe
│   │   └── account/                 # Módulo Conta/Configurações
│   │
│   ├── components/                   # Componentes visuais reutilizáveis
│   │   ├── AppBackground/
│   │   ├── AppInput/
│   │   ├── LegalHeader/
│   │   ├── LegalSection/
│   │   ├── SettingsItem/
│   │   ├── DailyMessageCard/
│   │   ├── AskGuideCard/
│   │   └── ...
│   │
│   ├── configs/                      # Configurações globais
│   │   ├── theme/                   # Sistema de temas (light.ts, dark.ts, types.ts)
│   │   └── firebase/                # Configuração do Firebase
│   │
│   ├── stores/                       # Stores Zustand
│   │   ├── authStore.ts             # Estado de autenticação
│   │   ├── themeStore.ts            # Estado de tema
│   │   └── ...
│   │
│   ├── hooks/                        # Custom hooks globais
│   │   ├── useAppTheme.ts           # Hook de tema
│   │   └── ...
│   │
│   ├── services/                     # Serviços e integrações
│   │   ├── deepseek/                # Integração DeepSeek AI
│   │   ├── chat/                    # Serviços de chat
│   │   └── ...
│   │
│   ├── contexts/                     # Context API providers
│   ├── types/                        # Tipos TypeScript globais
│   ├── data/                         # Dados estáticos (JSON, prayers, etc.)
│   ├── utils/                        # Funções utilitárias
│   └── assets/                       # Imagens e recursos
│
├── App.tsx                           # Entry point da aplicação
├── android/                          # Código nativo Android (gerado via prebuild)
├── ios/                              # Código nativo iOS (gerado via prebuild)
├── assets/                           # Assets globais (ícone, splash)
├── app.json                          # Configuração do Expo
├── package.json                      # Dependências
└── tsconfig.json                     # Configuração TypeScript
```

### Organização Modular

Cada módulo em `src/pages/` segue a estrutura:

```
modulo-nome/
├── index.tsx      # Tela principal (named export)
├── styles.ts      # Estilos usando createStyles(theme)
├── components/    # Componentes específicos do módulo
└── hooks/         # Hooks específicos do módulo
```

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (instalado globalmente ou via npx)
- **Xcode** (para iOS) ou **Android Studio** (para Android)

### Instalação

1.  Clone o repositório:

```bash
git clone <repository-url>
cd SaberEspirita-Expo
```

2.  Instale as dependências:

```bash
npm install
```

### Executando o Projeto

Este projeto utiliza **módulos nativos** (MMKV via Nitro Modules), portanto **requer prebuild** para gerar as pastas nativas `android/` e `ios/`.

#### Desenvolvimento com Prebuild

**iOS:**

```bash
npm run ios
```

Este comando executa automaticamente:

1. `expo prebuild` (se necessário)
2. Compila o projeto nativo iOS
3. Inicia o Metro bundler
4. Abre o simulador iOS

**Android:**

```bash
npm run android
```

Este comando executa automaticamente:

1. `expo prebuild` (se necessário)
2. Compila o projeto nativo Android
3. Inicia o Metro bundler
4. Abre o emulador Android

#### Apenas Metro Bundler (sem compilação nativa)

Se você já compilou o app anteriormente e só quer atualizar o código JavaScript:

```bash
npm start
```

Depois pressione:

- `a` para Android (requer app já instalado)
- `i` para iOS (requer app já instalado)
- `w` para Web

### Scripts Disponíveis

```bash
npm start          # Inicia o Metro bundler
npm run ios        # Compila e roda no iOS
npm run android    # Compila e roda no Android
npm run web        # Roda na web

# Qualidade de código
npm run lint       # Verifica erros de linting
npm run lint:fix   # Corrige erros de linting automaticamente
npm run format     # Formata código com Prettier
npm run type-check # Verifica tipos TypeScript
npm run validate   # Executa type-check + lint + format:check
```

## 🔧 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Adicione um app Web ao projeto
3. Copie as credenciais de configuração
4. Atualize o arquivo `src/configs/firebase.ts` com suas credenciais

## 📝 Observações Importantes

- Este projeto utiliza **Expo Prebuild** devido ao uso de módulos nativos (`react-native-mmkv`, `react-native-nitro-modules`).
- As pastas `android/` e `ios/` são **geradas automaticamente** e não devem ser commitadas no Git (estão no `.gitignore`).
- Para adicionar novos módulos nativos, execute `npx expo prebuild --clean` para regenerar as pastas nativas.
- **Foco na Retenção**: Toda nova feature deve pensar em como manter o usuário estudando por mais tempo.
- O projeto usa **MMKV** para armazenamento local de alta performance, substituindo AsyncStorage.

## 🎨 Sistema de Temas

O app possui suporte completo a temas com três modos:

- **Light**: Tema claro
- **Dark**: Tema escuro
- **System**: Segue o tema do sistema operacional

O tema é persistido localmente e aplicado automaticamente em toda a aplicação.

## 🔐 Autenticação

O sistema de autenticação utiliza:

- **Firebase Auth** para gerenciamento de usuários
- **MMKV** para persistência local da sessão
- **Zustand** para gerenciamento de estado global
- Redirecionamento automático entre rotas públicas e privadas

## 📱 Navegação

A navegação utiliza **React Navigation** com arquitetura em camadas:

### Estrutura de Navegadores

1. **RootNavigator**: Gerencia autenticação (Auth vs App)
2. **AuthNavigator**: Stack de autenticação (Login, Register)
3. **AppNavigator**: Stack principal com tabs e modais (FAQ, Privacy, Terms, EmotionalChat)
4. **TabNavigator**: Bottom tabs com 5 abas principais:
   - Study (Estude)
   - Fix (Fixe)
   - Meditate (Medite)
   - Pray (Ore)
   - Account (Conta)
5. **PrayNavigator**: Stack do módulo Ore (Home → Category → Prayer)

### Proteção de Rotas

- Redirecionamento automático baseado no estado de autenticação (Zustand)
- Usuários não autenticados são redirecionados para AuthNavigator
- Usuários autenticados acessam AppNavigator

### Tipagem Type-Safe

Todos os navegadores possuem tipos TypeScript definidos em `src/routers/types.ts`:

```typescript
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// ... outros tipos
```
