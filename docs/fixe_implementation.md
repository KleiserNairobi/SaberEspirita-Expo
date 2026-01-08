# Documentação do Módulo FIXE (Quizzes Standalone)

**Data de Implementação**: 08/01/2026  
**Status**: ✅ Core Completo | 🚧 Funcionalidades Extras Pendentes

---

## 📋 Visão Geral

O módulo FIXE é um sistema de quizzes standalone migrado do projeto CLI (React Native CLI) para o projeto Expo. Permite que usuários testem seus conhecimentos sobre Espiritismo através de categorias, subcategorias e quizzes com feedback imediato.

---

## 🗂️ Estrutura de Arquivos

```
src/pages/fix/
├── index.tsx                          # FixHomeScreen (Dashboard)
├── styles.ts
├── subcategories/
│   ├── index.tsx                      # SubcategoriesScreen
│   ├── styles.ts
│   └── components/
│       └── SubcategoryCard/
│           ├── index.tsx
│           └── styles.ts
├── quiz/
│   ├── index.tsx                      # QuizScreen (Execução)
│   ├── styles.ts
│   ├── result/
│   │   ├── index.tsx                  # QuizResultScreen
│   │   └── styles.ts
│   └── components/
│       ├── AnswerOption/
│       ├── QuestionCard/
│       └── QuizProgressBar/
└── components/
    └── CategoryCard/
        ├── index.tsx
        └── styles.ts
```

---

## 🎯 Funcionalidades Implementadas

### ✅ 1. Integração com Firestore (100%)

**Arquivo**: `src/services/firebase/quizService.ts`

Funções implementadas (copiadas do CLI):

- `getCategories()` - Busca categorias do Firestore (`categories` collection)
- `getSubcategories(categoryId)` - Busca subcategorias por categoria (`subcategories` collection)
- `getQuiz(subcategoryId)` - Busca quiz específico (`quizes/QUIZ-{subcategoryId}`)
- `getUserCompletedSubcategories(userId)` - Busca progresso do usuário
- `saveUserCompletedSubcategories()` - Salva subcategoria concluída
- `addUserHistory()` - Adiciona histórico de quiz
- `removeUserCompletedSubcategory()` - Remove subcategoria da lista de completados (Retake)
- `removeUserHistory()` - Remove histórico específico (Retake)
- `updateUserScore()` - Recalcula pontuação total do usuário (Retake)

**Hooks React Query**: `src/hooks/queries/useQuiz.ts`

- `useCategories()`
- `useSubcategories(categoryId)`
- `useQuiz(subcategoryId)`
- `useUserQuizProgress(userId)`

### ✅ 2. FixHomeScreen (Dashboard) - 100%

**Layout**: 2 colunas (FlatList com `numColumns={2}`)

**Características**:

- Grid de 6 categorias (Conceitos, Diversos, Espíritos, Filmes, Livros, Personagens)
- Cada card mostra:
  - Ícone (Lucide) alinhado à esquerda
  - Nome da categoria
  - Contador de questões
  - **Barra de progresso real**: calculada como `(subcategorias concluídas / subcategoryCount) * 100`
- Layout vertical, alinhamento à esquerda
- Navegação para SubcategoriesScreen

### ✅ 3. SubcategoriesScreen - 100%

**Layout**: Idêntico ao `AllTermsScreen` do Glossário

**Características**:

- **SectionList** com sticky header
- **Header**:
  - Botão voltar (circular, fundo accent)
  - Ícone central com 3 anéis concêntricos (borderWidth)
  - Título (nome da categoria) - `xxxl`, `semibold`
  - Subtítulo ("Escolha uma subcategoria para começar")
- **SearchBar sticky**: usa `@/pages/pray/components/SearchBar`
- Lista de subcategorias com:
  - Nome e descrição
  - Contador de questões
  - Ícone de check se concluída
- **Lógica de Refazer Quiz**:
  - Ao clicar em subcategoria completada, abre `QuizRetakeBottomSheet`.
  - Opções "Não" (Cancelar) e "Sim" (Responder).
  - "Sim" remove histórico, atualiza cache (remove check) e inicia quiz do zero.

### ✅ 4. QuizScreen (Execução) - 100%

**Características**:

- Navegação de perguntas com barra de progresso
- Feedback visual imediato (verde/vermelho)
- Botões "Confirmar" e "Próxima"
- Botão "Parar" com confirmação
- Cálculo de resultados (acertos, percentual, nível)

### ✅ 5. QuizResultScreen - 100%

**Características**:

- Sistema de estrelas (1-4 baseado no percentual)
- Estatísticas (acertos/total, percentual)
- Mensagens motivacionais por nível (Ótimo/Bom/Regular/Fraco)
- Botões "Continuar" e "Revisar e Aprender"

### ✅ 6. Navegação - 100%

**Rotas**: `FixStackParamList`

- `FixHome` → `Subcategories` → `Quiz` → `QuizResult`

---

## 🚧 Funcionalidades Pendentes

- [ ] **ReviewScreen**: Tela de revisão de respostas com explicações doutrinárias
- [ ] **LeaderboardScreen**: Ranking global/amigos
- [ ] **Desafio Diário**: Card + lógica de 5 perguntas/dia + streak
- [ ] **Meu Progresso**: Estatísticas gerais + badges/conquistas

---

## 🎨 Design System

**Componentes Reutilizáveis**:

- `CategoryCard` (2 colunas, vertical, alinhado à esquerda)
- `SubcategoryCard` (horizontal, com check)
- `AnswerOption` (feedback verde/vermelho)
- `QuestionCard`
- `QuizProgressBar`
- `SearchBar` (de `@/pages/pray/components/SearchBar`)

**Padrões**:

- Fundo: `theme.colors.background`
- Cards: `theme.colors.card`
- Ícones: `theme.colors.primary` (verde)
- Accent: `theme.colors.accent` (verde claro)

---

## 📊 Estrutura de Dados (Firestore)

### Categories

```typescript
{
  id: string;
  title: string;
  description: string;
  quizCount: number;
  subcategoryCount: number; // Usado para calcular progresso
}
```

### Subcategories

```typescript
{
  id: string;
  idCategory: string;
  title: string;
  subtitle: string;
  quizCount: number;
}
```

### Quizzes

```typescript
{
  id: "QUIZ-{subcategoryId}";
  idCategory: string;
  idSubcategory: string;
  questions: IQuestion[];
}
```

### User Progress

```typescript
// Collection: users_completed_subcategories/{userId}
{
  completedSubcategories: {
    [categoryId]: string[]; // Array de subcategoryIds
  }
}
```

---

## 🔄 Próximos Passos

1. Implementar **ReviewScreen** (revisar respostas)
2. Implementar **LeaderboardScreen** (ranking)
3. Implementar **Desafio Diário** (5 perguntas/dia)
4. Implementar **Meu Progresso** (estatísticas + badges)
5. Reutilizar componentes no Quiz da Aula (módulo Estude)
