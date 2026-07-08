export interface IPodcast {
  id: string;
  title: string;
  description: string;
  author: string;
  durationMinutes: number;
  audioUrl: string; // Link obrigatório para o episódio de podcast
  imageUrl?: string; // Thumbnail opcional
  isPremium?: boolean; // Sinalização para o futuro Paywall
  featured?: boolean; // Para destaque na UI
  createdAt?: Date; // Data de criação para badge "Novo"
}
