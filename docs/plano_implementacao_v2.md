# Planos de Implementação - V2 (Monetização e Expansão)

O escopo atual gira em torno da transição do app para um formato robusto e preparado para recursos freemium/premium.

---

## 🎧 Plano 1: Meditação Guiada (Módulo Medite) - ✅ CONCLUÍDO

**Objetivo:** Adicionar meditações em áudio no ecossistema do Medite, que hoje só possui textos/reflexões.

**Estratégia Backend (Firestore):**

- Criadas interface Tipagem `IMeditation` e serviço `src/services/firebase/meditationService.ts`.
- Modelo esperado em banco: `id`, `title`, `description`, `durationMinutes`, `audioUrl`, `author`, `categoryId`, `isPremium`.

**Estratégia Frontend (Expo):**

1. **[Telas]** Na `MeditateHome`, adicionado **Segmented Buttons** alternando visualizações.
2. **[Telas]** Refatorado `AllMeditationsScreen` com design espelhado. Hook React Query injetado.
3. **[Telas]** Criado `MeditationPlayer` consumindo `expo-audio` nativamente (Sem mocks).

---

## 🔁 Plano 1.5: Engajamento, Gamificação e Loop Espiritual

**Objetivo:** Transformar as 111 credenciais ativas em usuários diários recorrentes, aproveitando o ecossistema existente, antes de investir em funcionalidades densas (vídeos, paywall). O foco é reter o usuário construindo um hábito espiritual.

**Estratégia Backend (Firestore & Configs):**

- Modificar o modelo do usuário `users/{uid}` para suportar o acompanhamento de consistência diária: `lastActivityDate` (Timestamp) e `currentStreak` (Number).
- Adicionar ou adequar, no arquivo de constantes, o rastreio de um conteúdo diário unificado.

**Estratégia Frontend (Expo):**

1. **[Telas/Copywriting]** Rebatizar os "Cursos" para **"Séries Espirituais"** ou **"Trilhas de Estudo"**. No card, em vez da % de progresso, exibir estimativas atraentes como "3 min/lide" ou "Restam 12 min".
2. **[Telas - AppNavigator/Home]** Implementar o Componente **"Momento Espírita de Hoje"**. Uma pílula de destaque na Home que entrega uma curadoria de 2 minutos contendo uma Mensagem Curta + Oração + Quiz, instigando o cumprimento diário.
3. **[Componentes - Loop]** Refatorar o componente de "Post-Action" (Tela/Modal de finalização). Quando o usuário concluir:
   - Uma Oração $\rightarrow$ Sugerir aprofundar com um Módulo de Estudo (Ex: Mensagem Guia).
   - Uma Aula $\rightarrow$ Sugerir fixação ou meditação (Quiz da Lição ou Reflexão atrelada).
4. **[Gamificação]** Exibição de "Ofensiva" (Streak 🔥) na barra de título principal, baseada no campo `currentStreak` registrado no Firebase e recuperado no Zustand. Requer atualização do contador toda vez que o usuário interage e consome conteúdo.

---

## 📚 Plano 2: Materiais Complementares (Módulo Estude)

**Objetivo:** Permitir que as Aulas/Cursos tenham referências anexadas (PDFs, Planilhas, Textos de Apoio) visíveis e baixáveis.

**Estratégia Backend (Firestore):**

- O modelo de banco da `ILesson` em `src/types/course.ts` JÁ possui o campo `supplementaryMaterials`. Precisamos apenas popular e garantir que os URLs apontem pro Storage.

**Estratégia Frontend (Expo):**

1. **[Telas]** Na visualização do Curso (`CourseCurriculum`) ou da própria Aula (`LessonPlayer`), criar um ícone/aba de "Materiais".
2. **[Componentes]** Criar um componente `AttachmentCard` mostrando o Ícone (PDF/Doc/Link), Nome e Peso (se aplicável).
3. **[Nativo]** Integrar com `expo-file-system` e `expo-sharing` para permitir baixar e abrir os PDFs complementares no celular.

---

## 🎬 Plano 3: Suporte Multimídia (Módulo Estude)

**Objetivo:** Aulas além dos Slides de texto. Adicionar capacidade nativa de rodar Aulas em Vídeo e escutar Aulas em Áudio.

**Estratégia Backend (Firestore):**

- A interface `ILesson` JÁ possui os campos `videoUrl` e `audioUrl`. Precisam virar dados obrigatórios condicionados ao Tipo do Curso/Aula.

**Estratégia Frontend (Expo):**

1. **[Dependencies]** Instalar pacote sólido de vídeo para EXPO se não houver um bom: `expo-video` ou `react-native-video`.
2. **[Telas]** Refatorar o `LessonPlayer` atual (que só lê slides) para identificar dinamicamente:
   - Se a lesson ter vídeo -> exibir `VideoPlayer` no topo + Slides/Resumo em baixo.
   - Se a lesson ter áudio -> exibir mini-player colapsável.

---

## 💰 Plano 4: Paywall & Recursos Pagos

**Objetivo:** Integrar lógica de assinaturas.

**Estratégia Backend:**

- Escolher provedor (recomendação forte: **RevenueCat** ou Custom Firebase com Stripe).
- No Firestore `users/{uid}`, injetar Claim/Field `isPro: boolean`.

**Estratégia Frontend (Expo):**

1. **[Dependencies]** `react-native-purchases` (RevenueCat SDK).
2. **[Zustand]** Adaptar `authStore.ts` para capturar a _entitlement_ (permissão premium) real-time.
3. **[Regras]** Modificar as requisições (`useCourses`, `useMeditations`). Tudo que tiver `isPremium: true` e o usuário não for PRO, ao clicar, exibe um Botão de Trava 🔒 em vez de Play.
4. **[Telas]** Tela final de Paywall: "Seja Premium" com os planos anuais/mensais, e links das Lojas Apple/Google.
