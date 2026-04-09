---
description: Histórico e Tarefas Pendentes do Projeto (V2 Consolidada)
---

# Roadmap e Tarefas Pendentes - SaberEspirita-Expo (V2)

**Data de Atualização**: 29/03/2026 (Limpeza de itens concluídos e centralização técnica)
**Fase Atual**: Expansão e Retenção (Pós-Lançamento MVP).

---

## 📊 Resumo Executivo (V2)

| Categoria                   | Quantidade | Prioridade |
| -------------------------- | ---------- | ---------- |
| 🔴 Alta Prioridade          | 5          | Alta       |
| 🟡 Média Prioridade         | 1          | Média      |
| 🟢 Melhorias (UI/UX)        | 2          | Baixa      |
| **TOTAL V2**                | **8**      | -          |

---

## 🔴 Features de Alta Prioridade (Core & Retenção)

### 0. **Transformação Módulo Ore (Acolhimento & Personalização)**
- **Status**: 🔄 EM PROGRESSO (Buggy)
- **Descrição**: Implementar jornada fluida de acolhimento emocional com sugestão de prece e ambiente sonoro.
- **Pendências Identificadas:**
  - **Lógica de Persistência**: Corrigir `moodStore` para não sobrescrever `lastMood` instantaneamente na mesma sessão (deve refletir o estado do "retorno").
  - **Automação de Sintonia**: Garantir que o áudio sugerido mude/toque corretamente ao selecionar um humor no `AmbientEnvironmentCard`.
  - **Atrito de UX**: Adicionar botão de "Pular" ou timeout para que o acolhimento não bloqueie o acesso rápido (conforme Plano V3.1).
  - **Assets Visuais**: Substituir placeholders de imagem no `AmbientEnvironmentCard` por backgrounds artísticos reais ou dinâmicos.
  - **Redirecionamento IA**: Validar se o `O Guia` recebe o contexto emocional corretamente e gera a prece prometida.

### 1. **Engajamento, Gamificação e Loop Espiritual**
- **Status**: 🔄 EM PROGRESSO
- **Descrição**: Transformar usuários em frequentadores diários através de hábitos estruturados.
- **Estratégia Backend (Firestore):**
  - Modificar o modelo do usuário `users/{uid}` para suportar: `lastActivityDate` (Timestamp) e `currentStreak` (Number).
- **Estratégia Frontend (Expo):**
  - **Streak (Ofensiva 🔥)**: Exibição na barra de título principal recuperada via Zustand.
  - **Loop de Contexto (Post-Action)**: Refatorar tela de finalização para sugerir ações cruzadas:
    - Oração $\rightarrow$ Sugerir Módulo de Estudo.
    - Aula $\rightarrow$ Sugerir Fixação (Quiz) ou Meditação.

### 2. **Material Complementar (Módulo Estude)**
- **Status**: 🔄 PENDENTE
- **Descrição**: Adicionar seção de PDFs, links e referências externas dentro das aulas.
- **Estratégia Backend (Firestore):**
  - Popular campo `supplementaryMaterials` no modelo `ILesson` (`src/types/course.ts`) com URLs do Storage.
- **Estratégia Frontend (Expo):**
  - **Telas**: Adicionar ícone/aba de "Materiais" no `CourseCurriculum` ou `LessonPlayer`.
  - **Componentes**: Criar `AttachmentCard` (Ícone + Nome + Peso).
  - **Nativo**: Integrar `expo-file-system` e `expo-sharing` para download e abertura.

### 3. **Aulas Multimídia (Módulo Estude)**
- **Status**: 🔄 PENDENTE
- **Descrição**: Suporte nativo a Vídeo e Áudio nas lições, além do conteúdo literal.
- **Estratégia Backend (Firestore):**
  - Usar campos `videoUrl` e `audioUrl` em `ILesson`.
- **Estratégia Frontend (Expo):**
  - **Dependências**: Instalar `expo-video`.
  - **Navegação**: Refatorar `LessonPlayer` para identificar o tipo de conteúdo e renderizar dinamicamente o `VideoPlayer` ou mini-player colapsável para áudio.

### 4. **Paywall e Monetização (Recursos Premium)**
- **Status**: 🔄 PENDENTE
- **Descrição**: Preparar o app para modelo Freemium e assinaturas pagas via **RevenueCat**.
- **Estratégia Backend:**
  - Configurar RevenueCat e injetar field `isPro: boolean` ou Claim no Firestore em `users/{uid}`.
- **Estratégia Frontend (Expo):**
  - **Dependências**: `react-native-purchases`.
  - **Zustand**: Adaptar `authStore.ts` para capturar a _entitlement_ premium em real-time.
  - **Bloqueio UI**: Implementar ícone de cadeado 🔒 em conteúdos `isPremium: true` e redirecionar para tela de Paywall estilizada.

---

## 🟡 Evolução de Sistema (Média Prioridade)

### 5. **Histórico do Chat com IA**
- **Status**: 🔄 PENDENTE
- **Descrição**: Salvar e exibir o histórico de conversas do usuário com os Guias Mentais no Firestore (estilo ChatGPT).

---

## 🟢 Melhorias (Baixa Prioridade)

### 6. **Fase 7: Polish - Animações e UX**
- **Status**: 🔄 PENDENTE
- **Descrição**: Micro-animações nas listas, quizzes e transições de tela premium (`Lottie`/`Moti`).

---

## 📋 Recomendações de Próximos Passos (Workflow)

1. 🎯 **Engajamento**: Finalizar Streaks e Ofensiva.
2. 🎯 **Módulo Estude**: Materiais Complementares (PDF).
3. 🎯 **Módulo Estude**: Multimídia (Vídeo/Áudio).
4. 🎯 **Monetização**: Criar Paywall e integração RevenueCat.

---

## ✅ Histórico de Conclusões (V2)

- **Chat Contextual (Sr. Allan)**: ✅ Integrado via `DoubtCard` ao final da aula (29/03).
- **Glossário Contextual**: ✅ `BottomSheetModal` dinâmico e sinônimos (29/03).
- **Padronização BottomSheets**: ✅ Hierarquia visual unificada (29/03).
- **Avaliação (Rate App)**: ✅ Hook `useRateApp` integrado (28/03).
- **Audio Cache/TTS**: ✅ Consolidação de cache e TTS estável.
