export interface IMeditation {
  id: string;
  title: string;
  description: string;
  author: string;
  durationMinutes: number;
  audioUrl: string; // Link obrigatório para a meditação guiada
  imageUrl?: string; // Thumbnail opcional
  categoryId?: string; // Caso o app expanda as meditações por categoria futuro
  isPremium?: boolean; // Sinalização para o futuro Paywall
  featured?: boolean; // Para destaque na UI
}

export interface IMeditationCategory {
  id: string;
  title: string;
  description?: string;
  image?: string;
  meditationCount: number;
}
