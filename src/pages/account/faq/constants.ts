import {
  GraduationCap,
  BookOpen,
  Users,
  UserPlus,
  Gamepad2,
  Code,
  DollarSign,
  Mail,
  Lightbulb,
  Target,
  Sparkles,
} from "lucide-react-native";

export const FAQ_DATA = {
  lastUpdate: "18/12/2025",
  intro: {
    text: "Tem alguma dúvida? Confira se as respostas abaixo podem te ajudar.",
  },
  sections: [
    {
      id: "proposito",
      icon: GraduationCap,
      title: "Qual é o propósito do Saber Espírita?",
      summary: "Plataforma completa de educação espírita",
      content:
        "O Saber Espírita é uma plataforma completa de educação e aprendizado sobre a Doutrina Espírita. Oferecemos cursos estruturados, aulas didáticas e quizzes gamificados para promover o estudo, a autoavaliação e o crescimento espiritual de forma interativa e envolvente.",
    },
    {
      id: "diferencas",
      icon: Sparkles,
      title: "Qual a diferença entre cursos e quizzes?",
      summary: "Cursos ensinam, quizzes validam o aprendizado",
      content:
        "Os cursos são trilhas de aprendizado estruturado com aulas didáticas sobre temas da Doutrina Espírita. Já os quizzes são testes gamificados que validam e reforçam o conhecimento adquirido. Ambos trabalham juntos para uma experiência completa de educação.",
    },
    {
      id: "cadastro",
      icon: UserPlus,
      title: "É necessário se cadastrar para usar o app?",
      summary: "Sim, cadastro simples e rápido",
      content:
        "Sim, é necessário criar uma conta para acessar os cursos e acompanhar seu progresso. O cadastro é simples: basta informar nome, e-mail e criar uma senha.",
    },
    {
      id: "como-usar",
      icon: BookOpen,
      title: "Como funciona a plataforma?",
      summary: "Navegue por cursos, estude aulas e faça quizzes",
      content:
        "Navegue pela biblioteca de cursos, escolha um tema de seu interesse, estude as aulas disponíveis e teste seus conhecimentos com quizzes. Seu progresso é salvo automaticamente e você pode retomar de onde parou a qualquer momento.",
    },
    {
      id: "multiplayer",
      icon: Users,
      title: "Posso competir com outros usuários?",
      summary: "Em breve: rankings e modo multiplayer",
      content:
        "Atualmente a experiência é individual e focada no aprendizado pessoal. Porém, estamos desenvolvendo recursos de rankings e modo multiplayer para que você possa competir de forma saudável com outros estudantes.",
    },
    {
      id: "desenvolvedor",
      icon: Code,
      title: "Quem desenvolveu este aplicativo?",
      summary: "Kleiser Nairobi",
      content:
        "O aplicativo foi desenvolvido por Kleiser Nairobi, um desenvolvedor mobile e espírita comprometido em criar ferramentas que facilitem o estudo e a divulgação da Doutrina Espírita.",
    },
    {
      id: "contribuir-financeiro",
      icon: DollarSign,
      title: "Posso contribuir financeiramente?",
      summary: "Sim, ajuda a manter a plataforma",
      content:
        "Sim! Sua contribuição é fundamental para cobrir os custos de servidor, desenvolvimento de novos cursos e manutenção da plataforma. Assim, podemos continuar oferecendo conteúdo de qualidade gratuitamente para todos.",
    },
    {
      id: "como-contribuir",
      icon: Mail,
      title: "Como posso contribuir financeiramente?",
      summary: "Entre em contato por e-mail",
      content:
        "Para contribuir financeiramente, entre em contato pelo e-mail quiz.saberespirita@gmail.com. Agradecemos imensamente seu apoio!",
    },
    {
      id: "contribuir-conteudo",
      icon: Lightbulb,
      title: "Posso contribuir com conteúdo?",
      summary: "Sim, questões e sugestões de cursos",
      content:
        "Sim! Você pode contribuir com novas questões para quizzes ou sugerir temas para novos cursos. Envie suas ideias por e-mail para quiz.saberespirita@gmail.com. Todas as submissões passam por análise e, se aprovadas, serão publicadas em futuras atualizações. Sua colaboração é muito valiosa!",
    },
    {
      id: "objetivos-futuros",
      icon: Target,
      title: "Quais são os próximos passos da plataforma?",
      summary: "Mais cursos, multiplayer e internacionalização",
      content:
        "Estamos trabalhando para expandir a biblioteca de cursos, implementar modo multiplayer com rankings, adicionar recursos de gamificação (conquistas, badges) e oferecer suporte para outros idiomas, levando o conhecimento espírita para mais pessoas ao redor do mundo.",
    },
    {
      id: "como-jogar-quiz",
      icon: Gamepad2,
      title: "Como funcionam os quizzes?",
      summary: "Testes gamificados de múltipla escolha",
      content:
        "Os quizzes são testes de múltipla escolha que validam seu aprendizado. Você pode acessá-los após estudar as aulas de um curso ou explorar quizzes avulsos por categoria. Cada acerto soma pontos e ajuda a fixar o conhecimento adquirido.",
    },
  ],
};
