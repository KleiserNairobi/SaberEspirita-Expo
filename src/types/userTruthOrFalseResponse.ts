import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

/**
 * Interface para a resposta do usuário a uma pergunta de Verdade ou Mentira
 */
export interface IUserTruthOrFalseResponse {
  id: string; // formato: `${userId}_${dateString}`
  userId: string;
  date: string; // YYYY-MM-DD
  questionId: string; // ID da pergunta no JSON local
  userAnswer: boolean; // O que o usuário respondeu (true = Verdade, false = Mentira)
  isCorrect: boolean; // Se acertou ou errou
  timeSpent: number; // Tempo em segundos para responder
  respondedAt: FirebaseFirestoreTypes.Timestamp; // Timestamp exato da resposta
  savedToLibrary: boolean; // Se o usuário salvou para revisão posterior
}
