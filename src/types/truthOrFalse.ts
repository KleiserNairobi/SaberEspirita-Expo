import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

/**
 * Interface para uma pergunta de Verdade ou Mentira
 */
export interface ITruthOrFalseQuestion {
  id: string;
  topic: string;
  question: string;
  correct: boolean;
  explanation: string;
  reference: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
}
