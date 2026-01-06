# Atualizações do Módulo de Cursos

**Última Atualização**: 06/01/2026 14:15

---

## 📅 06/01/2026 - Currículo Funcional + Sistema de Certificação

### **Tela de Currículo Completa**

**Status**: ✅ Implementada e integrada com Firestore  
**Arquivo**: `src/pages/study/course-curriculum/index.tsx`

**Implementações**:

- ✅ Design system correto (cores success/primary, sem sombras)
- ✅ Título dinâmico do curso via `useCourse(courseId)`
- ✅ Progresso real do Firestore via `useCourseProgress(courseId)`
- ✅ Lógica de desbloqueio sequencial de aulas
- ✅ 4 estados visuais: Concluída, Em Andamento, Bloqueada, Disponível
- ✅ Navegação completa: Catálogo → Detalhes → Currículo

**Hooks Criados**:

```typescript
// src/hooks/queries/useCourses.ts
useCourse(id: string) // Busca curso por ID

// src/hooks/queries/useCourseProgress.ts
useCourseProgress(courseId: string) // Busca progresso do usuário
```

**Lógica de Status das Aulas**:

- **COMPLETED**: Aula está em `completedLessons[]`
- **IN_PROGRESS**: Aula é a `lastLessonId`
- **AVAILABLE**: Aula anterior concluída ou é a primeira
- **LOCKED**: Aula anterior não concluída

**Correção de Ícones** (14:10):

- ✅ Adicionado ícone `PlayCircle` outline para aulas disponíveis
- ✅ Removidos estilos não utilizados (`numberCircle`, `numberText`)
- ✅ Consistência visual entre todos os estados

---

### **Sistema de Certificação (Quiz-Web)**

**Interfaces Atualizadas**:

- ✅ `ICourse.certification` - Requisitos de certificação (nota ≥ 7.0, 100% aulas/exercícios)
- ✅ `ICourse.stats` - Estatísticas do curso (exerciseCount, totalDurationMinutes)
- ✅ `ICourse.status` - Status de publicação (PUBLISHED, COMING_SOON, DRAFT)
- ✅ `ILesson.status` - Status da aula (PUBLISHED, DRAFT)
- ✅ `IUserCourseProgress` - Campos de certificação e nota final
- ✅ 8 novas interfaces criadas:
  - `IExercise`, `ICertificate`, `ISupplementaryMaterial`
  - `IExerciseAttempt`, `ICertification`, `ICourseStats`
  - `CourseStatus`, `LessonStatus`

**Dados Exportados para Firestore**:

```
courses/COURSE-00001
  ├─ certification: { enabled: true, minimumGrade: 7.0, ... }
  ├─ stats: { exerciseCount: 3, totalDurationMinutes: 243 }
  └─ lessons/ (2 aulas publicadas)

exercises/ (3 exercícios, reutilizam quizzes)
  ├─ EXERCISE-INIC-001 (quizId: QUIZ-CON0001)
  ├─ EXERCISE-INIC-002 (quizId: QUIZ-CON0002)
  └─ EXERCISE-INIC-003 (quizId: QUIZ-CON0003)
```

---

### **Melhorias de Design System**

- ✅ Cor `warning` adicionada ao tema:
  - Light: `#F59E0B`
  - Dark: `#FFA726`
- ✅ Sombras removidas dos cards (consistência com app)
- ✅ Espaçamentos usando theme tokens
- ✅ Cores usando theme tokens (sem hardcode)

---

### **Arquivos Modificados**

**Quiz-Web** (4 arquivos):

- `src/types/index.ts` (+200 linhas)
- `src/files/courses/data/Iniciacao.ts` (certificação)
- `src/files/courses/exercises/IniciacaoExercises.ts` (novo)
- `src/pages/Export.tsx` (exportação de exercícios)

**Mobile** (6 arquivos):

- `src/types/course.ts` (+115 linhas)
- `src/hooks/queries/useCourses.ts` (useCourse)
- `src/hooks/queries/useCourseProgress.ts` (novo)
- `src/pages/study/course-curriculum/` (completo)
- `src/routers/AppNavigator.tsx` (rota CourseCurriculum)
- `src/configs/theme/` (cor warning)

---

## 📅 05/01/2026 - Detalhes do Curso + Navegação

### **Tela de Detalhes do Curso**

**Status**: ✅ Implementada  
**Arquivo**: `src/pages/study/course-details/index.tsx`

**Componentes**:

- Hero Image com `LinearGradient` overlay
- `CourseHeader` (título + autor sobrepostos)
- `ProgressBar` (se curso iniciado)
- `StatsGrid` 2x2 com ícones circulares
- `Description` expandível
- `InstructorCard` (autor com avatar)
- `ActionButtons` fixos no footer

**Estados Condicionais**:

- Novo: "INICIAR CURSO"
- Em Progresso: Barra + "CONTINUAR CURSO"
- Completo: Badge "✓ Concluído"

**Navegação Implementada**:

- ✅ Catálogo → Detalhes (clique no card)
- ✅ Detalhes → Currículo (botão "Ver Aulas")

---

## 📅 04/01/2026 - Catálogo de Cursos

### **Tela de Catálogo**

**Status**: ✅ Implementada  
**Arquivo**: `src/pages/study/courses-catalog/index.tsx`

**Componentes**:

- Header centralizado com ícone `GraduationCap` + 3 anéis concêntricos
- `SearchBar` sticky (fixa ao rolar)
- `FilterBottomSheet` com 6 opções
- `CourseCard` horizontal compacto

**Layout do Card**:

- Imagem 100x100px (aspecto 3:4 à esquerda)
- Título, descrição truncada, metadados
- Barra de progresso integrada (se iniciado)
- Imagens reais: Capas de livros espíritas

**Filtros**:

- Todos, Iniciante, Intermediário, Avançado
- Em Andamento, Concluídos

---

## 📅 03/01/2026 - Especificação UX/UI

### **Documentação Criada**

**Arquivos**:

- ✅ `courses_ux_design_spec.md` - Especificação completa de 7 telas
- ✅ `stitch_prompts_courses.md` - 6 prompts para Stitch AI
- ✅ `study_screen_progress_spec.md` - Tela Estude com progresso

**Conteúdo**:

- Jornada do usuário (diagrama Mermaid)
- Layouts detalhados em ASCII art
- Componentes, estados e fluxos de navegação
- Protótipos gerados no Stitch AI

---

## 🎯 Próximas Implementações

### **Fase 2: Funcionalidades Educacionais** (Prioridade Alta)

1. **Tela de Player de Aula**
   - Exibir slides da aula
   - Navegação entre slides (swipe + botões)
   - Marcar aula como concluída
   - Atualizar progresso no Firestore

2. **Sistema de Exercícios**
   - Integrar com quizzes existentes
   - Calcular nota ponderada
   - Salvar tentativas
   - Exibir melhor resultado

3. **Sistema de Certificação**
   - Verificar elegibilidade
   - Gerar PDF de certificado
   - Validação pública
   - Enviar por email

4. **Material Complementar**
   - Exibir PDFs, vídeos, links
   - Download offline
   - Marcação de leitura

---

**Próxima Revisão**: Após implementação do Player de Aula
