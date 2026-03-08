---
description: Histórico e Tarefas Pendentes do Projeto
---

# Roadmap e Tarefas Pendentes - SaberEspirita-Expo (V2)

**Data de Atualização**: 21/02/2026
**Fase Atual**: App em Produção (MVP 100% Concluído). O roadmap representa as métricas de evolução para a **V2 (Expansão e Monetização)**.

---

## 📊 Resumo Executivo (V2)

| Categoria            | Quantidade | Prioridade |
| -------------------- | ---------- | ---------- |
| 🔴 Alta Prioridade   | 4          | Alta       |
| 🟡 Média Prioridade  | 1          | Média      |
| 🟢 Melhorias (UI/UX) | 1          | Baixa      |
| **TOTAL V2**         | **6**      | -          |

---

## 🔴 Novas Features e Monetização (Alta Prioridade)

### 1. **Meditação Guiada (Módulo Medite)** ✅

- **Descrição**: Criação de área para áudios de meditação conduzida. Player em `expo-audio` nativo finalizado com cache de disco dinâmico (`expo-file-system`), padronização estética de UI e painéis de Filtro de Listagem Baseados em Tempo inclusos.
- **Esforço Estimado**: Baixo (Maior facilidade, arquitetura pronta).
- **Status**: **CONCLUÍDO (21/02/2026)**

### 2. **Material Complementar (Módulo Estude)**

- **Descrição**: Adicionar a seção de Materiais Complementares (PDFs/Links) dentro da visualização de Lições/Cursos.
- **Esforço Estimado**: Médio.

### 3. **Aulas Multimídia (Módulo Estude)**

- **Descrição**: Implementar player de Vídeo e Áudio dentro do currículo além das aulas puramente literais.
- **Esforço Estimado**: Médio-Alto.

### 4. **Paywall e Recursos Pagos (Monetização)**

- **Descrição**: Preparar o aplicativo para lidar com usuários _Freemium_ e assinantes/compradores (recursos Pro). Controlar acesso aos novos materiais (vídeo, material de apoio).
- **Esforço Estimado**: Alto (Integração RevenueCat ou In-App Purchases).

---

## 🟡 Evolução de Sistema (Média Prioridade)

### 5. **Histórico do Chat com IA**

- **Descrição**: Salvar e exibir o histórico de conversas do usuário com os Guias (estilo ChatGPT) no Firestore.
- **Esforço Estimado**: Médio.

### 6. **Avaliação de Cursos e Aulas**

- **Descrição**: Coletar feedback do usuário em formato de avaliação (estrelas 1-5) mais comentário, salvando ativamente no Firestore e utilizando `BottomSheetMessage` para a captura de input.
- **Esforço Estimado**: Médio.

---

## 🟢 Melhorias Futuras (Baixa Prioridade)

### 7. **Fase 7: Polish - Animações**

- **Descrição**: Adicionar micro-animações nas listas, quizzes e transições de tela.
- **Esforço Estimado**: Baixo-Médio.

---

## 📋 Recomendações de Próximos Passos (Workflow)

A ordem lógica recomendada para a implementação (onde a feature anterior ajuda na viabilização da próxima):

1. 🎯 **Módulo Medite**: Meditações Guiadas (Feature isolada e fácil).
2. 🎯 **Módulo Estude**: Materiais Complementares (PDF/Links na infra atual).
3. 🎯 **Módulo Estude**: Multimídia (Preparar suporte a vídeo/áudio).
4. 🎯 **Monetização**: Criar Paywall, unindo lógica dos itens 2 e 3 como "Premium".
5. 🎯 **Chat**: Implementar arquivamento e Histórico.

---

## 🎯 Métricas de Progresso (V2 - Monetização e Expansão)

### Novo Ciclo: 6 Tarefas de Expansão

```text
Concluído:     ████                                      10%
Pendente:      ██████████████████████████████████        90%
```

**Total de Tarefas V2**: 5 pendentes (3 Core, 1 Evolução, 1 Perfumaria).

---

## ✅ Histórico do MVP (Finalizado)

- **App Lançado em Produção!** 🎉
- Infraestrutura 100% concluída (Zustand, React Query, Navegação, Componentização).
- Documentação Técnica de Arquitetura finalizada.
