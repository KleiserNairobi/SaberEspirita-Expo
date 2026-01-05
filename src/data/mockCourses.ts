import { ICourse } from "@/types/course";

/**
 * Dados mock de cursos para desenvolvimento
 * TODO: Remover quando Firestore estiver populado
 */
export const MOCK_COURSES: ICourse[] = [
  {
    id: "1",
    title: "Introdução ao Espiritismo",
    description:
      "Compreenda os principais conceitos e doutrinas que fundamentam o Espiritismo. Explore a rica história desde suas origens até os dias atuais.",
    workloadMinutes: 180,
    difficultyLevel: "Iniciante",
    author: "Allan Kardec",
    lessonCount: 12,
    releaseYear: 2024,
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/saber-espirita.firebasestorage.app/o/courses%2Fbasico-espiritismo.png?alt=media&token=c87db838-3042-454a-8c32-f4843d038256",
    featured: true, // ⭐ Destaque em "Populares"
  },
  {
    id: "2",
    title: "Mediunidade e Desenvolvimento",
    description:
      "Aprenda sobre os diferentes tipos de mediunidade e como desenvolvê-la de forma segura e responsável, seguindo os ensinamentos espíritas.",
    workloadMinutes: 120,
    difficultyLevel: "Intermediário",
    author: "Chico Xavier",
    lessonCount: 8,
    releaseYear: 2024,
    imageUrl: require("@/assets/images/bkp/livro_dos_mediuns.png"),
  },
  {
    id: "3",
    title: "O Evangelho Segundo o Espiritismo",
    description:
      "Estudo profundo do Evangelho à luz da Doutrina Espírita. Compreenda as máximas morais de Jesus e sua aplicação prática.",
    workloadMinutes: 240,
    difficultyLevel: "Avançado",
    author: "Allan Kardec",
    lessonCount: 16,
    releaseYear: 2023,
    imageUrl: require("@/assets/images/bkp/evangelho_segundo_espiritismo.png"),
    featured: true, // ⭐ Destaque em "Populares"
  },
  {
    id: "4",
    title: "Reencarnação e Lei de Causa e Efeito",
    description:
      "Entenda o mecanismo da reencarnação e como a lei de causa e efeito rege nossa evolução espiritual através das múltiplas existências.",
    workloadMinutes: 150,
    difficultyLevel: "Iniciante",
    author: "Leon Denis",
    lessonCount: 10,
    releaseYear: 2024,
    imageUrl: require("@/assets/images/bkp/ceu_e_inferno.png"),
  },
  {
    id: "5",
    title: "O Livro dos Espíritos",
    description:
      "Estudo sistemático da obra fundamental do Espiritismo. Explore as 1019 questões que formam a base da Doutrina Espírita.",
    workloadMinutes: 300,
    difficultyLevel: "Avançado",
    author: "Allan Kardec",
    lessonCount: 20,
    releaseYear: 2023,
    imageUrl: require("@/assets/images/bkp/livro_dos_espiritos.png"),
    featured: true, // ⭐ Destaque em "Populares"
  },
  {
    id: "6",
    title: "Caridade e Amor ao Próximo",
    description:
      "Aprenda sobre a importância da caridade material e moral. Descubra como praticar o amor ao próximo no dia a dia.",
    workloadMinutes: 90,
    difficultyLevel: "Iniciante",
    author: "Emmanuel",
    lessonCount: 6,
    releaseYear: 2024,
    imageUrl: require("@/assets/images/bkp/a_genese.png"),
  },
];
