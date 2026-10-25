import { Angry, Annoyed, Frown, Meh, Radar, Smile, SmilePlus } from "lucide-react-native";

import { UserMood } from "@/stores/moodStore";

export interface IMoodItem {
  id: UserMood;
  icon: any;
  label: string;
  subtitle: string;
  noun: string;
}

export const MOODS: IMoodItem[] = [
  {
    id: "NORMAL",
    icon: Smile,
    label: "Equilibrado / Normal",
    subtitle: "Em harmonia, paz interior e serenidade",
    noun: "harmonia",
  },
  {
    id: "CALMO",
    icon: Meh,
    label: "Estou Calmo",
    subtitle: "Quietude de espírito e tranquilidade no coração",
    noun: "calma",
  },
  {
    id: "TRISTE",
    icon: Frown,
    label: "Sentindo Tristeza",
    subtitle: "Buscando consolo divino, alívio e esperança",
    noun: "consolo",
  },
  {
    id: "ANSIOSO",
    icon: Annoyed,
    label: "Com Ansiedade",
    subtitle: "Buscando serenidade no peito e calma mental",
    noun: "paz",
  },
  {
    id: "GRATO",
    icon: SmilePlus,
    label: "Sinto Gratidão",
    subtitle: "Reconhecimento das bênçãos e sintonia de amor",
    noun: "luz",
  },
  {
    id: "IRRITADO",
    icon: Angry,
    label: "Estou Irritado",
    subtitle: "Buscando paciência, superação de mágoas e equilíbrio",
    noun: "equilíbrio",
  },
  {
    id: "CANSADO",
    icon: Radar,
    label: "Sinto Cansaço",
    subtitle: "Necessitando de renovação de forças e restauração",
    noun: "renovação",
  },
];
