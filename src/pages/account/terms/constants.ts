import {
  AlertTriangle,
  Ban,
  Copyright,
  Link,
  Mail,
  RefreshCw,
  Shield,
  Smartphone,
  User,
  Users,
} from "lucide-react-native";

export const TERMS_OF_USE = {
  lastUpdate: "03/07/2026",
  intro: {
    text: "Ao utilizar o aplicativo Saber Espírita, você concorda com os termos abaixo. Se você não concordar, por favor, não continue a usar o aplicativo.",
  },
  sections: [
    {
      id: "uso",
      icon: Smartphone,
      title: "Uso do Aplicativo",
      summary: "Propósito educativo e recreativo",
      content: `1.1 O aplicativo "Saber Espírita" tem como propósito promover o aprendizado e a divulgação da doutrina espírita, por meio de um quiz interativo que incentiva a autoavaliação, o estudo e o entretenimento. Seu uso é destinado a fins educativos e recreativos.

1.2 Espera-se que os usuários utilizem o aplicativo de forma ética e responsável, respeitando os princípios da doutrina espírita e os termos aqui descritos. O uso inadequado, ofensivo ou ilegal não é permitido.

1.3 Embora o conteúdo tenha sido elaborado com cuidado e dedicação, o aplicativo não se responsabiliza por eventuais interpretações incorretas ou aplicações individuais das informações fornecidas.

1.4 É vedada a utilização do aplicativo de forma abusiva ou automatizada, incluindo, mas não se limitando, à criação, exclusão ou recriação repetitiva de contas, tentativas de contornar restrições de acesso, manipulação de funcionalidades, uso de robôs, scripts ou qualquer prática que comprometa a segurança, estabilidade ou funcionamento da plataforma.

1.5 A critério da administração, contas que apresentem indícios de uso abusivo, fraude, spam ou qualquer conduta incompatível com estes Termos poderão ser suspensas ou encerradas, temporária ou definitivamente, independentemente de aviso prévio.`,
    },
    {
      id: "propriedade",
      icon: Copyright,
      title: "Propriedade Intelectual",
      summary: "Direitos autorais e uso",
      content: `2.1 Todos os direitos de propriedade intelectual relacionados ao aplicativo "Saber Espírita", incluindo mas não se limitando a design, gráficos, texto, imagens e código, são de propriedade exclusiva de Kleiser Nairobi de Oliveira.

2.2 Você não possui o direito de reproduzir, modificar, distribuir ou criar obras derivadas com base no aplicativo "Saber Espírita" sem o consentimento expresso por escrito do autor.`,
    },
    {
      id: "conteudo",
      icon: User,
      title: "Conteúdo do Usuário",
      summary: "Responsabilidade sobre dados inseridos",
      content: `3.1 O aplicativo pode permitir que você insira um nome ou apelido na tela de identificação para personalizar sua experiência. No entanto, você concorda em não inserir nomes ou conteúdo ofensivo, difamatório, ilegal ou que viole os direitos de terceiros.

3.2 Você mantém a propriedade do conteúdo que insere no aplicativo, mas concede a Kleiser Nairobi de Oliveira uma licença não exclusiva, global, irrevogável e sublicenciável para usá-lo, reproduzi-lo, modificá-lo e exibi-lo no aplicativo.`,
    },
    {
      id: "limitacao",
      icon: AlertTriangle,
      title: "Limitação de Responsabilidade",
      summary: "Uso por conta e risco",
      content: `4.1 O aplicativo "Saber Espírita" é fornecido "no estado em que se encontra", sem garantias de qualquer tipo, expressas ou implícitas. Não garantimos a precisão, confiabilidade ou disponibilidade contínua do aplicativo.

4.2 Kleiser Nairobi de Oliveira não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou da impossibilidade de uso do aplicativo.`,
    },
    {
      id: "idade",
      icon: Users,
      title: "Idade Mínima e Consentimento Parental",
      summary: "Restrições de idade",
      content: `O uso do aplicativo está autorizado apenas para pessoas com idade igual ou superior a 13 anos. Se você for menor de 18 anos, é necessário obter o consentimento de seus pais ou responsáveis legais para utilizar o aplicativo.`,
    },
    {
      id: "conformidade",
      icon: Shield,
      title: "Conformidade com Leis de Proteção de Dados",
      summary: "LGPD, GDPR e COPPA",
      content: `Ao utilizar o aplicativo, você declara estar ciente de que seus dados serão tratados de acordo com as legislações de proteção de dados aplicáveis, incluindo a Lei Geral de Proteção de Dados (LGPD) no Brasil, o Regulamento Geral sobre a Proteção de Dados (GDPR) na União Europeia e a Children's Online Privacy Protection Act (COPPA), nos Estados Unidos, quando aplicável.`,
    },
    {
      id: "terceiros",
      icon: Link,
      title: "Serviços de Terceiros",
      summary: "Integrações e políticas externas",
      content: `O aplicativo pode integrar serviços de terceiros para funcionalidades como autenticação, armazenamento, análise de dados ou notificações. Esses serviços possuem suas próprias políticas de privacidade e termos de uso, e podem coletar informações conforme suas diretrizes.`,
    },
    {
      id: "suspensao",
      icon: Ban,
      title: "Suspensão e Encerramento de Contas",
      summary: "Regras de conduta e penalidades",
      content: `8.1 Reservamo-nos o direito de suspender, restringir ou encerrar, temporária ou definitivamente, o acesso de qualquer usuário que utilize o aplicativo em desacordo com estes Termos de Uso ou que pratique condutas que possam comprometer a segurança, a estabilidade, a integridade ou o funcionamento da plataforma.

8.2 Constituem exemplos de uso indevido, sem prejuízo de outras condutas semelhantes:
• criação, exclusão ou recriação repetitiva de contas em curto período de tempo;
• tentativas de contornar bloqueios, restrições ou mecanismos de segurança do aplicativo;
• utilização de múltiplas contas para obter vantagens indevidas;
• uso de robôs, scripts, automações ou qualquer mecanismo destinado a manipular o funcionamento do aplicativo;
• qualquer prática que caracterize fraude, spam, abuso ou uso incompatível com a finalidade do aplicativo.

8.3 A adoção de medidas de suspensão ou encerramento poderá ocorrer de forma preventiva, sempre que forem identificados indícios razoáveis de uso abusivo ou atividades que representem risco à plataforma, aos seus usuários ou aos serviços utilizados pelo aplicativo.

8.4 Sempre que possível, o usuário poderá solicitar a revisão da medida adotada, entrando em contato pelo e-mail app.saberespirita@gmail.com. A análise será realizada a critério da administração do aplicativo, considerando os registros técnicos disponíveis.

8.5 A suspensão ou o encerramento da conta não gera direito a qualquer indenização, compensação ou reembolso, ressalvadas as hipóteses previstas na legislação aplicável.`,
    },
    {
      id: "alteracoes",
      icon: RefreshCw,
      title: "Alterações nos Termos de Uso",
      summary: "Atualizações e notificações",
      content: `Reservamo-nos o direito de modificar ou atualizar estes Termos de Uso a qualquer momento. Quaisquer alterações significativas serão notificadas através do aplicativo ou em nosso site.`,
    },
    {
      id: "contato",
      icon: Mail,
      title: "Contato",
      summary: "Dúvidas e suporte",
      content: `Se você tiver alguma dúvida ou preocupação relacionada a estes Termos de Uso ou ao uso do aplicativo "Saber Espírita", por favor, entre em contato conosco pelo e-mail: app.saberespirita@gmail.com`,
    },
  ],
};
