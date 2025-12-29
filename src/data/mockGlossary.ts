import { IGlossaryTerm } from "@/types/glossary";

export const MOCK_GLOSSARY: IGlossaryTerm[] = [
  {
    id: "1",
    term: "Perispírito",
    definition:
      "Corpo fluídico semimaterial que serve de intermediário entre o Espírito e o corpo físico. É o envoltório do Espírito, moldável pelo pensamento e que conserva a forma humana após a morte do corpo.",
    category: "Doutrina Básica",
    references: ["O Livro dos Espíritos, questão 135", "A Gênese, capítulo XIV"],
    relatedTerms: ["2", "3"],
    synonyms: ["Corpo fluídico", "Envoltório perispiritual"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    term: "Reencarnação",
    definition:
      "Princípio segundo o qual o Espírito retorna à vida corpórea múltiplas vezes para sua evolução moral e intelectual. Cada existência é uma oportunidade de progresso e reparação.",
    category: "Doutrina Básica",
    references: [
      "O Livro dos Espíritos, questões 166-170",
      "O Evangelho Segundo o Espiritismo, cap. IV",
    ],
    relatedTerms: ["4", "5"],
    synonyms: ["Palingenesia", "Renascimento"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    term: "Mediunidade",
    definition:
      "Faculdade que permite a comunicação entre os Espíritos e os encarnados. Todo aquele que sente, em grau qualquer, a influência dos Espíritos é médium.",
    category: "Mediunidade",
    references: ["O Livro dos Médiuns, cap. XIV", "O Livro dos Espíritos, questão 459"],
    relatedTerms: ["6", "7"],
    synonyms: ["Faculdade mediúnica"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    term: "Lei de Causa e Efeito",
    definition:
      "Princípio universal segundo o qual toda ação gera uma reação correspondente. No Espiritismo, explica as provações e expiações como consequências naturais de atos passados.",
    category: "Moral e Ética",
    references: [
      "O Livro dos Espíritos, questões 964-967",
      "O Evangelho Segundo o Espiritismo, cap. V",
    ],
    relatedTerms: ["2", "8"],
    synonyms: ["Carma", "Lei de ação e reação"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    term: "Fluido Universal",
    definition:
      "Elemento primitivo que constitui a base de toda a matéria e energia do universo. É a matéria primordial, sutil e imponderável, que serve de intermediário entre o espírito e a matéria grosseira.",
    category: "Ciência Espírita",
    references: ["A Gênese, capítulo XIV", "O Livro dos Espíritos, questão 27"],
    relatedTerms: ["1", "9"],
    synonyms: ["Matéria cósmica universal", "Éter"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
