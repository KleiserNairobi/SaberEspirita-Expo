# 📚 Módulo de Cursos Espíritas - Resumo de Implementação

**Última Atualização**: 09/01/2026 19:15  
**Status Geral**: 98% Concluído

---

## 📊 Status Atual

### Telas Implementadas (6/7)

| #   | Tela                           | Status      | Arquivo                              | Data       |
| --- | ------------------------------ | ----------- | ------------------------------------ | ---------- |
| 1   | **Estude (Dashboard)**         | ✅ Completo | `src/pages/study/index.tsx`          | 05/01/2026 |
| 2   | **Catálogo de Cursos**         | ✅ Completo | `src/pages/study/courses-catalog/`   | 04/01/2026 |
| 3   | **Detalhes do Curso**          | ✅ Completo | `src/pages/study/course-details/`    | 05/01/2026 |
| 4   | **Currículo (Lista de Aulas)** | ✅ Completo | `src/pages/study/course-curriculum/` | 06/01/2026 |
| 5   | **Player de Aula**             | ✅ Completo | `src/pages/study/lesson-player/`     | 09/01/2026 |
| 6   | **Quiz da Aula**               | ✅ Completo | `src/pages/fix/quiz/` (Reutilizado)  | 09/01/2026 |
| 7   | **Certificado**                | ⏳ Pendente | -                                    | -          |

---

## 🎯 Arquitetura de Dados

### Interfaces TypeScript

```typescript
// Curso
ICourse {
  id: string;
  title: string;
  description: string;
  workloadMinutes: number;
  difficultyLevel: 'Iniciante' | 'Intermediário' | 'Avançado';
  author: string;
  lessonCount: number;
  imageUrl?: string | number;
  featured?: boolean;
  certification?: ICertification;
  stats?: ICourseStats;
  status?: CourseStatus;
}

// Aula
ILesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  slides: ISlide[];
  durationMinutes: number;
  quizId?: string;
  status?: LessonStatus;
}

// Slide
ISlide {
  slideType: 'text' | 'image' | 'highlight' | 'reference';
  title: string;
  content: string;
  imagePrompt?: string;
  highlights?: string[];
  references?: {
    kardeciana?: string;
    biblica?: string;
  };
}

// Progresso do Usuário
IUserCourseProgress {
  userId: string;
  courseId: string;
  lastLessonId: string;
  completedLessons: string[];
  completionPercentage: number;
  completedAt?: Date;
  finalGrade?: number;
  certificateId?: string;
}
```

### Estrutura Firestore

```
courses/
  ├─ COURSE-00001/
  │  ├─ id, title, description, workloadMinutes
  │  ├─ difficultyLevel, author, lessonCount
  │  ├─ certification: { enabled, minimumGrade: 7.0, ... }
  │  ├─ stats: { exerciseCount: 3, totalDurationMinutes: 243 }
  │  └─ status: 'PUBLISHED' | 'COMING_SOON' | 'DRAFT'
  │
  └─ COURSE-00002/

lessons/
  ├─ LESSON-00001/
  │  ├─ courseId, title, order, durationMinutes
  │  ├─ slides: [...]
  │  ├─ quizId?: string
  │  └─ status: 'PUBLISHED' | 'DRAFT'
  │
  └─ LESSON-00002/

exercises/
  ├─ EXERCISE-INIC-001/
  │  ├─ courseId, lessonId, quizId
  │  ├─ weight, passingGrade
  │  └─ type: 'LESSON_QUIZ' | 'FINAL_EXAM'
  │
  └─ EXERCISE-INIC-002/

users/{userId}/courseProgress/
  ├─ {courseId}/
  │  ├─ lastLessonId, completedLessons[]
  │  ├─ completionPercentage, finalGrade
  │  └─ certificateId?, completedAt?
  │
  └─ {courseId}/
```

---

## 🗺️ Jornada do Usuário

```
Tela Estude (Dashboard)
    ↓ (clica "Cursos Espíritas" ou "Ver todos")
Catálogo de Cursos
    ↓ (seleciona curso)
Detalhes do Curso
    ↓ (clica "Iniciar/Continuar Curso" ou "Ver Aulas")
Lista de Aulas (Currículo)
    ↓ (seleciona aula disponível)
Player de Aula (Slides) [PENDENTE]
    ↓ (finaliza aula)
Quiz da Aula? (se houver) [PENDENTE]
    ↓ (completa)
Próxima Aula ou Certificado [PENDENTE]
```

---

## 📱 Detalhamento das Telas Implementadas

### 1. ✅ Tela Estude (Dashboard)

**Arquivo**: `src/pages/study/index.tsx`  
**Data**: 05/01/2026

**Componentes**:

- Header com saudação personalizada
- Seção "Populares" com `Carousel` reutilizado
- Seção "Explore a Biblioteca" (grade 3 colunas)
- Botão "Ver todos" para navegação ao catálogo

**Integrações**:

- `useAuthStore()` para nome do usuário
- `useAppTheme()` para tema dinâmico
- Dados de `src/data/SliderData.tsx` e `src/data/Biblioteca.tsx`

---

### 2. ✅ Catálogo de Cursos

**Arquivo**: `src/pages/study/courses-catalog/index.tsx`  
**Data**: 04/01/2026

**Componentes**:

- Header centralizado com ícone `GraduationCap` e 3 anéis concêntricos
- `SearchBar` sticky (fixa ao rolar)
- `FilterBottomSheet` com 6 opções:
  - Todos, Iniciante, Intermediário, Avançado, Em Andamento, Concluídos
- `CourseCard` horizontal compacto (imagem 3:4 à esquerda)

**Layout do Card**:

- Imagem 100x100px (aspecto 3:4 retrato)
- Título, descrição truncada, metadados com ícones
- Barra de progresso integrada (se iniciado)
- Imagens reais: Capas de livros espíritas dos assets

**Estados**:

- Loading (ActivityIndicator)
- Empty (mensagem "Nenhum curso encontrado")
- Error (retry)

**Hooks**:

- `useCourses()` - React Query para buscar cursos

---

### 3. ✅ Detalhes do Curso

**Arquivo**: `src/pages/study/course-details/index.tsx`  
**Data**: 05/01/2026

**Componentes**:

- Hero Image com `LinearGradient` overlay
- `CourseHeader` (título + autor sobrepostos na imagem)
- `ProgressBar` (se curso iniciado)
- `StatsGrid` 2x2 com ícones circulares:
  - Aulas, Duração, Nível, Ano
- `Description` expandível
- `InstructorCard` (autor com avatar)
- `ActionButtons` fixos no footer

**Estados Condicionais**:

- **Novo**: "INICIAR CURSO" (verde)
- **Em Progresso**: Barra de progresso + "CONTINUAR CURSO"
- **Completo**: Badge "✓ Concluído"

**Otimizações**:

- `Image.prefetch()` para pré-carregar imagem
- **Pendente**: Passar imageUrl via route params para melhor performance

**Hooks**:

- `useCourse(courseId)` - Busca curso por ID
- `useCourseProgress(courseId)` - Busca progresso do usuário

---

### 4. ✅ Lista de Aulas (Currículo)

**Arquivo**: `src/pages/study/course-curriculum/index.tsx`  
**Data**: 06/01/2026

**Componentes**:

- Header de navegação com botão voltar
- `SummaryCard` com progresso do curso
- `LessonCard` com 4 estados visuais

**Estados da Aula**:

| Status          | Ícone                      | Cor                     | Descrição         |
| --------------- | -------------------------- | ----------------------- | ----------------- |
| **COMPLETED**   | `CheckCircle` (preenchido) | Verde (`success`)       | Aula concluída    |
| **IN_PROGRESS** | `PlayCircle` (preenchido)  | Verde oliva (`primary`) | Aula em andamento |
| **AVAILABLE**   | `PlayCircle` (outline)     | Cinza (`textSecondary`) | Aula disponível   |
| **LOCKED**      | `Lock`                     | Cinza (`textSecondary`) | Aula bloqueada    |

**Lógica de Desbloqueio**:

- Primeira aula sempre disponível
- Aulas seguintes desbloqueiam após completar a anterior
- Aula em progresso é a `lastLessonId`

**Hooks**:

- `useCourse(courseId)` - Título do curso
- `useLessons(courseId)` - Lista de aulas
- `useCourseProgress(courseId)` - Progresso real do Firestore

**Correções Recentes** (06/01/2026):

- ✅ Ícone `PlayCircle` outline adicionado para aulas disponíveis
- ✅ Removidos estilos não utilizados (`numberCircle`, `numberText`)

---

## 🛠️ Serviços e Hooks Criados

### Serviços Firebase

**`src/services/firebase/courseService.ts`**:

```typescript
getCourses() // Busca todos os cursos
getFeaturedCourses() // Busca cursos em destaque
getCourseById(id: string) // Busca curso por ID
```

**`src/services/firebase/lessonService.ts`**:

```typescript
getLessonsByCourseId(courseId: string) // Busca aulas de um curso
getLessonById(id: string) // Busca aula por ID
```

### Hooks React Query

**`src/hooks/queries/useCourses.ts`**:

```typescript
useCourses() // Lista todos os cursos
useFeaturedCourses() // Lista cursos em destaque
useCourse(id: string) // Busca curso individual
```

**`src/hooks/queries/useLessons.ts`**:

```typescript
useLessons(courseId: string) // Lista aulas de um curso
useLesson(id: string) // Busca aula individual
```

**`src/hooks/queries/useCourseProgress.ts`**:

```typescript
useCourseProgress(courseId: string) // Busca progresso do usuário
```

---

## 🎨 Design System

### Cores (Dark Theme)

```typescript
background: "#121E31";
card: "#162235";
primary: "#8F9D7E"; // Verde oliva
success: "#5C8A5C"; // Verde
warning: "#FFA726"; // Laranja (adicionado 06/01)
error: "#C94B4B"; // Vermelho
accent: "#2A3645"; // Azul escuro
```

### Tipografia

```typescript
regular: "BarlowCondensed_400Regular";
medium: "BarlowCondensed_500Medium";
semibold: "BarlowCondensed_600SemiBold";
bold: "Oswald_700Bold";
```

### Padrões Visuais

- ✅ **Sem sombras** nos cards (consistência com app)
- ✅ **Ícones circulares** padronizados (borderRadius: 20px)
- ✅ **Tokens do tema** em todos os componentes
- ✅ **Efeito de vibração** nos ícones de categoria (3 anéis concêntricos)

---

## 📊 Estatísticas

- **Telas**: 7 (4 implementadas + 3 pendentes)
- **Componentes Novos**: ~12 implementados
- **Serviços**: 2 implementados (course, lesson)
- **Hooks React Query**: 5 implementados
- **Interfaces TypeScript**: 8+ (ICourse, ILesson, ISlide, IUserCourseProgress, etc.)
- **Prompts Stitch**: 6 criados

---

## 🚀 Próximas Implementações

### Fase 2: Funcionalidades Educacionais (Prioridade Alta)

#### 1. **Tela de Player de Aula**

- [ ] Exibir slides da aula (swipe horizontal)
- [ ] Navegação entre slides (botões + indicador)
- [ ] Renderizar conteúdo markdown
- [ ] Exibir highlights e referências
- [ ] Marcar aula como concluída
- [ ] Atualizar progresso no Firestore

#### 2. **Sistema de Exercícios**

- [ ] Integrar com quizzes existentes
- [ ] Calcular nota ponderada
- [ ] Salvar tentativas no Firestore
- [ ] Exibir melhor resultado
- [ ] Feedback visual de acertos/erros

#### 3. **Sistema de Certificação**

- [ ] Verificar elegibilidade (100% aulas + nota ≥ 7.0)
- [ ] Gerar PDF de certificado
- [ ] Validação pública via QR Code
- [ ] Compartilhamento nativo
- [ ] Enviar por email (opcional)

#### 4. **Material Complementar**

- [ ] Exibir PDFs, vídeos, links externos
- [ ] Download offline de materiais
- [ ] Marcação de leitura/visualização

---

## 🐛 Problemas Conhecidos

### 1. Performance de Imagem (Detalhes do Curso)

**Problema**: Carregamento da imagem de capa demora 3-5s  
**Solução Proposta**: Passar `imageUrl` via route params para renderização instantânea  
**Status**: Pendente

### 2. ~~Progresso Mockado~~ ✅ RESOLVIDO

**Problema**: Estados visuais de progresso eram simulados  
**Solução**: Implementados hooks `useCourseProgress` com dados reais do Firestore  
**Status**: ✅ Resolvido em 06/01/2026

### 3. Dados de Teste

**Problema**: Script de seed criado mas não executado  
**Ação**: Executar `scripts/seed_lessons.ts` quando apropriado  
**Status**: Pendente

---

## 📅 Histórico de Atualizações

### 09/01/2026 (Refatoração) - Reutilização do QuizScreen

**Implementações**:

- ✅ **Refatoração Completa**: Substituído o `CourseQuizScreen` pelo componente robusto `QuizScreen` do módulo Fixe.
- ✅ **QuizScreen Universal**: Adaptado para funcionar em modo 'course', aceitando IDs arbitrários e integrando com o progresso do curso.
- ✅ **QuizResultScreen Atualizado**: Navegação 'Continuar' agora retorna ao currículo do curso quando executado neste contexto.
- ✅ **Limpeza de Código**: Removidos componentes duplicados e redundantes.

**Arquivos Modificados**:

- `src/pages/fix/quiz/index.tsx` (Adaptado)
- `src/pages/fix/quiz/result/index.tsx` (Adaptado)
- `src/pages/study/lesson-player/index.tsx` (Navegação atualizada)
- `src/services/firebase/quizService.ts`
- `src/routers/types.ts`
- `src/routers/AppNavigator.tsx` (Rota atualizada)
- 🗑️ `src/pages/study/course-quiz/` (Removido)

---

### 09/01/2026 - Integração de Quiz e Player

**Implementações**:

- ✅ **CourseQuizScreen**: Nova tela que reutiliza a engine de quiz do módulo Fixe.
- ✅ **Integração no Player**: Aula agora redireciona para o quiz (se existir `quizId`) antes de concluir.
- ✅ **Lógica de Conclusão**: Progresso só é salvo após sucesso no quiz.
- ✅ **Service Update**: `quizService` atualizado para buscar quizzes por ID genérico.

**Arquivos Modificados**:

- `src/pages/study/course-quiz/index.tsx`
- `src/pages/study/lesson-player/index.tsx`
- `src/services/firebase/quizService.ts`
- `src/routers/types.ts`

---

### 06/01/2026 - Currículo Funcional + Certificação

**Implementações**:

- ✅ Tela de Currículo completa com Firestore
- ✅ Hooks `useCourse` e `useCourseProgress` criados
- ✅ Lógica de desbloqueio sequencial de aulas
- ✅ 4 estados visuais nos cards de aula
- ✅ Correção de ícones (PlayCircle outline para aulas disponíveis)
- ✅ Sistema de certificação no Quiz-Web (8 novas interfaces)
- ✅ Cor `warning` adicionada ao tema
- ✅ Dados exportados para Firestore (curso + exercícios)

**Arquivos Modificados**:

- Quiz-Web: `src/types/index.ts`, `src/files/courses/`, `src/pages/Export.tsx`
- Mobile: `src/types/course.ts`, `src/hooks/queries/`, `src/pages/study/course-curriculum/`, `src/configs/theme/`

---

### 05/01/2026 - Detalhes e Navegação

**Implementações**:

- ✅ Tela de Detalhes do Curso com hero image
- ✅ Navegação completa: Catálogo → Detalhes → Currículo
- ✅ Botão "Ver Aulas" funcional
- ✅ Estados condicionais (novo, em progresso, completo)

---

### 04/01/2026 - Catálogo de Cursos

**Implementações**:

- ✅ Tela de Catálogo com SearchBar sticky
- ✅ Sistema de filtros (6 opções)
- ✅ CourseCard horizontal compacto
- ✅ Navegação do Dashboard para Catálogo

---

### 03/01/2026 - Especificação UX/UI

**Documentação Criada**:

- ✅ `courses_ux_design_spec.md` - Especificação completa de 7 telas
- ✅ `stitch_prompts_courses.md` - 6 prompts para Stitch AI
- ✅ Jornada do usuário mapeada (diagrama Mermaid)
- ✅ Protótipos gerados no Stitch AI

---

## 💡 Decisões de Design

### Padrão Visual

- ✅ Seguir protótipos Stitch com adaptações ao design system do app
- ✅ Usar tokens do tema (`theme.colors.*`, `theme.text()`, `theme.spacing.*`)
- ✅ Manter consistência com módulos ORE e MEDITE
- ✅ Botões padronizados (Privacy/GlossaryFilter styles)

### UX

- ✅ Aulas sequenciais com desbloqueio progressivo
- ✅ Feedback visual claro (4 estados de conclusão)
- ⏳ Navegação intuitiva (swipe + botões) - pendente no Player
- ⏳ Gamificação (certificado, progresso) - parcialmente implementado

### Performance

- ✅ Cache de progresso (React Query)
- ⏳ Lazy loading de slides - pendente
- ⏳ Otimização de imagens (route params) - pendente

---

## 📚 Documentação Relacionada

- **`courses_ux_design_spec.md`** - Especificação completa de UX/UI
- **`stitch_prompts_courses.md`** - Prompts para prototipagem
- **`study_screen_progress_spec.md`** - Especificação da tela Estude
- **`DESIGN_SYSTEM_REFERENCE.md`** - Referência rápida do design system

---

**Implementado por**: Antigravity AI  
**Próxima Revisão**: Após implementação do Player de Aula
