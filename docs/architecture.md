# Arquitetura e Documentação Técnica - SaberEspirita-Expo

## 🎯 Visão Geral

O **SaberEspirita-Expo** é um aplicativo móvel voltado para o aprendizado da Doutrina Espírita. Ele foi desenvolvido com foco em retenção, experiência de usuário premium e arquitetura sustentável de médio a longo prazo.

### Tech Stack Principal

- **Framework Core**: React Native (v0.81) via Expo (v54, Prebuild).
- **Navegação**: React Navigation (v7) contendo Stacks, Tabs e gerenciamento global de Auth.
- **Linguagem**: TypeScript (Strict Mode).
- **Estado Global**: Zustand (persistindo com `react-native-mmkv`).
- **Data Fetching e Cache**: TanStack Query (React Query) integrado ao Firebase.
- **Backend/Baas**: Firebase SDK JS (Authentication, Firestore, Storage).
- **IA Generativa**: Integração com API da DeepSeek (Modelos _chat_ para "Sr. Allan" e "Guia Emocional").

---

## 📂 Estrutura de Pastas e Componentização

O código fonte principal está em `src/`, seguindo os guias de estilo rígidos definidos em `.agent/workflows/`.

### Princípios da Estrutura

- `src/routers/`: Responsável exclusivamente pelas rotas. Nenhuma lógica de UI complexa deve existir aqui.
- `src/pages/`: Ponto de entrada das telas, agrupadas por "Feature" (Ex: `study/`, `pray/`).
  - Telas complexas possuem suas próprias subpastas internas `components/` e `hooks/`.
- `src/components/`: Componentes globais que são reutilizados em mais de um módulo do app (Ex: `Carousel`, `AppInput`).
- `src/services/`: Camada de infraestrutura e fetch de dados externos. Arquipelago do Firebase (`firebase/`), integrações com LLMs (`deepseek/`, `chat/`) e utilitários de mídia (`audio/`).
- `src/stores/`: Lógica de estado global síncrona com Zustand.
- `src/types/`: Definições globais de interfaces de dados (Cursos, Aulas, Progresso, Chat).

---

## 🧭 Navegação (React Navigation)

O aplicativo utiliza uma arquitetura baseada em múltiplos Navigators aninhados e Type-Safety completa declarada em `src/routers/types.ts`.

### Fluxo de Roteamento Principal (`RootNavigator.tsx`)

1. **Verificação de Splash/Onboarding**: O App decide se envia o usuário para a `Welcome` screen.
2. **Auth Stack (`AuthNavigator.tsx`)**: Se o estado de Auth (via Firebase + AuthStore) for nulo, apenas LogIn e Cadastro ficam acessíveis.
3. **App Stack (`AppNavigator.tsx`)**: Protegida. O coração é a `TabNavigator` (Bottom tabs: Study, Fix, Meditate, Pray, Account). A stack principal também abriga páginas Full-Screen e Modais, como `CourseDetails`, `LessonPlayer` e `EmotionalChat`.

---

## 🧠 Gerenciamento de Estado (Zustand)

O app abandonou soluções verbosas (Redux) e abraçou o **Zustand** combinado com **MMKV** para persistência física ultra-sensível:

- **AuthStore** (`authStore.ts`): Armazena dados do Firebase User e session token.
- **ThemeStore** (`themeStore.ts`): Gerencia a preferência do usuário entre Light/Dark/System e injeta dinamicamente na UI global.
- **PreferencesStores** (`prayerPreferencesStore.ts`, `quizFilterStore.ts`, etc): Stores modulares para controlar comportamento das features individuais (Ex: Autoplay de orações, estado de filtros em quizzes).

---

## 🔄 Data Fetching e Caching (React Query)

**Não utilizamos `useEffect` assíncronos para fetch de banco de dados diretamente em componentes.** Todo acesso de leitura ao Firebase passa pelos Hooks do Tanstack Query (`useQuery`).

- **Isolamento**: Os queries ficam isolados em `src/hooks/queries/` (ex: `useCourses.ts`, `useAllCoursesProgress.ts`).
- **Caching (`staleTime`)**: Para lidar com custos de leitura no Firestore e modo offline, o App conta com tempo de "stale" elevado em dados estáticos (ex: Lista de Cursos - 24 horas).
- **Mutações (`useMutation`)**: Ao realizar salvamento de exercícios ou aulas, os queries de progresso são invalidados pelo QueryClient para gerar consistência reativa.

---

## 🤖 Integração com IA (DeepSeek)

O aplicativo introduz assistentes virtuais através da API da **DeepSeek**, divididos em duas personas configuradas por Prompts de Sistema em `src/services/prompt/`:

1. **O Guia Emocional (`EmotionalChat`)**: Prompts configurados com temperatura levemente mais alta (`0.7`) e foco acolhedor.
2. **O Pesquisador Allan Kardec (`ScientificChat`)**: Prompts restritos a respostas doutrinariamente fiéis, configurado com temperatura baixa (`0.3`) e tokens mais longos para respostas teológicas detalhadas.

### Fluxo de Streaming

A integração reside em `src/services/deepseek/api.ts` e utiliza o OpenAI Compatible Endpoint da DeepSeek. A principal API consumida internamente é a `streamDeepSeekChat`, que devolve um `AsyncIterable` da UI, renderizando a resposta em forma de "digitação em tempo real" sem bloquear a tela do usuário.

---

## 🗄 Modelo de Dados e Firebase

Os Services de Firestore em `src/services/firebase/` se orientam por coleções raiz altamente relacionais.

**Principais Collections:**

- `users`: `{uid}`
  - sub-collection: `courseProgress` (Acompanhamento individual dos alunos)
- `courses`: Definição de cursos, níveis (`CourseDifficultyLevel`) e metadados.
  - sub-collection: `lessons` (Organização linear do conteúdo via interface `ILesson`)
- `exercises` e `reflections`: Conteúdos apartados para não poluir leituras na coleção de cursos principais, possibilitando reusabilidade dos desafios no tab "Fixe".
