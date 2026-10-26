export type WisdomMoment =
  | 'LUTO_SAUDADE'
  | 'AFLICAO_PROVAS'
  | 'SAUDE_CURA'
  | 'PERDAO_HARMONIA'
  | 'ANSIEDADE_MEDO'
  | 'DESANIMO_FORCA'
  | 'GRATIDAO_LOUVOR'
  | 'DECISAO_SABEDORIA'
  | 'GERAL';

export interface IDailyWisdom {
  id: string;
  title: string;
  bookReference?: string;
  author: string;
  openingQuote?: string;
  content: string;
  publishDate?: string;
  dayOfYear?: number | null;
  category?: string;
  moment: WisdomMoment | string;
  imageUrl?: string;
  active?: boolean;
  createdAt?: string;
}

export interface IWisdomMomentMeta {
  key: WisdomMoment;
  label: string;
  subtitle: string;
  iconName: string;
}

export const WISDOM_MOMENTS: IWisdomMomentMeta[] = [
  {
    key: 'LUTO_SAUDADE',
    label: 'Luto e Saudade',
    subtitle: 'Consolo diante da partida e certeza da vida imortal',
    iconName: 'HeartHandshake',
  },
  {
    key: 'AFLICAO_PROVAS',
    label: 'Aflições e Provas',
    subtitle: 'Fortaleza moral, paciência e resignação ativa',
    iconName: 'ShieldAlert',
  },
  {
    key: 'SAUDE_CURA',
    label: 'Saúde e Cura',
    subtitle: 'Esperança, equilíbrio físico-espiritual e restauração',
    iconName: 'Sparkles',
  },
  {
    key: 'PERDAO_HARMONIA',
    label: 'Perdão e Harmonia',
    subtitle: 'Superação de mágoas, paz interior e fraternidade',
    iconName: 'Smile',
  },
  {
    key: 'ANSIEDADE_MEDO',
    label: 'Ansiedade e Medo',
    subtitle: 'Serenidade no peito e confiança na Providência Divina',
    iconName: 'Wind',
  },
  {
    key: 'DESANIMO_FORCA',
    label: 'Desânimo e Força',
    subtitle: 'Coragem para recomeçar e renovação da fé',
    iconName: 'Sunrise',
  },
  {
    key: 'GRATIDAO_LOUVOR',
    label: 'Gratidão e Louvor',
    subtitle: 'Reconhecimento das bênçãos e sintonia de amor',
    iconName: 'Heart',
  },
  {
    key: 'DECISAO_SABEDORIA',
    label: 'Decisão e Discernimento',
    subtitle: 'Clareza moral e inspiração para caminhos retos',
    iconName: 'Compass',
  },
];
