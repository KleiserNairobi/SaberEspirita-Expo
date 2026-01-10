# Especificação UX/UI: Sistema de Exercícios Obrigatórios

**Data de Criação**: 10/01/2026  
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
- Apenas se a aula tiver exercício associado (`quizId` presente)

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

- **"FAZER EXERCÍCIO AGORA"**: Navega para `CourseQuiz`
- **"Fazer Depois"**:
  - Marca aula como concluída
  - Salva exercício como pendente no progresso
  - Volta ao currículo
  - Mostra toast: "Você pode fazer o exercício depois no currículo"

**Arquivo a criar:**

- `src/pages/study/lesson-player/components/ExerciseDecisionModal/index.tsx`
- `src/pages/study/lesson-player/components/ExerciseDecisionModal/styles.ts`

**Props:**

```typescript
interface ExerciseDecisionModalProps {
  visible: boolean;
  lessonTitle: string;
  onPressNow: () => void;
  onPressLater: () => void;
}
```

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

- Se exercício pendente → Navega direto para o exercício
- Se aula completa (com exercício) → Permite revisar aula ou refazer exercício

**Arquivo a modificar:**

- `src/pages/study/course-curriculum/index.tsx`
- `src/pages/study/course-curriculum/components/LessonCard/index.tsx`

**Dados necessários no progresso:**

```typescript
IUserCourseProgress {
  // ... campos existentes
  pendingExercises: string[]; // IDs de lessonId com exercícios pendentes
}
```

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
└─────────────────────────────────────┘
```

**Lógica de Cálculo:**

```typescript
// Progresso de Aulas
const lessonsProgress = (completedLessons.length / totalLessons) * 100;

// Progresso de Exercícios
const totalExercises = lessons.filter((l) => l.quizId).length;
const completedExercises = exerciseResults.filter((r) => r.passed).length;
const exercisesProgress = (completedExercises / totalExercises) * 100;

// Elegibilidade para Certificado
const certificateEligible = lessonsProgress === 100 && exercisesProgress === 100;
```

**Estados Condicionais:**

1. **Tudo Completo (100% + 100%)**:

   ```
   ✅ Parabéns! Você completou o curso
      e está elegível para o certificado.

   [OBTER CERTIFICADO]
   ```

2. **Aulas Completas, Exercícios Pendentes**:

   ```
   ⚠️ Complete os exercícios para
      desbloquear o certificado

   [VER EXERCÍCIOS PENDENTES]
   ```

3. **Em Progresso**:
   ```
   Continue estudando para completar
   o curso e obter seu certificado!
   ```

**Arquivo a modificar:**

- `src/pages/study/course-curriculum/index.tsx`
- Criar componente `ProgressSummaryCard`

---

## 🔄 Fluxos de Navegação

### **Fluxo 1: Fazer Exercício Agora**

```
LessonPlayer (último slide)
  ↓ (clica "FINALIZAR AULA")
ExerciseDecisionModal
  ↓ (clica "FAZER EXERCÍCIO AGORA")
CourseQuiz
  ↓ (completa exercício)
QuizResult
  ↓ (clica "CONTINUAR")
CourseCurriculum (atualizado, sem badge)
```

### **Fluxo 2: Fazer Exercício Depois**

```
LessonPlayer (último slide)
  ↓ (clica "FINALIZAR AULA")
ExerciseDecisionModal
  ↓ (clica "Fazer Depois")
CourseCurriculum (com badge "⚠️ Exercício pendente")
  ↓ (clica na aula com badge)
CourseQuiz
  ↓ (completa exercício)
QuizResult
  ↓ (clica "CONTINUAR")
CourseCurriculum (atualizado, sem badge)
```

### **Fluxo 3: Tentar Obter Certificado sem Exercícios**

```
CourseCurriculum (100% aulas, 50% exercícios)
  ↓ (clica "OBTER CERTIFICADO" - desabilitado)
CertificateBlockedModal
  ↓ (mostra exercícios pendentes)
  ↓ (clica "VER EXERCÍCIOS PENDENTES")
CourseCurriculum (scroll para primeira aula com badge)
```

---

## 🎨 Componentes a Criar/Modificar

### **Novos Componentes (3)**

1. **`ExerciseDecisionModal`**
   - Path: `src/pages/study/lesson-player/components/ExerciseDecisionModal/`
   - Props: `visible`, `lessonTitle`, `onPressNow`, `onPressLater`

2. **`ProgressSummaryCard`**
   - Path: `src/pages/study/course-curriculum/components/ProgressSummaryCard/`
   - Props: `lessonsProgress`, `exercisesProgress`, `certificateEligible`

3. **`CertificateBlockedModal`**
   - Path: `src/pages/study/course-curriculum/components/CertificateBlockedModal/`
   - Props: `visible`, `pendingExercises`, `onClose`, `onViewPending`

### **Componentes a Modificar (2)**

1. **`LessonPlayerScreen`**
   - Adicionar lógica para exibir `ExerciseDecisionModal`
   - Salvar exercício como pendente se usuário escolher "Fazer Depois"

2. **`LessonCard`** (no currículo)
   - Adicionar badge de exercício pendente
   - Ajustar navegação ao clicar (direto para exercício se pendente)

---

## 📊 Estrutura de Dados Atualizada

### **`IUserCourseProgress` (atualizado)**

```typescript
interface IUserCourseProgress {
  userId: string;
  courseId: string;

  // Progresso de Aulas
  completedLessons: string[]; // IDs das aulas concluídas
  lastLessonId: string;
  lessonsCompletionPercent: number; // 0-100

  // Progresso de Exercícios (NOVO)
  pendingExercises: string[]; // IDs de lessonId com exercícios pendentes
  exerciseResults: IExerciseResult[]; // Resultados dos exercícios
  exercisesCompletionPercent: number; // 0-100

  // Certificação
  certificateEligible: boolean;
  certificateIssued: boolean;
  certificateId?: string;
  certificateIssuedAt?: Date;

  // Metadados
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
}

interface IExerciseResult {
  lessonId: string;
  quizId: string;
  score: number; // 0-100
  passed: boolean; // score >= passingGrade
  attemptedAt: Date;
}
```

---

## 🔧 Serviços a Criar/Modificar

### **`progressService.ts` (modificar)**

**Novas funções:**

```typescript
/**
 * Marca exercício como pendente (usuário escolheu "Fazer Depois")
 */
export async function markExerciseAsPending(
  courseId: string,
  lessonId: string,
  userId?: string
): Promise<void>;

/**
 * Remove exercício da lista de pendentes (após conclusão)
 */
export async function removeExerciseFromPending(
  courseId: string,
  lessonId: string,
  userId?: string
): Promise<void>;

/**
 * Salva resultado de exercício
 */
export async function saveExerciseResult(
  courseId: string,
  lessonId: string,
  quizId: string,
  score: number,
  passingGrade: number,
  userId?: string
): Promise<void>;

/**
 * Verifica elegibilidade para certificado
 */
export async function checkCertificateEligibility(
  courseId: string,
  userId?: string
): Promise<boolean>;
```

---

## 🎯 Critérios de Aceitação

### **Modal de Decisão**

- [ ] Exibido apenas quando aula tem exercício
- [ ] Botão "FAZER AGORA" navega para quiz
- [ ] Botão "Fazer Depois" marca exercício como pendente
- [ ] Toast exibido ao escolher "Fazer Depois"

### **Indicadores no Currículo**

- [ ] Badge laranja visível em aulas com exercício pendente
- [ ] Clicar em aula com badge navega direto para exercício
- [ ] Badge desaparece após completar exercício

### **Barra de Progresso Dupla**

- [ ] Mostra progresso de aulas separado de exercícios
- [ ] Cores distintas (verde para aulas, laranja para exercícios)
- [ ] Mensagem condicional baseada no status
- [ ] Botão "OBTER CERTIFICADO" desabilitado se exercícios pendentes

### **Certificado Bloqueado**

- [ ] Modal exibido ao tentar obter certificado sem 100% exercícios
- [ ] Lista de exercícios pendentes visível
- [ ] Botão para navegar aos exercícios pendentes

---

## 📅 Plano de Implementação (3 Fases)

### **Fase 1: Modal de Decisão** (Prioridade Alta)

**Tempo estimado:** 2-3 horas

- [ ] Criar `ExerciseDecisionModal` component
- [ ] Modificar `LessonPlayerScreen` para exibir modal
- [ ] Implementar `markExerciseAsPending` service
- [ ] Testar fluxo "Fazer Agora" vs "Fazer Depois"

### **Fase 2: Indicadores Visuais** (Prioridade Alta)

**Tempo estimado:** 2-3 horas

- [ ] Modificar `LessonCard` para exibir badge
- [ ] Ajustar lógica de navegação ao clicar
- [ ] Implementar `removeExerciseFromPending` service
- [ ] Testar atualização de badges após completar exercício

### **Fase 3: Barra Dupla + Certificado** (Prioridade Média)

**Tempo estimado:** 3-4 horas

- [ ] Criar `ProgressSummaryCard` component
- [ ] Criar `CertificateBlockedModal` component
- [ ] Implementar `saveExerciseResult` service
- [ ] Implementar `checkCertificateEligibility` service
- [ ] Testar elegibilidade para certificado

---

## 🎨 Design Tokens

### **Cores Específicas**

```typescript
// Badge de Exercício Pendente
warningBadge: {
  background: theme.colors.warning + '20', // 20% opacidade
  border: theme.colors.warning + '50',     // 50% opacidade
  text: theme.colors.warning,
  icon: theme.colors.warning,
}

// Barra de Progresso de Exercícios
exerciseProgress: {
  filled: theme.colors.warning,
  empty: theme.colors.border,
}
```

### **Ícones**

```typescript
// Lucide React Native
import {
  AlertTriangle, // ⚠️ Badge de pendente
  Target, // 🎯 Modal de exercício
  Award, // 🏆 Certificado
  Lock, // 🔒 Certificado bloqueado
} from "lucide-react-native";
```

---

## 📝 Notas de Implementação

### **Persistência no Firestore**

**Path:** `users/{userId}/courseProgress/{courseId}`

**Campos a adicionar:**

```typescript
{
  pendingExercises: ["LESSON-INIC-001", "LESSON-INIC-002"],
  exerciseResults: [
    {
      lessonId: "LESSON-INIC-001",
      quizId: "QUIZ-CON0001",
      score: 85,
      passed: true,
      attemptedAt: Timestamp
    }
  ],
  exercisesCompletionPercent: 50
}
```

### **Cache React Query**

Invalidar cache após:

- Marcar exercício como pendente
- Completar exercício
- Verificar elegibilidade

```typescript
queryClient.invalidateQueries({
  queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(userId, courseId),
});
```

---

## ✅ Checklist de Testes

### **Testes Funcionais**

- [ ] Usuário completa aula → Modal aparece
- [ ] Usuário escolhe "Fazer Agora" → Navega para quiz
- [ ] Usuário escolhe "Fazer Depois" → Badge aparece no currículo
- [ ] Usuário clica em aula com badge → Vai direto para exercício
- [ ] Usuário completa exercício → Badge desaparece
- [ ] Progresso de exercícios atualiza corretamente
- [ ] Certificado bloqueado se exercícios pendentes
- [ ] Certificado liberado após 100% aulas + 100% exercícios

### **Testes de Edge Cases**

- [ ] Aula sem exercício → Modal não aparece
- [ ] Refazer exercício → Atualiza score se melhor
- [ ] Múltiplos exercícios pendentes → Todos visíveis
- [ ] Offline → Dados salvos localmente e sincronizados depois

---

**Próxima Revisão:** Após implementação da Fase 1

**Referências:**

- `courses_ux_design_spec.md` - Especificação original de telas
- `courses_implementation_summary.md` - Status de implementação
- `DESIGN_SYSTEM_REFERENCE.md` - Tokens de design
