# Implementação da Ofensiva (Streak) de Cursos

Este plano detalha a implementação do sistema de Ofensiva (Streak) voltado **exclusiva e unicamente para o consumo de Cursos/Aulas**, conforme solicitado. A ofensiva será exibida no topo da interface e contará com um modal informacional ao ser clicada.

## Consideração Arquitetural

Verificar se a inclusão dos campos na coleção principal do usuário (`users/{uid}`) está de acordo, em vez de criar uma subcoleção separada para progresso diário. Para o escopo de ofensivas, manter no doc do usuário economiza leituras no Firestore.
A renderização do componente será injetada no header customizado da tela principal (`StudyScreen`) e poderá ser reaproveitada em outras abas futuramente.

---

## 1. Backend & Regras de Negócio (Firestore)

### [NEW] `src/services/firebase/streakService.ts`
Criar serviço dedicado para gerenciar os dados de Ofensiva.
- **`updateCourseStreak(userId)`**: Função que calcula a ofensiva. Se a última atividade foi ontem, aumenta `+1`. Se foi hoje, mantém (já cumpriu). Se for antes de ontem, reseta para `1`.
- **`fetchUserStreak(userId)`**: Recupera os dados iniciais.

### [MODIFY] `src/services/firebase/progressService.ts`
- Modificar `markLessonAsCompleted` para que, ao final do registro de progresso, chame `streakService.updateCourseStreak(userId)`. Isso garante que terminar uma lição sempre atualize acione a verificação da ofensiva.

---

## 2. Gerenciamento de Estado (Zustand)

### [NEW] `src/stores/streakStore.ts`
Criar store global para que a UI saiba instantaneamente o estado da ofensiva sem precisar ler o banco constantemente.
- **Estado**: `courseStreak` (number), `lastCourseActivity` (string/Date), `hasCompletedToday` (boolean, derivado da data).
- **Ações**: `syncStreakWithFirebase()`, `incrementLocalStreak()` (para resposta otimista na UI).

### [MODIFY] `src/stores/authStore.ts` (Opcional)
- Adicionar um listener no `initializeAuth` ou acionar a sincronização da `streakStore` logo após o login bem-sucedido.

---

## 3. Componentes de Interface (UI)

### [NEW] `src/components/StreakBadge/index.tsx`
O ícone/indicador que ficará na barra superior.
- Visual: Foguinho 🔥 + Número.
- Lógica de Cores: 
  - **Cinza**: 0 dias.
  - **Laranja/Vermelho Vibrante**: Ofensiva > 0 dias E já cumpriu a meta de hoje (`hasCompletedToday: true`).
  - **Laranja Opaco/Pulsante** (opcional): Ofensiva > 0 dias, MAS ainda não cumpriu hoje (`hasCompletedToday: false`).
- Ação: `onPress` abre o Modal.

### [NEW] `src/components/StreakBottomSheet/index.tsx`
Modal (usando a padronização de BottomSheet do app) que é aberto ao clicar no Badge.
- Exibe de forma bonita: Foguinho grande, "Ofensiva de Estudos".
- Estatísticas: Sequência atual, Maior sequência.
- Mensagem de status: "Você já completou uma aula hoje!" ou "Faça uma lição do curso para manter sua chama acesa 🔥".

### [MODIFY] `src/pages/study/index.tsx`
- Injetar o componente `<StreakBadge />` dentro de `renderHeader()`, especificamente no `styles.headerContainer`, alinhado à direita para atuar como Topbar.
- Incluir o `<StreakBottomSheet />` no final do componente para ser acionado pelo estado interno de abertura.

---

## 4. Questão em Aberto (Header)
No momento, cada stack/tab no app (`Study`, `Fix`, `Meditate`) cria seu próprio layout de *Header*. Ao invés de criarmos uma única barra superior que sobrepõe às telas, vamos inserir o `<StreakBadge />` no Header da tela de Estudos (`StudyScreen`), que é a porta de entrada. Se precisar replicar na tela Fixe, apenas chamaremos o componente `<StreakBadge />` lá também.

---

## 5. Plano de Validação
1. Iniciar o app como usuário sem histórico: Verificar se a ofensiva é **0 (cinza)**.
2. Ler e concluir ao menos uma aula no player: Verificar se a Ofensiva muda para **1 (laranja vibrante)** na Home.
3. Clicar no ícone de fogo: Validar a abertura da aba indicando "Ação do dia concluída".
4. (No banco de dados) Alterar a data de última atividade para "ontem" manualmente e recarregar o app: Validar se a cor muda para indicar pendência (Não concluído hoje).
