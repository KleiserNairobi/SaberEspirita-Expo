Projeto: SaberEspirita-Expo — Regras obrigatórias

TypeScript

- Strict sempre; tipar APIs públicas, props e stores.
- Evitar any (usar unknown quando necessário), evitar enums (preferir union types).
- EXTREMAMENTE PROIBIDO usar tipos do @react-native-firebase/firestore (FirebaseFirestoreTypes etc). Usar sempre firebase/\* (Web SDK) para Firestore/Storage/Auth e seus tipos (Timestamp etc). RN Firebase somente para Analytics.

Arquivos e imports

- Imports internos sempre via @/ (evitar ../../).
- Ordem: React/RN → libs externas → @/ internos → types.
- Estrutura: componentes globais em src/components/ComponentName/{index.tsx,styles.ts}; telas em src/pages/feature/index.tsx (+ styles.ts se grande).

Componentes e funções

- Preferir named exports e function declarations (export function ...).
- default export somente onde já é padrão do projeto.
- Sem comentários no código, a menos que solicitado explicitamente.

Estado e dados

- Estado global/persistente via Zustand.
- Data fetching remoto obrigatório via TanStack Query (evitar useEffect+useState para fetch).
- Async sempre com async/await + try/catch; invalidar queries após mutações quando necessário.

Tema e estilos

- Estilos via StyleSheet.create; evitar objetos inline para estilos fixos.
- Usar tokens do tema (theme.colors/theme.spacing/theme.radius/theme.text); nunca usar theme.font.
- Respeitar safe-area quando houver BottomSheet/footers.

Workflows UI

- Alert é proibido. Para mensagens/erros/perguntas usar BottomSheetMessage (ou BottomSheetModal já padronizado).
