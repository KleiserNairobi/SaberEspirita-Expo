# Especificação UX/UI: Sistema de Exercícios Obrigatórios

**Data de Criação**: 10/01/2026
**Última Atualização**: 11/01/2026
**Objetivo**: Implementar sistema híbrido que incentive a conclusão de exercícios sem bloquear o progresso do usuário

---

## 🎯 Problema a Resolver

**Situação Atual:**

- Exercícios são opcionais na prática, mas obrigatórios para certificado
- Usuário pode pular exercícios sem entender as consequências
- Não há feedback visual claro sobre exercícios pendentes
- Falta de incentivo para completar exercícios

**Requisitos:**

1. ✅ Exercícios são **obrigatórios** para obter certificado
2. ✅ Usuário pode **pular** exercícios e fazer depois
3. ✅ Feedback visual **claro** sobre o que falta
4. ✅ Incentivo para completar **agora** vs **depois**

---

## 💡 Solução Proposta: Abordagem Híbrida

Combinar **3 estratégias complementares**:

1. **Modal de Decisão Informativa** (após aula)
2. **Indicadores Visuais no Currículo** (badges)
3. **Barra de Progresso Dupla** (aulas + exercícios)

---

## 📱 Implementação Detalhada

### **COMPONENTE 1: Modal de Decisão Informativa**

**Quando exibir:**

- Após o usuário finalizar todos os slides de uma aula
- Apenas se a aula tiver exercício associado (`exerciseId` presente)

**Layout:**

```
┌─────────────────────────────────────┐
│         🎯 Exercício de Fixação     │
│                                     │
│  Teste seus conhecimentos sobre     │
│  esta aula para garantir seu        │
│  certificado ao final do curso!     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ⚠️ Importante                │   │
│  │ Os exercícios são obrigatórios│  │
│  │ para obter o certificado.    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   FAZER EXERCÍCIO AGORA     │   │ ← Primary (verde)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Fazer Depois              │   │ ← Outline (secundário)
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Comportamento:**

- **"FAZER EXERCÍCIO AGORA"**: Navega para `CourseQuiz` passando `exerciseId`
- **"Fazer Depois"**:
  - Marca aula como concluída
  - Salva exercício como pendente no progresso
  - Volta ao currículo
  - Mostra toast: "Você pode fazer o exercício depois no currículo"

**Arquivo:**

- `src/pages/study/lesson-player/components/ExerciseDecisionModal/index.tsx`

---

### **COMPONENTE 2: Indicadores Visuais no Currículo**

**Objetivo:** Mostrar claramente quais aulas têm exercícios pendentes

**Estados Visuais das Aulas:**

| Estado                             | Ícone                  | Badge                             | Descrição                  |
| ---------------------------------- | ---------------------- | --------------------------------- | -------------------------- |
| **Concluída + Exercício OK**       | `CheckCircle` (verde)  | -                                 | Aula e exercício completos |
| **Concluída + Exercício Pendente** | `CheckCircle` (verde)  | `⚠️ Exercício pendente` (laranja) | Aula feita, exercício não  |
| **Em Andamento**                   | `PlayCircle` (primary) | -                                 | Aula em progresso          |
| **Disponível**                     | `PlayCircle` (outline) | -                                 | Aula disponível            |
| **Bloqueada**                      | `Lock` (muted)         | -                                 | Aula bloqueada             |

**Layout do Card com Exercício Pendente:**

```
┌─────────────────────────────────────┐
│ ✓ 2. Os Princípios Básicos          │
│    18 min • Concluída               │
│    ⚠️ Exercício pendente            │ ← Badge laranja
└─────────────────────────────────────┘
```

**Comportamento ao Clicar:**

- Se exercício pendente → Navega direto para o **primeiro exercício pendente** da aula (`CourseQuiz` com `exerciseId`)
- Se aula completa (com exercício) → Permite revisar aula ou refazer exercício

**Arquivo:**

- `src/pages/study/course-curriculum/index.tsx`
- `src/pages/study/course-curriculum/components/LessonCard/index.tsx`

---

### **COMPONENTE 3: Barra de Progresso Dupla**

**Objetivo:** Gamificação e clareza sobre o que falta para o certificado

**Layout:**

```
┌─────────────────────────────────────┐
│ Introdução à Doutrina Espírita      │
│                                     │
│ Progresso das Aulas        100%    │
│ ████████████████████████████        │ ← Verde
│                                     │
│ Progresso dos Exercícios    50%    │
│ ██████████████░░░░░░░░░░░░░░        │ ← Laranja
│                                     │
│ ⚠️ Complete os exercícios para      │
│    desbloquear o certificado        │
│                                     │
│ 2 de 2 aulas concluídas             │
│ 1 de 2 exercícios concluídos        │
│    (Baseado em stats.exerciseCount) │
└─────────────────────────────────────┘
```

**Lógica de Cálculo:**

```typescript
// Progresso de Aulas
const lessonsProgress = (completedLessons.length / totalLessons) * 100;

// Progresso de Exercícios
// IMPORTANTE: Usar total do curso para evitar > 100%
const totalExercises = course.stats.exerciseCount;
const completedExercises = exerciseResults.filter((r) => r.passed).length;
const exercisesProgress = Math.min(100, (completedExercises / totalExercises) * 100);

// Elegibilidade para Certificado
const certificateEligible = lessonsProgress === 100 && exercisesProgress === 100;
```

**Arquivo:**

- `src/pages/study/course-curriculum/index.tsx`
- `ProgressSummaryCard.tsx`

---

## 🔄 Fluxo Sequencial de Múltiplos Exercícios

**Cenário**: Uma aula pode ter múltiplos exercícios (p.ex. 3 exercícios).

**Comportamento em QuizResult:**

1.  **Verificação de Próximo**: Ao terminar um exercício, o sistema verifica se há outro exercício pendente na mesma aula.
2.  **BottomSheet de Continuação**:
    - Se houver próximo: Exibe mensagem "Exercício X/Y completo! Deseja continuar agora?"
    - Botão "Próximo Exercício": Navega para o próximo exercício
    - Botão "Fazer Depois": Volta para o currículo
3.  **Botão "Parar"**: Oculto durante o fluxo de curso para evitar interrupção acidental, exceto no último ou via BottomSheet.

---

## 🔧 Serviços a Criar/Modificar

### **`progressService.ts` (modificar)**

**Funções atualizadas:**

```typescript
/**
 * Salva resultado de exercício (CRÍTICO)
 * Calcula porcentagem baseada no TOTAL do curso (stats.exerciseCount)
 */
export async function saveExerciseResult(
  courseId: string,
  lessonId: string,
  exerciseId: string,
  score: number,
  passed: boolean,
  userId?: string
): Promise<void>;
```

---

## 📅 Status da Implementação

✅ **Fase 1: Modal de Decisão** - Concluído
✅ **Fase 2: Indicadores Visuais** - Concluído
✅ **Fase 3: Barra Dupla + Certificado** - Concluído
✅ **Fase 4: Fluxo Sequencial** - Concluído
✅ **Correção de Bugs**: - Persistência de dados (`saveExerciseResult`) - Cálculo de porcentagem 200% (`stats.exerciseCount`) - Navegação com ID correto (`exerciseId`)

---

**Referências:**

- `task.md` - Checklist detalhado de tarefas realizadas
- `walkthrough.md` - Resumo de alterações e correções de bugs
