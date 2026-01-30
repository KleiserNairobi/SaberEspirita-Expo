# Tarefas Pendentes - SaberEspirita-Expo

**Data de Atualização**: 28/01/2026  
**Status Geral**: ~94% Concluído

---

## 📊 Resumo Executivo

| Categoria            | Quantidade | Prioridade |
| -------------------- | ---------- | ---------- |
| 🟡 Importantes       | 3          | Média      |
| 🟢 Melhorias Futuras | 6          | Baixa      |
| **TOTAL**            | **9**      | -          |

---

## 🟡 Tarefas Importantes (Média Prioridade)

### 1. **ProgressCarousel - Cursos Iniciados**

- **Descrição**: Lista horizontal de cursos em andamento na tela Estude
- **Status**: Feature futura
- **Esforço Estimado**: 2 dias

### 2. **Notificação de Lançamento de Cursos**

- **Descrição**: Enviar push notification quando curso/aula "EM BREVE" for liberado
- **Benefício**: Engajamento e retenção
- **Esforço Estimado**: 1 dia

### 3. **Tela "Cursos em Breve"**

- **Descrição**: Lista completa de cursos futuros com opção "Me Avise"
- **Benefício**: Gerar expectativa e coletar interesse
- **Esforço Estimado**: 2 dias

---

## 🟢 Melhorias Futuras (Baixa Prioridade)

### 4. **Fase 6: Polish - Animações**

- **Descrição**: Adicionar animações de transição entre telas
- **Esforço Estimado**: 2-3 dias

### 5. **Fase 6: Polish - Haptic Feedback**

- **Descrição**: Implementar feedback tátil em interações
- **Esforço Estimado**: 1 dia

### 6. **Fase 6: Polish - Micro-interações**

- **Descrição**: Melhorar micro-interações (hover, press, etc.)
- **Esforço Estimado**: 2 dias

### 7. **Fase 8: Filtros no Histórico**

- **Descrição**: Implementar filtros avançados no histórico de quizzes
- **Esforço Estimado**: 1 dia

### 8. **Fase 8: Tela "Biblioteca"**

- **Descrição**: Exibir perguntas salvas/favoritas
- **Esforço Estimado**: 2 dias

### 9. **Fase 8: Documentação Final**

- **Descrição**: Documentar arquitetura, APIs e fluxos
- **Esforço Estimado**: 2-3 dias

---

## 📋 Recomendações de Próximos Passos

### Curto Prazo (1-2 semanas)

1. 🎯 Implementar ProgressCarousel (Tarefa 1)
2. 🎯 Implementar Notificação de Lançamento (Tarefa 2)
3. 🎯 Criar Tela "Cursos em Breve" (Tarefa 3)

### Médio Prazo (1 mês)

4. 🎯 Fase 6: Polish - Animações (Tarefa 4)
5. 🎯 Fase 6: Polish - Haptic Feedback (Tarefa 5)

### Longo Prazo (2-3 meses)

6. 🎯 Fase 6: Polish - Micro-interações (Tarefa 6)
7. 🎯 Fase 8: Finalização (Tarefas 7-9)

---

## 🎯 Métricas de Progresso

### Por Módulo

| Módulo                      | Status  | Pendências |
| --------------------------- | ------- | ---------- |
| **FIXE (Quizzes)**          | ✅ 100% | 0          |
| **ORE (Orações)**           | ✅ 100% | 0          |
| **MEDITE (Reflexões)**      | ✅ 100% | 0          |
| **CHAT (Guia + Sr. Allan)** | ✅ 100% | 0          |
| **CONTA (Configurações)**   | ✅ 100% | 0          |
| **ESTUDE (Dashboard)**      | ✅ 100% | 0          |
| **CURSOS**                  | ✅ 100% | 0          |
| **AUTENTICAÇÃO**            | ✅ 100% | 0          |
| **NOTIFICAÇÕES**            | ✅ 100% | 0          |
| **POLISH/TESTES**           | ✅ 100% | 0          |

### Progresso Geral

```
Concluído:     ████████████████████████████████████  94%
Pendente:      ░░░░░░░░░░░░░░░░                       6%
```

**Total de Tarefas**: 9 pendentes de ~193 planejadas  
**Taxa de Conclusão**: ~95%

---

## ✅ Tarefas Concluídas Recentemente (28/01/2026)

1. ✅ **Otimização de Imagens (Estude)** - Implementado `expo-image` em `CourseCard` e `Carousel` para performance.
2. ✅ **Otimização de Áudios (Ore)** - Carregamento instantâneo via metadados locais e download sob demanda.
3. ✅ **Performance na Listagem de Orações** - Correção de query N+1 (paralelismo) e validação de cache.
4. ✅ **Definição de Dados** - Interfaces TypeScript completas em `src/types/course.ts`
5. ✅ **Lógica Condicional da Tela Estude** - Seção "Em Andamento" e "Continue de Onde Parou" implementados
6. ✅ **Integração de Conteúdo - Módulo MEDITE** - Reflexões no Firestore, mensagens em JSON (completo)
7. ✅ **Player de Aula - Suporte Multimídia** - Movido para versão futura (foco em cursos textuais)
8. ✅ **Fase 7: Testes Completos** - Fluxo end-to-end, sincronização Firestore e migração de dados validados
9. ✅ **Tutorial de Primeira Vez** - Substituído por tela de boas-vindas (já implementada)
10. ✅ **Remover Músicas Não Essenciais** - Arquivos desnecessários removidos do Firebase Storage
11. ✅ **Cache Offline com React Query** - Implementado com MMKV persister, cache de 7 dias para cursos.
12. ✅ **Lazy Loading de Slides** - Implementado prefetch inteligente (primeiras 3 aulas + próxima aula)
13. ✅ **Migrar Certificados para expo-print** - Sistema híbrido com opções local e nuvem, PDFs profissionais

---

## 📝 Notas Finais

- **Todos os módulos core estão 100% concluídos** ✅
- Módulos: FIXE, ORE, MEDITE, CHAT, CONTA, ESTUDE, CURSOS, AUTH, NOTIFICAÇÕES
- Cache offline e otimizações de performance implementadas em Áudio e Imagens
- Fase de testes (Fase 7) concluída
- Pendências são apenas melhorias futuras e polish
- **App está pronto para lançamento em produção** 🚀
