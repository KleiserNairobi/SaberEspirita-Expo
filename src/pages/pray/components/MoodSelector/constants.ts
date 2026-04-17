import { UserMood } from "@/stores/moodStore";
import { Angry, Annoyed, Frown, Meh, Radar, Smile, SmilePlus } from "lucide-react-native";

export const MOODS: { id: UserMood; icon: any; label: string; noun: string }[] = [
  { id: "NORMAL", icon: Smile, label: "Equilibrado / Normal", noun: "harmonia" },
  { id: "CALMO", icon: Meh, label: "Estou Calmo", noun: "calma" },
  { id: "TRISTE", icon: Frown, label: "Sentindo Tristeza", noun: "consolo" },
  { id: "ANSIOSO", icon: Annoyed, label: "Com Ansiedade", noun: "paz" },
  { id: "GRATO", icon: SmilePlus, label: "Sinto Gratidão", noun: "luz" },
  { id: "IRRITADO", icon: Angry, label: "Estou Irritado", noun: "equilíbrio" },
  { id: "CANSADO", icon: Radar, label: "Sinto Cansaço", noun: "renovação" },
];
