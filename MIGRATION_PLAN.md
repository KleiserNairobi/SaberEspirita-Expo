# Plano de Migração: SaberEspirita-Cli para SaberEspirita-Expo

Este documento detalha o roteiro para migrar as funcionalidades do projeto legado (CLI) para a nova arquitetura (Expo), integrando as novas features de Cursos.

## 🎯 Visão Geral

- **Origem**: App React Native CLI com React Navigation e Firebase Nativo. Foco exclusivo em Quizzes.
- **Destino**: App Expo Managed com Expo Router e Firebase JS SDK. Foco em Educação (Cursos + Quizzes) e Retenção.

---

## 1. Configuração e Infraestrutura (Base)

O projeto Expo já foi iniciado (`SaberEspirita-Expo`). A base está pronta, mas precisa garantir as dependências core.

- [x] Setup Expo Router.
- [x] Configuração de Fontes (Oswald, Barlow).
- [ ] **Ação**: Instalar e configurar `firebase` (JS SDK) e `react-native-mmkv` (se ainda não estiverem configurados).
- [ ] **Ação**: Configurar variáveis de ambiente (`.env`) com credenciais do Firebase.

## 2. Autenticação e Usuários

Migração da lógica de login e cadastro.

- **CLI**: Usava `react-native-firebase/auth`.
- **Expo**: Usará `firebase/auth` (JS SDK) + Persistência via `react-native-async-storage` ou adaptador MMKV.

**Tarefas:**

1.  Implementar `AuthContext` ou `useAuthStore` (Zustand) no Expo.
2.  Recriar telas de **Login** e **Registro** usando os novos componentes de UI.
3.  Migrar a coleção de usuários no Firestore (garantir que novos campos necessários para "Cursos" sejam criados no primeiro login).

## 3. Banco de Dados e Serviços (Firestore)

Camada crítica. Migrar do SDK Nativo para o JS SDK é manual.

- **CLI**: `src/services/firestore.ts` (API Nativa).
- **Expo**: Criar `src/services/firebase/` (API JS).

**Mapeamento de Funções a Migrar:**

| Função CLI                       | Ação no Expo  | Observação                                                                                                     |
| :------------------------------- | :------------ | :------------------------------------------------------------------------------------------------------------- |
| `getCategories`                  | **Migrar**    | Adaptar para `getDocs(collection(...))`                                                                        |
| `getSubcategories`               | **Migrar**    | Manter filtro `where`                                                                                          |
| `getQuiz`                        | **Migrar**    | Estrutura do documento se mantém                                                                               |
| `getUserCompletedSubcategories`  | **Adaptar**   | Renomear para incluir status de Cursos também?                                                                 |
| `saveUserCompletedSubcategories` | **Migrar**    | Usar `arrayUnion` do JS SDK                                                                                    |
| `getUserHistory`                 | **Migrar**    | Manter coleção `users_history`                                                                                 |
| `updateUserScore`                | **Refatorar** | Idealmente mover para **Cloud Functions** para segurança, ou migrar lógica JS mantendo no client por enquanto. |
| `getLeaderboard`                 | **Migrar**    | Query simples de ordenação                                                                                     |

**Nova Arquitetura de Cursos:**

- Criar novas coleções: `courses`, `modules`, `lessons`.
- Estruturar relacionamento: Curso -> Módulos -> Aulas -> Quiz (opcional ao final da aula).

## 4. Navegação (React Navigation)

Estrutura modular utilizando **React Navigation v7** com navegadores nativos.

- **Hierarquia de Navegadores:**
  1.  **RootNavigator**: Controla fluxo Auth vs App
  2.  **AuthNavigator**: Login e Registro
  3.  **AppNavigator**: Stack principal das telas autenticadas
  4.  **TabNavigator**: Navegação por abas (bottom tabs)
  5.  **Navegadores de Módulo**: Stacks específicos (ex: PrayNavigator)

- **Estrutura Atual de Navegação:**

```
RootNavigator (src/routers/RootNavigator.tsx)
├── Auth → AuthNavigator
│   ├── Login
│   └── Register
└── App → AppNavigator
    ├── Tabs → TabNavigator (Bottom Tabs)
    │   ├── StudyTab → StudyPlaceholderScreen
    │   ├── FixTab → FixPlaceholderScreen
    │   ├── MeditateTab → MeditatePlaceholderScreen
    │   ├── PrayTab → PrayNavigator (Native Stack)
    │   │   ├── PrayHome             # Tela principal de orações
    │   │   ├── PrayCategory         # Lista de orações por categoria
    │   │   └── Prayer               # Detalhes da oração individual
    │   └── AccountTab → AccountScreen
    ├── FAQ                           # Modal/Stack de FAQ
    ├── Privacy                       # Modal/Stack de Privacidade
    └── Terms                         # Modal/Stack de Termos
```

- **Estrutura de Pastas Atual:**

```
src/
├── routers/                          # ✨ NOVA: Navegadores React Navigation
│   ├── RootNavigator.tsx            # Navegador raiz (Auth vs App)
│   ├── AuthNavigator.tsx            # Navegador de autenticação
│   ├── AppNavigator.tsx             # Navegador principal do app
│   ├── TabNavigator.tsx             # Navegador de abas (Bottom Tabs)
│   ├── PrayNavigator.tsx            # Navegador do módulo ORE
│   └── types.ts                     # Tipos TypeScript para navegação
│
├── pages/                            # Implementação das telas (Lógica + UI)
│   ├── auth/                        # Telas de autenticação
│   │   ├── login/
│   │   │   └── index.tsx
│   │   └── register/
│   │       └── index.tsx
│   ├── study/                       # ⏳ Módulo ESTUDE (Placeholder)
│   │   └── index.tsx
│   ├── fix/                         # ⏳ Módulo FIXE (Placeholder)
│   │   └── index.tsx
│   ├── meditate/                    # ⏳ Módulo MEDITE (Placeholder)
│   │   └── index.tsx
│   ├── pray/                        # ✅ Módulo ORE (Completo)
│   │   ├── index.tsx                # PrayHome
│   │   ├── styles.ts
│   │   ├── category/                # PrayCategory
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── prayer/                  # Prayer (detalhes)
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── components/              # Componentes do módulo ORE
│   │   │   ├── AmbientPlayer/
│   │   │   ├── FilterBottomSheet/
│   │   │   ├── MomentCard/
│   │   │   ├── PrayerListItem/
│   │   │   └── SearchBar/
│   │   └── hooks/                   # Hooks específicos do módulo
│   │       ├── useFeaturedPrayers.ts
│   │       ├── usePrayer.ts
│   │       ├── usePrayerCategories.ts
│   │       └── usePrayersByCategory.ts
│   └── account/                     # ✅ Módulo CONTA (Completo)
│       ├── index.tsx                # Tela principal de conta
│       ├── styles.ts
│       ├── constants.ts
│       ├── faq/                     # FAQ
│       │   ├── index.tsx
│       │   └── constants.ts
│       ├── privacy/                 # Privacidade
│       │   ├── index.tsx
│       │   └── constants.ts
│       ├── terms/                   # Termos
│       │   ├── index.tsx
│       │   └── constants.ts
│       ├── components/
│       │   ├── AccountHeader/
│       │   ├── PreferenceItem/
│       │   └── ...
│       └── hooks/
│
├── components/                       # Componentes visuais reutilizáveis
│   ├── AnimatedTabBar/              # Tab bar customizada com animações
│   ├── AppBackground/               # Background padrão do app
│   ├── AppInput/                    # Input compound component
│   ├── Carousel/                    # Carrossel genérico
│   ├── DismissKeyboard/             # Wrapper para fechar teclado
│   ├── FilledTextInput/             # Input preenchido
│   ├── LegalHeader/                 # Header para páginas legais
│   ├── LegalSection/                # Seção para páginas legais
│   ├── SettingsItem/                # Item de configuração
│   ├── SettingsSection/             # Seção de configurações
│   ├── Slider/                      # Slider genérico
│   ├── SliderItem/                  # Item do slider
│   └── TabBarButton/                # Botão customizado da tab bar
│
├── services/                         # Integração com APIs/Firebase
│   └── firebase/
│       └── prayerService.ts         # ✅ Serviço de orações (Firestore)
│
├── stores/                           # Stores Zustand
│   ├── authStore.ts                 # ✅ Estado de autenticação
│   ├── themeStore.ts                # ✅ Estado de tema
│   ├── preferencesStore.ts          # ✅ Preferências do usuário
│   ├── prayerFavoritesStore.ts      # ✅ Favoritos de orações
│   ├── prayerPreferencesStore.ts    # ✅ Preferências de orações
│   └── ambientPlayerStore.ts        # ✅ Player de áudio ambiente
│
├── types/                            # Definições de tipos TypeScript
│   └── prayer.ts                    # ✅ Tipos do módulo ORE
│
├── configs/                          # Configurações globais
│   ├── theme/                       # ✅ Sistema de temas
│   │   ├── types.ts
│   │   ├── light.ts
│   │   ├── dark.ts
│   │   └── index.ts
│   └── firebase/
│       └── firebase.ts              # ✅ Configuração do Firebase
│
├── hooks/                            # Custom hooks
│   └── useAppTheme.ts               # ✅ Hook de tema
│
├── data/                             # Dados estáticos e mocks
│   ├── Biblioteca.tsx               # Dados da biblioteca
│   └── SliderData.tsx               # Dados do slider
│
├── utils/                            # Funções utilitárias
├── assets/                           # Imagens e recursos
└── app.backup-expo-router/          # 🗂️ Backup da estrutura Expo Router
```

**Observações sobre a estrutura atual:**

- ✅ **Navegação modular** com React Navigation v7
- ✅ **Separação clara**: `routers/` para navegação, `pages/` para implementação
- ✅ **Módulo ORE completo**: 3 telas, 5 componentes, 4 hooks, serviço Firebase
- ✅ **Módulo CONTA completo**: Account, FAQ, Terms, Privacy
- ✅ **Sistema de temas** completo com Light/Dark mode
- ✅ **6 Stores Zustand**: Auth, Theme, Preferences, Prayer-related
- ✅ **13 Componentes reutilizáveis** incluindo AnimatedTabBar
- ⏳ **3 Módulos pendentes**: ESTUDE, FIXE, MEDITE (atualmente placeholders)

## 5. Migração de Features (Passo a Passo)

### Fase 0: Design System & Theming

- [x] **Configuração de Temas (`src/themes`)**:
  - Definir tokens completos: Colors, Spacing, Typography (Oswald/Barlow), Border Radius.
  - Implementar variantes Light e Dark.
- [x] **Gerenciamento de Estado (Temas)**:
  - Criar `useThemeStore` (Zustand) para gerenciar preferência do usuário.
  - Configurar persistência com `react-native-mmkv`.
- [x] **Hooks**:
  - Criar `useAppTheme` para consumo simplificado nos componentes.

### Fase 1: Core e Auth

- [x] Implementar Serviço de Auth (Firebase JS).
- [x] Telas de Login/Registro funcionais.
- [x] Proteção de rotas (Redirecionar para Login se não autêntico).
- [x] Persistência de sessão com MMKV.
- [x] Store Zustand para gerenciamento de autenticação.

### Fase 2: Módulo FIXE (Quizzes & Gamificação)

- [ ] **Integração Legada**: Migrar modelos e dados do Firestore (`Category`, `Quiz`, `UserHistory`).
- [ ] **Tela FIXE (Dashboard)**:
  - **Seção 1: Desafio Diário**:
    - Lógica para gerar/selecionar 5 perguntas do dia.
    - Card com Streak (Sequência de dias).
    - Botão "Iniciar" direto.
  - **Seção 2: Quizzes por Curso**:
    - Listagem vertical de cursos disponíveis para quiz.
    - Botão "Fazer Quiz" para cada item.
  - **Seção 3: Meu Progresso**:
    - Resumo estatístico (Acertos totais).
    - Exibição de Conquistas (Badges).
    - Link para "Placar Completo" (Leaderboard).
- [ ] **Fluxo de Quiz**:
  - Tela de Execução (Feedback visual imediato).
  - Tela de Resultados (Ao final, com opção de revisão).
- [ ] **Leaderboard**: Tela dedicada com Ranking Global/Amigos.

### Fase 3: Módulo ESTUDE (Cursos & Home)

- [ ] **Definição de Dados**: Modelos para `Course`, `Lesson`, `UserProgress`.
- [ ] **Tela ESTUDE (Dashboard)**:
  - **Lógica Condicional**:
    - _Com Progresso_: Exibe "Em Andamento" e "Continue de Onde Parou".
    - _Sem Progresso_: Exibe "Populares" (Layout de Descoberta).
  - **Componentes**:
    - `Header`: "Olá, [Nome]!" (Subtítulo varia conforme estado).
    - `ProgressCarousel`: Lista horizontal de cursos iniciados (Img, Título, Barra de Progresso, Botão Continuar).
    - `ResumeCard`: Card de ação rápida para a última aula vista.
    - `LibraryGrid`: Grade de navegação rápida (4 itens: Cursos, Conceitos, Verdade ou Mentira, Sr. Allan [Em Breve]).
    - `DiscoveryCarousel`: (Apenas sem progresso) Cursos populares para iniciar.
- [ ] **Player de Aula**:
  - Suporte a Texto (Markdown/HTML), Vídeo (Expo Video) e Áudio.
  - Navegação entre aulas (Anterior/Próximo).

### Fase 4: Módulos MEDITE e ORE (Novas Features)

- [x] **Módulo ORE**: ✅ **98% Concluído** (apenas Firebase Storage de áudios pendente)
- [/] **Módulo MEDITE**: 🚧 **Em Implementação** (40% concluído)
  - **Plano Detalhado**: Ver `implementation_plan.md` (criado em 23/12/2025)
  - **Estrutura Simplificada Aprovada**:
    1. ✅ **Header**: "Medite" + subtítulo "Encontre paz e orientação interior"
    2. ✅ **Mensagem do Dia**: Card premium implementado
       - ✅ Componente `DailyMessageCard` criado
       - ✅ Sistema de mensagens diárias baseado no dia do ano
       - ✅ 7 imagens de fundo rotativas (JPEG 1280x720px)
       - ✅ Parsing de citação + autor
       - ✅ Botão de compartilhar integrado
       - ✅ Design premium com gradiente e texto em itálico
       - ✅ Linha decorativa + aspas estilizadas
    3. ✅ **Pergunte ao Guia**: Card de entrada implementado
       - ✅ Componente `AskGuideCard` criado
       - ✅ Layout horizontal: ícone de bússola + texto
       - ✅ Botão "CONVERSAR" com estilo secundário (verde claro)
       - ✅ Preparado para navegação futura
       - ✅ Análise completa do módulo EmotionalChat do CLI documentada
       - 📄 Documentação: `emotional_chat_analysis.md`
    4. ❌ ~~Coleção de Pensamentos~~: Removida (redundante)
    5. ⏳ **Textos para Reflexão**: Pendente
       - [ ] Criar componente de lista
       - [ ] Definir estrutura de dados
       - [ ] Popular conteúdo inicial
  - **Decisões de Design**:
    - Remover botão "favoritar" de Mensagem do Dia (sem tela de favoritos)
    - Remover "Coleção de Pensamentos" (redundante com Mensagem do Dia)
    - Reutilizar componentes de lista do módulo ORE
  - **Implementações Concluídas**:
    - ✅ Página `meditate/index.tsx` criada com ScrollView
    - ✅ Componente `DailyMessageCard` com design premium
    - ✅ Componente `AskGuideCard` seguindo padrão do app
    - ✅ Utilitário `getDailyMessage()` para seleção de mensagem
    - ✅ 7 imagens de fundo para dias da semana
    - ✅ Sistema de compartilhamento nativo
  - **Pendências**:
    - [ ] Implementar tela de chat EmotionalChat
    - [ ] Migrar serviços do CLI (DeepSeek API, intention detector)
    - [ ] Criar coleção Firestore: `reflections`
    - [ ] Popular conteúdo de textos para reflexão
    - [ ] Implementar lista de "Textos para Reflexão"
- [ ] **Integração de Conteúdo**: Definir fonte de dados (Firestore ou JSON estático inicial) para Mensagens e Textos.
  - Ações de Curtir (Favoritar) e Compartilhar.
  - **Seção 2: Pergunte ao Guia**:
    - Interface "Placeholder" acolhedora (Feature futura via AI).
    - Botão "Conversar" (inicialmente levando a um formulário ou info).
  - **Seção 3: Pensamentos**:
    - Coleção de citações curtas em cards verticais.
    - Filtros de Tags (#Fé, #Esperança, etc.).
  - **Seção 4: Reflexões**:
    - Lista de leitura com artigos/textos médios.
- [x] **Tela ORE (Foco Espiritual)** - ✅ **CONCLUÍDO**:
  - [x] **Navegação**: PrayNavigator com 3 telas (PrayHome, PrayCategory, Prayer)
  - [x] **Arquitetura de Dados**:
    - [x] Interfaces TypeScript (`IPrayer`, `IPrayerCategory`, `IPrayerCategoryLink`)
    - [x] Serviço Firebase (`prayerService.ts`) com 4 funções principais:
      - `getPrayerCategories()`: Busca categorias de orações
      - `getPrayersByCategory(categoryId)`: Busca orações por categoria
      - `getPrayerById(prayerId)`: Busca oração específica
      - `getFeaturedPrayers()`: Busca orações em destaque
    - [x] 4 Custom Hooks React Query:
      - `usePrayerCategories`: Gerencia categorias
      - `usePrayersByCategory`: Gerencia orações por categoria
      - `useFeaturedPrayers`: Gerencia orações em destaque
      - `usePrayer`: Gerencia oração individual
  - [x] **Stores Zustand**:
    - [x] `prayerFavoritesStore`: Gerencia favoritos (persistido com MMKV)
    - [x] `prayerPreferencesStore`: Preferências de filtros
    - [x] `ambientPlayerStore`: Player de áudio ambiente
  - [x] **Tela 1: PrayHome** - Dashboard de Orações:
    - [x] Header com título "Ore" + subtítulo "Para o Momento"
    - [x] Seção "Momentos de Oração": Scroll horizontal com 8 categorias
    - [x] MomentCards com ícones customizados (lucide-react-native):
      - Sunrise (Ao Acordar), Moon (Ao Dormir), HeartPulse (Diário)
      - Users (Por Alguém), HandHeart (Por Ânimo), Sparkles (Por Cura)
      - BookOpen (Por Gratidão), Heart (Por Paz)
    - [x] Seção "Em Destaque": Lista de orações featured com favoritos
    - [x] Seção "Ambiente de Sintonia": Player de áudio integrado
  - [x] **Tela 2: PrayCategory** - Lista de Orações por Categoria:
    - [x] Header centralizado com ícone grande (80px) + efeito de vibração (anéis concêntricos)
    - [x] Título + subtítulo descritivo por categoria
    - [x] Barra de ferramentas horizontal:
      - Botão voltar
      - Barra de busca com filtragem em tempo real
    - [x] Cards de oração limpos focados no conteúdo
    - [x] Exibição de autor E fonte (formato: "Autor • Fonte")
    - [x] Sistema de favoritos integrado (coração)
    - [x] Bottom Sheet de filtros (por autor, fonte, favoritos)
  - [x] **Tela 3: Prayer** - Detalhes da Oração:
    - [x] Visualização completa do conteúdo da oração
    - [x] Informações de autor e fonte
    - [x] Ações: Favoritar, Compartilhar
    - [x] Botão de leitura em voz alta (Text-to-Speech)
  - [x] **5 Componentes Personalizados**:
    - [x] `MomentCard`: Card de momento com ícone circular + gradiente
    - [x] `PrayerListItem`: Item da lista com título, autor, fonte, favorito
    - [x] `SearchBar`: Barra de busca com ícone e placeholder
    - [x] `FilterBottomSheet`: Bottom sheet de filtros avançados
    - [x] `AmbientPlayer`: Player de áudio com controles e visualização
  - [x] **Padronização Visual Completa**:
    - [x] Design premium com modo dark/light adaptativo
    - [x] Todos os ícones circulares padronizados (borderRadius: 20px)
    - [x] Efeito de "vibração espiritual" nos ícones de categoria (3 anéis concêntricos)
    - [x] Componente `SettingsItem` com ícones circulares
    - [x] Remoção de emojis do `PRAYER_MOMENTS`
    - [x] Uso de tokens do tema em todos os componentes
  - [ ] **Pendente - Integração Mobile**:
    - [x] ~~Implementação do Backend Firebase~~ - ✅ **Já existe no SaberEspirita-Web**
      - Coleções: `prayers`, `prayer_categories`, `prayer_category_links`
      - Firebase Firestore configurado e populado
    - [x] ~~População de dados reais de orações~~ - ✅ **Já populado no Web**
    - [x] ~~Implementação de Text-to-Speech~~ - ✅ **Já implementado no Mobile**
      - Utilitário `src/utils/tts.ts` com expo-speech
      - Funções: `speakText()`, `stopSpeaking()`, `isSpeaking()`
      - Integrado na tela `Prayer` (src/pages/pray/prayer/index.tsx)
    - [x] ~~Player de Áudio Ambiente~~ - ✅ **Implementado no Mobile**
      - Componente `AmbientPlayer` com expo-audio
      - Store `ambientPlayerStore` gerenciando estado
      - Reprodução, pausa, troca de faixas funcionando
      - URLs de teste: Bensound (temporário)
    - [x] ~~Conectar app Expo ao Firebase~~ - ✅ **Testado e Funcionando**
      - `prayerService.ts` conectado ao Firestore
      - Queries retornando dados reais
      - Orações sendo carregadas corretamente do backend
    - [ ] **TODO Firebase Storage**: Áudios Ambiente de Sintonia
      - [ ] Configurar Firebase Storage no projeto
      - [ ] Selecionar e baixar músicas clássicas royalty-free:
        - Fontes recomendadas: Musopen, IMSLP, Free Music Archive
        - Sugestões: Clair de Lune, Lago dos Cisnes, Ave Maria, Moonlight Sonata
        - **Importante**: Verificar que GRAVAÇÕES são domínio público/CC0
      - [ ] Criar estrutura de pastas no Storage: `/ambient/`
      - [ ] Upload de arquivos MP3 para Firebase Storage
      - [ ] Criar script de upload automatizado (opcional)
      - [ ] Atualizar URLs em `AmbientPlayer/index.tsx` com URLs do Firebase Storage
      - [ ] Documentar licenças em `CREDITS.md` ou similar
      - [ ] Remover URLs temporárias do Bensound

### Fase 5: Módulo CONTA (Menu & Configurações)

- [x] **Migração do Menu Legado (`src/pages/Menu/index.tsx`)**:
  - [x] **Cabeçalho**: Foto e Nome do Usuário (Link para editar perfil).
  - [x] **Grupo 1: Preferências**:
    - [x] Alterar Tema (Claro/Escuro/Sistema).
    - [x] Efeitos Sonoros (Switch On/Off).
  - [x] **Grupo 2: Notificações**:
    - [x] Notificação de Atualização do App (Switch On/Off).
    - [x] Notificação do Curso (Switch On/Off).
  - [x] **Grupo 3: Suporte**:
    - [x] Fale Conosco (Email).
    - [x] Perguntas Frequentes (FAQ) - **Migrado e atualizado para nova realidade do app**.
  - [x] **Grupo 4: Legal**:
    - [x] Termos de Uso.
    - [x] Política de Privacidade.
  - [x] **Grupo 5: Ações**:
    - [x] Avaliar App (Link loja).
    - [x] Siga-nos (Redirecionar para Instagram).
    - [x] Compartilhar App.
    - [x] Sair (Logout).
  - ✅ _Removidos_: "Criar quiz" (Fica no Admin), "Chat Emocional" (Substituído por Medite/Guia).
- [x] **Funcionalidade**: Persistência de preferências locais (Zustand + MMKV).
- [x] **Páginas Auxiliares**:
  - [x] FAQ implementado com componentes reutilizáveis (LegalHeader, LegalSection).
  - [x] Terms e Privacy implementados seguindo mesmo padrão.
  - [x] Conteúdo do FAQ atualizado para refletir plataforma de educação (não apenas quiz).

## 6. UI/UX e Design System

Aproveitar a migração para limpar o visual.

- Abandonar estilos legados globais.
- Usar componentes atômicos em `src/components` (Button, Card, Input).
- Padronizar temas com o `ThemeContext` já criado (Cores, Tipografia).

## 7. Decisões Técnicas

- **Firebase SDK**: Usar JS SDK pela facilidade de manutenção.
- **Estado**: Adotar Zustand para tudo (Auth, Player de Curso, Estado do Quiz).
- **Performance**: Usar `FlashList` para listas longas (Ranking, Histórico).

---

**Próximo Passo Imediato**: Confirmar estrutura de dados dos Cursos e iniciar implementação da Fase 1 (Auth).

---

## 📝 Histórico de Atualizações

### 23/12/2025 - Atualização da Documentação Pós-Migração

- ✅ **Documentação atualizada para refletir migração para React Navigation**
- **Mudanças principais**:
  - Seção "Navegação" atualizada com hierarquia de navegadores React Navigation v7
  - Estrutura de pastas documentada refletindo nova organização:
    - `src/routers/`: 5 navegadores (Root, Auth, App, Tab, Pray)
    - `src/pages/`: Implementações de telas (auth, study, fix, meditate, pray, account)
    - `src/components/`: 13 componentes reutilizáveis
    - `src/stores/`: 6 stores Zustand
  - Detalhamento completo do módulo ORE (3 telas, 5 componentes, 4 hooks, serviços)
  - Status de cada fase atualizado
  - Adição de nota técnica explicando decisão da migração
- ✅ **Identificação de recursos já implementados no SaberEspirita-Web**:
  - Backend Firebase do módulo ORE já existe e está populado
  - Coleções: `prayers`, `prayer_categories`, `prayer_category_links`
- ✅ **Confirmação de recursos já implementados no Mobile**:
  - Text-to-Speech implementado com `expo-speech` (`src/utils/tts.ts`)
  - Integrado na tela Prayer com botão de narração
  - **Pendente**: Testar conexão real com Firebase e validar carregamento de orações

### 22/12/2025 - Migração para React Navigation

- ✅ **Migração completa de Expo Router para React Navigation**
- **Decisão técnica**: Mudança de file-based routing para navegação programática
- **Razões**:
  - Maior controle e flexibilidade na navegação entre módulos
  - Melhor suporte para navegação modular (PrayNavigator, futuro CourseNavigator)
  - Documentação mais madura e comunidade maior
  - Experiência prévia da equipe
- **Implementações**:
  - Criação de `src/routers/` com 5 navegadores
  - Migração de todas as telas para `src/pages/`
  - Backup da estrutura Expo Router em `src/app.backup-expo-router/`
  - Atualização de `App.tsx` com RootNavigator
  - Configuração de Bottom Tabs com AnimatedTabBar customizada

### 21/12/2025 - Refinamento Completo do Módulo ORE (Preces)

- ✅ **Módulo ORE implementado e refinado no projeto Expo (Mobile)**
- **Principais conquistas**:
  - **Redesign da Tela de Categoria**:
    - Header centralizado com ícone grande (80px) + efeito de vibração (anéis concêntricos)
    - Título + subtítulo descritivo por categoria
    - Barra de ferramentas horizontal (voltar + busca)
    - Cards limpos sem ícone
  - **Padronização Visual**:
    - Todos os ícones circulares (borderRadius: 20px)
    - Remoção de emojis do `PRAYER_MOMENTS`
    - Componente `SettingsItem` com ícones circulares
  - **Melhorias de Conteúdo**:
    - Exibição de autor E fonte (formato: "Autor • Fonte")
    - Títulos atualizados ("Para o Momento", "Em Destaque")
  - **Efeito de Vibração nos Ícones**:
    - 3 anéis concêntricos com degradê radial
    - Alta visibilidade e acessibilidade
- **Arquivos modificados**: `Pray/index.tsx`, `Pray/category/[id].tsx`, `category/styles.ts`, `PrayerListItem`, `SettingsItem`, `prayer.ts`
- **Pendente**: Integração com Firebase
