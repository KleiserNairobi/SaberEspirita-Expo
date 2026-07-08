import {
  BadgeQuestionMark,
  BookA,
  ClipboardCheck,
  GraduationCap,
  HandHeart,
  LucideIcon,
  MessageCircleQuestion,
  Mic,
} from "lucide-react-native";

export type Biblioteca = {
  id: string;
  title: string;
  icon: LucideIcon;
};

export const Biblioteca: Biblioteca[] = [
  {
    id: "3",
    title: "Podcasts",
    icon: Mic,
  },
  {
    id: "2",
    title: "Glossário\nEspírita",
    icon: BookA,
  },
];
