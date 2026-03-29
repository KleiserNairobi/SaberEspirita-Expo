---
description: Histórico e Tarefas Pendentes do Projeto (V2 Consolidada)
---

# Roadmap e Tarefas Pendentes - SaberEspirita-Expo (V2)

**Data de Atualização**: 29/03/2026 (Limpeza de itens concluídos e ajuste de UX/UI)
**Fase Atual**: Expansão e Retenção (Pós-Lançamento MVP).

---

## 📊 Resumo Executivo (V2)

| Categoria            | Quantidade | Prioridade |
| -------------------- | ---------- | ---------- |
| 🔴 Alta Prioridade   | 4          | Alta       |
| 🟡 Média Prioridade  | 1          | Média      |
| 🟢 Melhorias (UI/UX) | 1          | Baixa      |
| **TOTAL V2**         | **6**      | -          |

---

## 🔴 Features de Alta Prioridade (Core & Retenção)

### 1. **Engajamento, Gamificação e Loop Espiritual** (Antigo Plano 1.5)

- **Status**: 🔄 EM PROGRESSO
- **Descrição**: Transformar usuários em frequentadores diários através de hábitos estruturados.
- **Tarefas**:
  - **Streak (Ofensiva 🔥)**: Implementar `currentStreak` no Firestore e UI de destaque na Home.
  - **Momento Espírita de Hoje**: Pílula de destaque na Home contendo curadoria de Mensagem + Prece + Quiz rápido.

### 2. **Material Complementar (Módulo Estude)**

- **Status**: 🔄 PENDENTE
- **Descrição**: Adicionar seção de PDFs, links e referências externas dentro das aulas.
- **Tarefas**:
  - Listagem de anexos (`supplementaryMaterials`) consumindo Storage.
  - Criar componente `AttachmentCard` (PDF/Doc/Link).
  - Integração com `expo-file-system` e `expo-sharing` para download e abertura nativa.

### 3. **Aulas Multimídia (Módulo Estude)**

- **Status**: 🔄 PENDENTE
- **Descrição**: Suporte nativo a Vídeo e Áudio nas lições, além do conteúdo literal.
- **Tarefas**:
  - Instalar e configurar pacotes nativos (ex: `expo-video`).
  - Refatorar `LessonPlayer` para identificar dinamicamente `videoUrl` ou `audioUrl`.
  - Implementar mini-player colapsável para aulas em áudio.

### 4. **Paywall e Monetização (Recursos Premium)**

- **Status**: 🔄 PENDENTE
- **Descrição**: Preparar o app para modelo Freemium e assinaturas pagas.
- **Tarefas**:
  - Integrar SDK de assinaturas (**RevenueCat** - `react-native-purchases`).
  - Campo `isPremium: true` no banco e bloqueio de UI (ícone de cadeado 🔒).
  - Implementar tela de Paywall estilizada com planos anuais/mensais.

---

## 🟡 Evolução de Sistema (Média Prioridade)

### 5. **Histórico do Chat com IA**

- **Status**: 🔄 PENDENTE
- **Descrição**: Salvar e exibir o histórico de conversas do usuário com os Guias Mentais no Firestore (estilo ChatGPT).

---

## 🟢 Melhorias (Baixa Prioridade)

### 7. **Fase 7: Polish - Animações e UX**

- **Status**: 🔄 PENDENTE
- **Descrição**: Adicionar micro-animações nas listas, quizzes e transições de tela premium (`Lottie`/`Moti`).

---

## 📋 Recomendações de Próximos Passos (Workflow)

A ordem lógica recomendada para a implementação (onde a feature anterior ajuda na viabilização da próxima):

2. 🎯 **Engajamento**: Finalizar Streaks e Momento Diário (Retenção).
3. 🎯 **Módulo Estude**: Materiais Complementares (PDF/Links infra pronta).
4. 🎯 **Módulo Estude**: Multimídia (Preparar áudio/vídeo).
5. 🎯 **Monetização**: Criar Paywall unindo tudo o que for "Premium".

---

## ✅ Histórico de Conclusões (V2)

- **Chat Contextual (Sr. Allan)**: ✅ Integrado ao final de cada aula via `DoubtCard` para sanar dúvidas (29/03).
- **Glossário Contextual na Aula**: ✅ Implementado com `BottomSheetModal` dinâmico e suporte a sinônimos (29/03).
- **Padronização UX/UI de BottomSheets**: ✅ Hierarquia visual de botões unificada em todo o módulo de estudo (29/03).
- **Avaliação e Feedback Ativo**: ✅ Hook `useRateApp` e BottomSheet integrados (28/03).
- **Consolidação de Player de Áudio**: ✅ Cache dinâmico e TTS estável.
