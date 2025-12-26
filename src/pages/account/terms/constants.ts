import {
  Smartphone,
  Copyright,
  User,
  AlertTriangle,
  Users,
  Shield,
  Link,
  RefreshCw,
  Mail,
} from "lucide-react-native";

export const TERMS_OF_USE = {
  lastUpdate: "01/07/2025",
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

1.3 Embora o conteúdo tenha sido elaborado com cuidado e dedicação, o aplicativo não se responsabiliza por eventuais interpretações incorretas ou aplicações individuais das informações fornecidas.`,
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
      content: `Se você tiver alguma dúvida ou preocupação relacionada a estes Termos de Uso ou ao uso do aplicativo "Saber Espírita", por favor, entre em contato conosco pelo e-mail: quiz.saberespirita@gmail.com`,
    },
  ],
};
