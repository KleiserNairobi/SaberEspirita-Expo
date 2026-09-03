import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserMood } from "@/stores/moodStore";
import { prayerApiService } from "@/services/api/prayerApiService";
import { useAmbientAudios } from "./useAmbientAudios";
import { PrayerMoment } from "@/types/prayer";

// Mapeamento de Humor ⮕ Categoria de Oração (Firebase ID)
const MOOD_TO_CATEGORY: Record<UserMood, PrayerMoment> = {
  NORMAL: "DIARIO",
  CALMO: "DIARIO",
  TRISTE: "POR-ANIMO",
  ANSIOSO: "POR-PAZ",
  GRATO: "POR-GRATIDAO",
  IRRITADO: "POR-PAZ",
  CANSADO: "POR-ANIMO",
  DESCONHECIDO: "DIARIO",
};

// Mapeamento de Humor ⮕ Nome sugerido do Ambiente de Sintonia
const MOOD_TO_AUDIO_ID: Record<UserMood, string> = {
  NORMAL: "ClairDeLune",
  CALMO: "ClairDeLune",
  TRISTE: "AveMaria",
  ANSIOSO: "Gymnopedie",
  GRATO: "Nocturne",
  IRRITADO: "Gymnopedie",
  CANSADO: "AveMaria",
  DESCONHECIDO: "ClairDeLune",
};

export function useSuggestedContent(mood: UserMood | null) {
  const currentMood = mood || "DESCONHECIDO";
  const categoryId = MOOD_TO_CATEGORY[currentMood];
  const audioId = MOOD_TO_AUDIO_ID[currentMood];

  // Busca orações da categoria sugerida com fallback para todas as orações
  const { data: prayers, isLoading: isPrayersLoading } = useQuery({
    queryKey: ["prayers", "suggested", categoryId],
    queryFn: async () => {
      const categoryPrayers = await prayerApiService.getPrayers({ categoryId });
      if (categoryPrayers && categoryPrayers.length > 0) {
        return categoryPrayers;
      }
      // Fallback: se a categoria não tiver itens no momento, busca as orações gerais
      return prayerApiService.getPrayers();
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 15,
  });

  // Busca lista de áudios para encontrar o sugerido
  const { data: audios, isLoading: isAudiosLoading } = useAmbientAudios();

  const suggestedContent = useMemo(() => {
    if (!prayers || prayers.length === 0) return null;

    // Seleciona o áudio sugerido (se houver lista de áudios disponível)
    const suggestedAudio = audios?.find((a) => a.id === audioId) || audios?.[0] || null;

    return {
      prayers: prayers, // Retorna todas as sugestões para scroll interno
      audio: suggestedAudio,
      mood: currentMood,
    };
  }, [prayers, audios, audioId, currentMood]);

  return {
    suggestedContent,
    isLoading: isPrayersLoading,
  };
}
