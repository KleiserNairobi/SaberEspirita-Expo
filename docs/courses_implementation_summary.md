# 📚 Resumo: Módulo de Cursos Espíritas

**Data**: 03/01/2026  
**Status**: Especificado e Prototipado

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
