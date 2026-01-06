# 📚 Resumo: Módulo de Cursos Espíritas

**Data**: 06/01/2026  
**Status**: Em Implementação (80%)

---

## 📁 Documentos Criados

### 1. **`courses_ux_design_spec.md`**

Especificação completa de UX/UI com:

- ✅ Análise das interfaces de dados (ICourse, ILesson, ISlide, IUserCourseProgress)
- ✅ Jornada do usuário (diagrama Mermaid)
- ✅ 7 telas detalhadas com layouts, componentes e estados
- ✅ Fluxos de navegação

### 2. **`stitch_prompts_courses.md`**

6 prompts prontos para Stitch AI:

- ✅ Prompt 1: Catálogo de Cursos
- ✅ Prompt 2: Detalhes do Curso
- ✅ Prompt 3: Lista de Aulas (Currículo)
- ✅ Prompt 4: Player de Aula (Slides)
- ✅ Prompt 5: Quiz da Aula
- ✅ Prompt 6: Certificado de Conclusão

### 3. **`study_screen_progress_spec.md`** (criado anteriormente)

Especificação da tela Estude com progresso

---

## 🎯 Estrutura do Módulo de Cursos

### Arquitetura de Dados

```typescript
// Curso
ICourse {
  id, title, description, workloadMinutes,
  difficultyLevel: 'Iniciante' | 'Intermediário' | 'Avançado',
  author, lessonCount, imageUrl?, featured?
}

// Aula
ILesson {
  id, courseId, title, order, slides[],
  durationMinutes, quizId?
}

// Slide
ISlide {
  slideType, title, content, imagePrompt?,
  highlights[], references { kardeciana?, biblica? }
}

// Progresso do Usuário
IUserCourseProgress {
  userId, courseId, lastLessonId,
  completedLessons[], completionPercentage
}
```

---

## 🗺️ Jornada do Usuário

```
Tela Estude
    ↓ (clica "Cursos Espíritas")
Catálogo de Cursos
    ↓ (seleciona curso)
Detalhes do Curso
    ↓ (clica "Iniciar/Continuar")
Lista de Aulas
    ↓ (seleciona aula)
Player de Aula (Slides)
    ↓ (finaliza aula)
Quiz da Aula? (se houver)
    ↓ (completa)
Próxima Aula ou Certificado
```

---

## 📱 Telas do Módulo (7 telas)

### 1. ✅ Tela Estude (Dashboard)

**Status**: Implementada e refatorada com React Query  
**Arquivo**: `src/pages/study/index.tsx`  
**Componentes**: ResumeCard, Carousel com progresso  
**Data**: 05/01/2026

---

### 2. ✅ Catálogo de Cursos

**Status**: Implementada e refatorada com React Query  
**Rota**: `CoursesCatalog`  
**Arquivo**: `src/pages/study/courses-catalog/index.tsx`  
**Componentes**:

- SearchBar
- FilterChips (Todos, Iniciante, Intermediário, Avançado)
- CourseCard (imagem 16:9, título, metadados, barra de progresso)

**Estados**:

- Loading (skeleton)
- Empty (sem cursos)
- Error (retry)

**Data**: 05/01/2026

---

### 3. ✅ Detalhes do Curso

**Status**: Implementada seguindo protótipo Stitch  
**Rota**: `CourseDetails`  
**Arquivo**: `src/pages/study/course-details/index.tsx`  
**Componentes**:

- Hero Image com gradiente (LinearGradient)
- CourseHeader (título + autor sobrepostos na imagem)
- ProgressBar (se iniciado)
- StatsGrid (2x2: aulas, duração, nível, ano) com ícones circulares
- Description (expandível)
- InstructorCard (autor com avatar)
- ActionButtons fixos no footer (Iniciar/Continuar/Ver Aulas)

**Estados Condicionais**:

- Novo: "INICIAR CURSO"
- Em Progresso: Barra + "CONTINUAR CURSO"
- Completo: Badge "✓ Concluído"

**Observações**:

- Implementado Image.prefetch para otimização
- Performance de carregamento ainda precisa melhorias (passar via route params)

**Data**: 05/01/2026

---

### 4. ✅ Lista de Aulas (Currículo)

**Status**: Implementada seguindo protótipo Stitch  
**Rota**: `CourseCurriculum`  
**Arquivo**: `src/pages/study/course-curriculum/index.tsx`  
**Componentes**:

- CourseProgress (X de Y aulas) - Header com barra
- LessonCard com 4 estados visuais:
  - ✓ Concluída (verde, check icon)
  - ▶ Em Andamento (amarelo, barra de progresso interna)
  - 🔒 Bloqueada (cinza, lock icon)
  - Disponível (branco, número)
  - 📝 Quiz (badge visual)

**Lógica**: Aulas sequenciais desbloqueadas (mockado visualmente)

**Observações**:

- Estados visuais implementados
- Progresso real ainda não integrado

**Data**: 05/01/2026

---

### 5. ⏳ Player de Aula (Slides)

**Status**: Não implementado  
**Rota**: `LessonPlayer`  
**Componentes**:

- SlideContent (título + conteúdo markdown)
- HighlightCard (💡 destaques)
- ReferenceCard (📖 referências kardeciana/bíblica)
- SlideIndicator (●●●○○○ + contador)
- NavigationButtons (Anterior/Próximo)

**Tipos de Slide**:

- Texto
- Imagem
- Destaque
- Referência

**Navegação**: Swipe + botões

---

### 6. ⏳ Quiz da Aula

**Status**: Não implementado  
**Rota**: `LessonQuiz`  
**Componentes**:

- QuizHeader (contador)
- ProgressBar
- QuestionCard
- AnswerOption (4 estados: default, selected, correct, incorrect)
- ConfirmButton

**Fluxo**:

1. Seleciona resposta
2. Confirma
3. Feedback visual
4. Explicação
5. Próxima pergunta
6. Resultado final

---

### 7. ⏳ Certificado de Conclusão

**Status**: Não implementado  
**Rota**: `CourseCertificate`  
**Componentes**:

- CelebrationHeader (🎉 Parabéns!)
- CertificateCard (borda dourada, gradiente)
- StatsSection (100%, aulas, quizzes, minutos)
- ShareButton
- ExploreButton

**Funcionalidades**:

- Gerar imagem do certificado
- Compartilhar
- Salvar na galeria

---

## 🎨 Design System

### Cores

- Background: `#F2F7F2` (light) / `#191a1f` (dark)
- Card: `#FFFFFF` (light) / `#1f2026` (dark)
- Primary: `#6F7C60` (verde oliva)
- Success: `#5C8A5C`
- Warning: `#F59E0B`
- Error: `#C94B4B`

### Tipografia

- Font: Barlow Condensed / Oswald
- Tamanhos: 12px, 14px, 16px, 18px, 20px, 24px, 32px

### Espaçamento

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Border Radius

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

---

## 🚀 Próximos Passos

### Fase 1: Prototipagem no Stitch

1. ✅ Prompts criados
2. ✅ Protótipos gerados no Stitch AI
3. ✅ Exportados em `/artifacts/stitch-prototypes/`

### Fase 2: Implementação

1. ✅ Criar interfaces TypeScript (`src/types/course.ts`)
2. ✅ Criar serviços Firebase (`courseService.ts`, `lessonService.ts`)
3. ✅ Criar hooks React Query (`useCourses.ts`, `useLessons.ts`)
4. ✅ Implementar componentes reutilizáveis (CourseCard, LessonCard)
5. ✅ Criar telas seguindo protótipos (CourseDetails, CourseCurriculum)
6. ✅ Integrar navegação (rotas no AppNavigator)
7. ⏳ Implementar LessonPlayer
8. ⏳ Implementar LessonQuiz
9. ⏳ Implementar CourseCertificate

### Fase 3: Backend

1. ✅ Criar coleções Firestore:
   - `courses`
   - `lessons`
   - `users/{userId}/courseProgress` (pendente)
2. ⏳ Popular dados de exemplo (script criado, não executado)
3. ⏳ Configurar regras de segurança

### Fase 4: Testes e Polish

1. ⏳ Testar fluxo completo
2. ⏳ Adicionar animações
3. ⏳ Implementar offline support
4. ⏳ Otimizar performance (imagem de capa)

---

## 📊 Estatísticas

- **Telas**: 7 (4 implementadas + 3 pendentes)
- **Componentes Novos**: ~10 implementados
- **Serviços**: 2 implementados (course, lesson)
- **Hooks React Query**: 4 implementados
- **Interfaces**: 5 (ICourse, ILesson, ISlide, IUserCourseProgress, ICourseCategory)
- **Prompts Stitch**: 6 (todos gerados)

---

## 💡 Decisões de Design

### Padrão Visual

- ✅ Seguir protótipos Stitch com adaptações ao design system do app
- ✅ Usar tokens do tema (`theme.colors`, `theme.spacing`, `theme.radius`)
- ✅ Manter consistência com módulos ORE e MEDITE
- ✅ Botões padronizados (Privacy/GlossaryFilter styles)

### UX

- ✅ Aulas sequenciais (desbloqueio progressivo) - mockado
- ✅ Feedback visual claro (estados de conclusão)
- ⏳ Navegação intuitiva (swipe + botões)
- ⏳ Gamificação (certificado, progresso)

### Performance

- ✅ Cache de progresso (React Query)
- ⏳ Lazy loading de slides
- ⏳ Otimização de imagens (pendente: route params)

---

## 🐛 Problemas Conhecidos

1. **Performance de Imagem**: Carregamento da imagem de capa demora 3-5s
   - **Solução proposta**: Passar imageUrl via route params
2. **Progresso Mockado**: Estados visuais de progresso são simulados
   - **Solução**: Implementar integração real com Firestore
3. **Dados de Teste**: Script de seed criado mas não executado
   - **Ação**: Executar `scripts/seed_lessons.ts` quando apropriado

---

**Última atualização:** 05/01/2026 17:50  
**Implementado por:** Antigravity AI

---

## 📁 Documentos Criados

### 1. **`courses_ux_design_spec.md`**

Especificação completa de UX/UI com:

- ✅ Análise das interfaces de dados (ICourse, ILesson, ISlide, IUserCourseProgress)
- ✅ Jornada do usuário (diagrama Mermaid)
- ✅ 7 telas detalhadas com layouts, componentes e estados
- ✅ Fluxos de navegação

### 2. **`stitch_prompts_courses.md`**

6 prompts prontos para Stitch AI:

- ✅ Prompt 1: Catálogo de Cursos
- ✅ Prompt 2: Detalhes do Curso
- ✅ Prompt 3: Lista de Aulas (Currículo)
- ✅ Prompt 4: Player de Aula (Slides)
- ✅ Prompt 5: Quiz da Aula
- ✅ Prompt 6: Certificado de Conclusão

### 3. **`study_screen_progress_spec.md`** (criado anteriormente)

Especificação da tela Estude com progresso

---

## 🎯 Estrutura do Módulo de Cursos

### Arquitetura de Dados

```typescript
// Curso
ICourse {
  id, title, description, workloadMinutes,
  difficultyLevel: 'Iniciante' | 'Intermediário' | 'Avançado',
  author, lessonCount
}

// Aula
ILesson {
  id, courseId, title, order, slides[],
  durationMinutes, quizId?
}

// Slide
ISlide {
  slideType, title, content, imagePrompt?,
  highlights[], references { kardeciana?, biblica? }
}

// Progresso do Usuário
IUserCourseProgress {
  userId, courseId, lastLessonId,
  completedLessons[], completionPercentage
}
```

---

## 🗺️ Jornada do Usuário

```
Tela Estude
    ↓ (clica "Cursos Espíritas")
Catálogo de Cursos
    ↓ (seleciona curso)
Detalhes do Curso
    ↓ (clica "Iniciar/Continuar")
Lista de Aulas
    ↓ (seleciona aula)
Player de Aula (Slides)
    ↓ (finaliza aula)
Quiz da Aula? (se houver)
    ↓ (completa)
Próxima Aula ou Certificado
```

---

## 📱 Telas do Módulo (7 telas)

### 1. ✅ Tela Estude (Dashboard)

**Status**: Já especificada  
**Arquivo**: `study_screen_progress_spec.md`  
**Componentes**: ResumeCard, Carousel com progresso

---

### 2. 🆕 Catálogo de Cursos

**Rota**: `CoursesCatalog`  
**Componentes**:

- SearchBar
- FilterChips (Todos, Iniciante, Intermediário, Avançado)
- CourseCard (imagem 16:9, título, metadados, barra de progresso)

**Estados**:

- Loading (skeleton)
- Empty (sem cursos)
- Error (retry)

---

### 3. 🆕 Detalhes do Curso

**Rota**: `CourseDetails`  
**Componentes**:

- Hero Image com gradiente
- CourseHeader (título + autor)
- ProgressBar (se iniciado)
- StatsGrid (2x2: aulas, duração, nível, ano)
- Description (expandível)
- ActionButtons (Iniciar/Continuar/Ver Aulas)

**Estados Condicionais**:

- Novo: "INICIAR CURSO"
- Em Progresso: Barra + "CONTINUAR CURSO"
- Completo: Badge "✓ Concluído"

---

### 4. 🆕 Lista de Aulas (Currículo)

**Rota**: `CourseCurriculum`  
**Componentes**:

- CourseProgress (X de Y aulas)
- LessonCard com 4 estados:
  - ✓ Concluída (verde)
  - ▶ Em Andamento (amarelo)
  - 🔒 Bloqueada (cinza)
  - Disponível (branco)

**Lógica**: Aulas sequenciais desbloqueadas

---

### 5. 🆕 Player de Aula (Slides)

**Rota**: `LessonPlayer`  
**Componentes**:

- SlideContent (título + conteúdo markdown)
- HighlightCard (💡 destaques)
- ReferenceCard (📖 referências kardeciana/bíblica)
- SlideIndicator (●●●○○○ + contador)
- NavigationButtons (Anterior/Próximo)

**Tipos de Slide**:

- Texto
- Imagem
- Destaque
- Referência

**Navegação**: Swipe + botões

---

### 6. 🆕 Quiz da Aula

**Rota**: `LessonQuiz`  
**Componentes**:

- QuizHeader (contador)
- ProgressBar
- QuestionCard
- AnswerOption (4 estados: default, selected, correct, incorrect)
- ConfirmButton

**Fluxo**:

1. Seleciona resposta
2. Confirma
3. Feedback visual
4. Explicação
5. Próxima pergunta
6. Resultado final

---

### 7. 🆕 Certificado de Conclusão

**Rota**: `CourseCertificate`  
**Componentes**:

- CelebrationHeader (🎉 Parabéns!)
- CertificateCard (borda dourada, gradiente)
- StatsSection (100%, aulas, quizzes, minutos)
- ShareButton
- ExploreButton

**Funcionalidades**:

- Gerar imagem do certificado
- Compartilhar
- Salvar na galeria

---

## 🎨 Design System

### Cores

- Background: `#191a1f`
- Card: `#1f2026`
- Primary: `#7ED957` (verde)
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`
- Gold: `#F59E0B`

### Tipografia

- Font: Google Sans
- Tamanhos: 12px, 13px, 14px, 15px, 16px, 18px, 20px, 24px, 32px

### Espaçamento

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Border Radius

- Cards: 16px
- Buttons: 12px
- Small: 8px

---

## 🚀 Próximos Passos

### Fase 1: Prototipagem no Stitch

1. ✅ Prompts criados
2. ⏳ Gerar protótipos no Stitch AI
3. ⏳ Exportar imagens (PNG alta resolução)
4. ⏳ Salvar em `/artifacts/stitch-prototypes/`

### Fase 2: Implementação

1. ⏳ Criar interfaces TypeScript (`src/types/course.ts`)
2. ⏳ Criar serviços Firebase (`courseService.ts`, `lessonService.ts`)
3. ⏳ Implementar componentes reutilizáveis
4. ⏳ Criar telas seguindo protótipos
5. ⏳ Integrar navegação (CourseNavigator)

### Fase 3: Backend

1. ⏳ Criar coleções Firestore:
   - `courses`
   - `lessons`
   - `users/{userId}/courseProgress`
2. ⏳ Popular dados de exemplo
3. ⏳ Configurar regras de segurança

### Fase 4: Testes e Polish

1. ⏳ Testar fluxo completo
2. ⏳ Adicionar animações
3. ⏳ Implementar offline support
4. ⏳ Otimizar performance

---

## 📊 Estatísticas

- **Telas**: 7 (1 existente + 6 novas)
- **Componentes Novos**: ~15
- **Serviços**: 3 (course, lesson, progress)
- **Interfaces**: 5 (ICourse, ILesson, ISlide, IUserCourseProgress, ICourseCategory)
- **Prompts Stitch**: 6

---

## 💡 Decisões de Design

### Padrão Visual

- ✅ Seguir design system do app (não copiar Stitch exatamente)
- ✅ Usar tokens do tema (`theme.colors`, `theme.spacing`)
- ✅ Manter consistência com módulos ORE e MEDITE
- ✅ Dark mode premium

### UX

- ✅ Aulas sequenciais (desbloqueio progressivo)
- ✅ Feedback visual claro (estados de conclusão)
- ✅ Navegação intuitiva (swipe + botões)
- ✅ Gamificação (certificado, progresso)

### Performance

- ✅ Cache de progresso (React Query)
- ✅ Lazy loading de slides
- ✅ Otimização de imagens

---

**Documentação completa criada por:** Antigravity AI  
**Data:** 03/01/2026 20:30
---

## 📅 Atualização: 06/01/2026

### **Arquitetura Educacional Completa Implementada**

#### **1. Sistema de Certificação**

**Interfaces Atualizadas (Quiz-Web + Mobile):**

- ✅ `ICourse.certification` - Requisitos de certificação (nota ≥ 7.0, 100% aulas/exercícios)
- ✅ `ICourse.stats` - Estatísticas do curso
- ✅ `ICourse.status` - Status de publicação (PUBLISHED, COMING_SOON, DRAFT)
- ✅ `ILesson.status` - Status da aula
- ✅ `IUserCourseProgress` - Campos de certificação e nota final
- ✅ 8 novas interfaces criadas (IExercise, ICertificate, ISupplementaryMaterial, etc.)

**Dados Exportados para Firestore:**

```
courses/COURSE-00001
  ├─ certification: { enabled, minimumGrade: 7.0, ... }
  ├─ stats: { exerciseCount: 3, totalDurationMinutes: 243 }
  └─ lessons/ (2 aulas publicadas)

exercises/ (3 exercícios, reutilizam quizzes)
  ├─ EXERCISE-INIC-001 (quizId: QUIZ-CON0001)
  ├─ EXERCISE-INIC-002 (quizId: QUIZ-CON0002)
  └─ EXERCISE-INIC-003 (quizId: QUIZ-CON0003)
```

#### **2. Tela de Currículo Funcional**

**Status**: ✅ Implementada e integrada com Firestore  
**Arquivo**: `src/pages/study/course-curriculum/index.tsx`

**Implementações:**

- ✅ Design system correto (cores success/primary, sem sombras)
- ✅ Título dinâmico do curso via `useCourse`
- ✅ Progresso real do Firestore via `useCourseProgress`
- ✅ Lógica de desbloqueio sequencial de aulas
- ✅ 4 estados visuais: Concluída, Em Andamento, Bloqueada, Disponível
- ✅ Navegação completa (Catálogo → Detalhes → Currículo)

**Hooks Criados:**

```typescript
// src/hooks/queries/useCourse.ts
useCourse(id: string) // Busca curso por ID

// src/hooks/queries/useCourseProgress.ts
useCourseProgress(courseId: string) // Busca progresso do usuário
```

**Lógica de Status:**

- **COMPLETED**: Aula em `completedLessons`
- **IN_PROGRESS**: Aula é a `lastLessonId`
- **AVAILABLE**: Aula anterior concluída ou é a primeira
- **LOCKED**: Aula anterior não concluída

#### **3. Melhorias de Design System**

- ✅ Cor `warning` adicionada (Light: #F59E0B, Dark: #FFA726)
- ✅ Sombras removidas dos cards (consistência com app)
- ✅ Espaçamentos usando theme tokens
- ✅ Cores usando theme tokens (sem hardcode)

#### **4. Arquivos Modificados**

**Quiz-Web:**
- `src/types/index.ts` (+200 linhas)
- `src/files/courses/data/Iniciacao.ts` (certificação)
- `src/files/courses/exercises/IniciacaoExercises.ts` (novo)
- `src/pages/Export.tsx` (exportação de exercícios)

**Mobile:**
- `src/types/course.ts` (+115 linhas)
- `src/hooks/queries/useCourses.ts` (useCourse)
- `src/hooks/queries/useCourseProgress.ts` (novo)
- `src/pages/study/course-curriculum/` (completo)
- `src/routers/AppNavigator.tsx` (rota CourseCurriculum)
- `src/configs/theme/` (cor warning)

---

## 🎯 Próximas Implementações

### **Fase 2: Funcionalidades Educacionais**

1. **Tela de Player de Aula** (Prioridade Alta)
   - Exibir slides da aula
   - Navegação entre slides
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

**Última Atualização**: 06/01/2026  
**Próxima Revisão**: Após implementação do Player de Aula
