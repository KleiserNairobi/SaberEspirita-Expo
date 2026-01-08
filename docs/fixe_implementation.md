# Módulo FIXE - Documentação de Implementação

**Data**: 08/01/2026  
**Status**: ✅ Core Completo (4 telas + navegação)

---

## 📋 Resumo

Módulo de quizzes standalone implementado com migração da lógica do CLI para Expo. Permite usuários testarem conhecimentos sobre Espiritismo através de quizzes organizados por categorias e subcategorias.

---

## 🏗️ Arquitetura

### Tipos (`src/types/quiz.ts`)

- `IQuiz`, `IQuestion`, `IQuizAnswer`
- `IQuizHistory`, `ICategory`, `ISubcategory`

### Componentes Reutilizáveis

1. **AnswerOption** - Alternativa com feedback verde/vermelho
2. **QuestionCard** - Container de perguntas
3. **QuizProgressBar** - Barra + contador
4. **CategoryCard** - Card 3 colunas (padrão do app)
5. **SubcategoryCard** - Card com check
6. **SearchBar**, **IconButton**, **Button** (genéricos)

### Serviços Firebase (`src/services/firebase/quizService.ts`)

```typescript
getCategories();
getSubcategories(categoryId);
getQuiz(subcategoryId);
saveUserCompletedSubcategories();
addUserHistory();
getUserProgress();
```

### Hooks React Query (`src/hooks/queries/useQuiz.ts`)

```typescript
useCategories();
useSubcategories(categoryId);
useQuiz(subcategoryId);
useUserQuizProgress(userId);
```

---

## 📱 Telas

### 1. FixHomeScreen ✅

- Grid 3 colunas (FlatList)
- 6 categorias: Conceitos, Diversos, Espíritos, Filmes, Livros, Personagens
- Navegação → Subcategories

### 2. SubcategoriesScreen ✅

- SearchBar + filtros
- Lista de subcategorias
- Navegação → Quiz

### 3. QuizScreen ✅

- Navegação de perguntas
- Feedback visual imediato
- Cálculo de resultados
- Navegação → QuizResult

### 4. QuizResultScreen ✅

- Sistema de estrelas (1-4)
- Estatísticas + mensagens motivacionais
- Botões "Continuar" e "Revisar"

---

## 🔄 Navegação

```
FixHome → Subcategories → Quiz → QuizResult
```

**Tipos**: `FixStackParamList` em `src/routers/types.ts`

---

## 📊 Dados Mockados

**6 Categorias**:

- Conceitos (1077 questões) - BookOpen - Roxo
- Diversos (132) - Sparkles - Laranja
- Espíritos (187) - Ghost - Verde
- Filmes (148) - Film - Rosa
- Livros (107) - Library - Azul
- Personagens (626) - Users - Laranja

---

## ✅ Próximos Passos

### Alta Prioridade:

1. Integração com Firestore (salvar progresso)
2. Tela de revisão de respostas
3. Cálculo de progresso real (substituir 0%)

### Média Prioridade:

4. Desafio Diário (5 perguntas/dia + streak)
5. Meu Progresso (estatísticas + badges)

### Baixa Prioridade:

6. Leaderboard (ranking global/amigos)

---

## 🎨 Design System

- Fundo branco (`theme.colors.card`)
- Ícones: Fundo `accent` + ícone `primary`
- Sem sombras (apenas bordas)
- Tipografia e espaçamento via tokens do tema
