# Arquitetura e Documentação Técnica - SaberEspirita-Expo (v2026)

## 🎯 Visão Geral

O **SaberEspirita-Expo** evoluiu de um simples sistema de quizzes para uma plataforma completa de educação e apoio espiritual. A arquitetura atual foca em **estabilidade nativa**, **automação de build** e uma experiência de usuário rica em mídia e inteligência artificial.

### Tech Stack Consolidada

- **Framework Core**: [React Native](https://reactnative.dev/) (v0.81.5) via [Expo](https://expo.dev/) (SDK 54) utilizando **Continuous Native Generation (CNG)**.
- **Linguagem**: TypeScript (Strict Mode) com tipagem Type-Safe para navegação e dados.
- **Estado & Persistência**:
  - [Zustand](https://github.com/pmndrs/zustand) para estado global síncrono.
  - [MMKV](https://github.com/mrousavy/react-native-mmkv) (via Nitro Modules) para persistência ultra-rápida.
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query) com persistência offline via MMKV.
- **Backend Híbrido (Firebase)**:
  - **SDK JS (v12.6)**: Motor de Auth, Firestore e Storage (estabilidade e facilidade de atualização).
  - **SDK Nativo (@react-native-firebase/analytics)**: Telemetria e tracking preciso de eventos nativos.
- **Notificações**: [OneSignal](https://onesignal.com/) integrado via plugin Expo.
- **Mídia**: [React Native Track Player](https://react-native-track-player.js.org/) para áudio em background e modo imersivo.

---

## �️ Infraestrutura e Automação (DevOps Mobile)

O projeto resolveu o problema do retrabalho nativo através de uma camada de automação robusta localizada na pasta `dev/`:

### Config Plugins (Modificação Nativa Dinâmica)

Em vez de editar as pastas `android/` e `ios/` manualmente, o projeto utiliza:

- `withModularHeaders.js`: Gerencia a compatibilidade de headers Swift/ObjC para o Firebase no iOS.
- `withAndroidForegroundPermissions.js`: Garante conformidade com o Android 14+ para serviços de áudio em foreground.

### Automação de Build

- `patch-android-signature.js`: Injeta automaticamente as credenciais de assinatura (JKS) no Gradle durante o `prebuild`.
- `patches/`: Correções diretas em bibliotecas via `patch-package`, mantendo o código estável mesmo com bugs em dependências externas.

---

## 🧭 Arquitetura de Software (src/)

A organização segue princípios de **Feature-Based Architecture**:

### 1. Camada de Serviços (`src/services/`)

- **Arquipelago do Firebase**: Serviços granulares para cada entidade (Course, Lesson, Prayer, Quiz, Leaderboard).
- **IA Generativa (DeepSeek)**: Integração com LLM via streaming, com personas distintas ("Guia Emocional" vs "Allan Kardec") configuradas via System Prompts em `src/services/prompt/`.
- **Analytics**: Camada unificada que abstrai o Firebase Analytics nativo.

### 2. Navegação em Camadas (`src/routers/`)

- **RootNavigator**: Orquestra o estado de Autenticação.
- **TabNavigator**: O hub principal com 5 abas (Estude, Fixe, Medite, Ore, Conta).
- **Navigators Modulares**: Cada aba possui seu próprio Stack (Ex: `PrayNavigator`, `FixNavigator`), permitindo fluxos complexos sem poluir a rota principal.

### 3. Gamificação e Retenção (`src/pages/fix/`)

O módulo "Fixe" centraliza a lógica de retenção:

- **Daily Challenge**: Desafios diários persistidos localmente.
- **Leaderboard**: Ranking global de usuários integrado ao Firestore.
- **Truth or False**: Mecânica rápida de quiz para micro-aprendizado.

---

## 🧠 Estratégia de Dados

### Persistência e Cache

O app utiliza uma estratégia de cache agressiva para minimizar leituras no Firestore e permitir uso offline:

- Dados de cursos e aulas possuem `staleTime` elevado (24h+).
- O progresso do usuário é sincronizado via `useMutation` com invalidação imediata de cache para garantir UI reativa.

### Gerenciamento de Mídia

O áudio é tratado como cidadão de primeira classe:

- Suporte a áudio em background.
- Integração com controles de mídia do sistema (Lockscreen).
- `audioCacheService.ts` para gerenciar o download e reprodução eficiente de arquivos.

---

## 🔐 Segurança e Performance

- **TypeScript**: 100% de cobertura nos routers e services.
- **MMKV**: Substitui o AsyncStorage para evitar gargalos na ponte (bridge) do React Native.
- **Modular Headers**: Garante que o projeto iOS compile de forma limpa mesmo com a mistura de SDKs JS e Nativo do Firebase.

---

> _Este documento reflete a maturidade alcançada em 2026, onde a automação nativa eliminou o retrabalho e permitiu o crescimento sustentável do app._
