import {
  Smile,
  CloudRain,
  Activity,
  Heart,
  Flame,
  Moon,
  Sun,
} from "lucide-react-native";
import { UserMood } from "@/stores/moodStore";

export const MOODS: { id: UserMood; icon: any; label: string; noun: string }[] = [
  { id: "NORMAL", icon: Smile, label: "Equilibrado / Normal", noun: "harmonia" },
  { id: "CALMO", icon: Sun, label: "Estou Calmo", noun: "calma" },
  { id: "TRISTE", icon: CloudRain, label: "Sentindo Tristeza", noun: "consolo" },
  { id: "ANSIOSO", icon: Activity, label: "Com Ansiedade", noun: "paz" },
  { id: "GRATO", icon: Heart, label: "Sinto Gratidão", noun: "luz" },
  { id: "IRRITADO", icon: Flame, label: "Estou Irritado", noun: "equilíbrio" },
  { id: "CANSADO", icon: Moon, label: "Sinto Cansaço", noun: "renovação" },
];
