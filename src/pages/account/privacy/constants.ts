import {
  Database,
  FileText,
  Mail,
  RefreshCw,
  Scale,
  Share2,
  Shield,
  Target,
} from "lucide-react-native";

export const PRIVACY_POLICY = {
  lastUpdate: "01/07/2025",
  email: "quiz.saberespirita@gmail.com",

  intro: {
    text: "Esta Política de Privacidade descreve como o aplicativo Saber Espírita coleta, utiliza e protege as informações dos usuários. Ao utilizar o aplicativo, você concorda com os termos desta política. Se você não concordar, por favor, não continue a usar o aplicativo.",
  },

  sections: [
    {
      id: "collection",
      icon: Database,
      title: "Coleta de Informações",
      summary: "Quais dados coletamos ao criar sua conta",
      content: `Ao se cadastrar no aplicativo Saber Espírita, coletamos as seguintes informações:

• Apelido/Nome (obrigatório): Usado para sua identificação dentro do aplicativo, placares e para personalizar sua experiência.

• Endereço de e-mail (obrigatório): Usado para login, recuperação de senha e, opcionalmente, para comunicações importantes do aplicativo, como notícias, atualizações ou informações sobre sua conta.

• Senha (obrigatória): Armazenada de forma criptografada para proteger o acesso à sua conta.`,
    },
    {
      id: "usage",
      icon: Target,
      title: "Uso das Informações",
      summary: "Como utilizamos seus dados",
      content: `As informações coletadas são utilizadas exclusivamente para os seguintes propósitos:

• Gerenciamento da Conta: Para permitir que você faça login, acesse seu perfil e recupere sua senha.

• Personalização da Experiência: O apelido é usado para personalizar a interface do quiz e exibido em placares de pontuação.

• Comunicações: Seu e-mail poderá ser usado para enviar informações relacionadas ao aplicativo (como avisos de serviço, novidades ou recuperação de conta), caso você não desative essa opção.

• Melhoria do Serviço: As informações agregadas e anônimas (não identificáveis pessoalmente) sobre o uso geral do aplicativo podem ser analisadas para entender padrões de uso e melhorar a experiência do usuário.`,
    },
    {
      id: "sharing",
      icon: Share2,
      title: "Compartilhamento de Informações",
      summary: "Com quem compartilhamos seus dados",
      content: `O aplicativo Saber Espírita não compartilha suas informações pessoais (apelido, e-mail, senha, nome) com terceiros, incluindo empresas, organizações ou indivíduos, exceto quando exigido por lei.`,
    },
    {
      id: "security",
      icon: Shield,
      title: "Segurança",
      summary: "Como protegemos suas informações",
      content: `A segurança das suas informações é muito importante para nós. Embora nenhuma transmissão de dados pela internet seja 100% segura, tomamos medidas razoáveis para proteger as informações que coletamos, como a criptografia da sua senha.`,
    },
    {
      id: "rights",
      icon: Scale,
      title: "Seus Direitos",
      summary: "Menores de idade e consentimento",
      content: `O aplicativo Saber Espírita aborda a doutrina espírita e é destinado principalmente a adolescentes (a partir de 13 anos) e adultos. Embora não contenha material impróprio para outras idades, seu conteúdo pode ser mais bem compreendido por um público mais maduro.

Caso você seja menor de 18 anos, certifique-se de ter a permissão de seus pais ou responsáveis antes de se cadastrar, usar o aplicativo e fornecer qualquer informação pessoal, incluindo o e-mail e o nome.

Não coletamos intencionalmente informações de menores de 13 anos. Se tomarmos conhecimento de que coletamos informações de um menor de 13 anos sem o consentimento dos pais, tomaremos medidas para remover essas informações de nossos servidores.`,
    },
    {
      id: "changes",
      icon: RefreshCw,
      title: "Alterações na Política",
      summary: "Como atualizamos esta política",
      content: `Reservamo-nos o direito de atualizar ou modificar esta Política de Privacidade a qualquer momento. Quaisquer alterações significativas serão notificadas através de uma atualização no aplicativo ou em nosso site, e a data da "Última Atualização" será revisada.`,
    },
    {
      id: "contact",
      icon: Mail,
      title: "Contato",
      summary: "Como entrar em contato conosco",
      content: `Se você tiver alguma dúvida ou preocupação relacionada a esta Política de Privacidade ou ao uso do aplicativo Saber Espírita, por favor, entre em contato conosco pelo seguinte endereço de e-mail: quiz.saberespirita@gmail.com`,
    },
  ],
} as const;
