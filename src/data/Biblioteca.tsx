import {
  BadgeQuestionMark,
  BookA,
  ClipboardCheck,
  HandHeart,
  LucideIcon,
  MessageCircleQuestion,
  NotebookText,
} from "lucide-react-native";

export type Biblioteca = {
  id: string;
  title: string;
  icon: LucideIcon;
};

export const Biblioteca: Biblioteca[] = [
  {
    id: "1",
    title: "Cursos\nEspíritas",
    icon: NotebookText,
  },
  {
    id: "2",
    title: "Glossário\nEspírita",
    icon: BookA,
  },
  {
    id: "3",
    title: "Teste seu\nConhecimento",
    icon: ClipboardCheck,
  },
  {
    id: "4",
    title: "Verdade ou\n Mentira?",
    icon: BadgeQuestionMark,
  },
  {
    id: "5",
    title: "Converse \ncom o Guia",
    icon: HandHeart,
  },
  {
    id: "6",
    title: "Pergunte \nao Sr. Allan",
    icon: MessageCircleQuestion,
  },
];
