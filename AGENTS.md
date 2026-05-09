# SaberEspirita-Expo — Regras obrigatórias (AGENTS)

## TypeScript

- Strict sempre; tipar APIs públicas, props e stores.
- Evitar `any` (usar `unknown` quando necessário) e evitar `enum` (preferir union types).
- EXTREMAMENTE PROIBIDO usar tipos do `@react-native-firebase/firestore` (ex.: `FirebaseFirestoreTypes`). Usar sempre `firebase/*` (Web SDK) para Firestore/Storage/Auth e seus tipos (ex.: `Timestamp`). `@react-native-firebase/*` somente para Analytics.

## Arquivos e imports

- Imports internos sempre via `@/` (evitar `../../`).
- Ordem de imports: React/RN → libs externas → `@/` internos → types.
- Estrutura:
  - Componentes globais: `src/components/ComponentName/{index.tsx, styles.ts}`
  - Telas: `src/pages/feature/index.tsx` (+ `styles.ts` se grande)

## Componentes e funções

- Preferir named exports e function declarations (`export function ...`).
- `export default` somente onde já é padrão do projeto.
- Não adicionar comentários no código, a menos que solicitado explicitamente.

## Estado e dados

- Estado global/persistente via Zustand.
- Data fetching remoto obrigatório via TanStack Query (evitar `useEffect` + `useState` para fetch).
- Async com `async/await` + `try/catch`; invalidar queries após mutações quando necessário.

## Tema e estilos

- Estilos via `StyleSheet.create`; evitar objetos inline para estilos fixos.
- Usar tokens do tema (`theme.colors`, `theme.spacing`, `theme.radius`, `theme.text`); nunca usar `theme.font`.
- Respeitar safe-area quando houver BottomSheet/footers.

## Workflows UI

- `Alert` é proibido. Para mensagens/erros/perguntas usar `BottomSheetMessage` (ou `BottomSheetModal` já padronizado).
