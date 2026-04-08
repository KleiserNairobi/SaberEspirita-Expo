import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserMood } from "@/stores/moodStore";
import { getPrayersByCategory } from "@/services/firebase/prayerService";
import { useAmbientAudios } from "./useAmbientAudios";
import { PrayerMoment } from "@/types/prayer";
import { IAmbientAudio } from "@/types/ambientAudio";

// Mapeamento de Humor ⮕ Categoria de Oração (Firebase ID)
const MOOD_TO_CATEGORY: Record<UserMood, PrayerMoment> = {
  CALMO: "DIARIO",
  TRISTE: "POR-ANIMO",
  ANSIOSO: "POR-PAZ",
  GRATO: "POR-GRATIDAO",
  IRRITADO: "POR-PAZ",
  CANSADO: "POR-ANIMO",
  DESCONHECIDO: "DIARIO",
};

// Mapeamento de Humor ⮕ Nome sugerido do Ambiente de Sintonia
// Nota: Os nomes reais (ex: Paz Lunar) virão do Firebase no futuro.
// Por enquanto, mapeamos para IDs de áudio existentes.
const MOOD_TO_AUDIO_ID: Record<UserMood, string> = {
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

  // Busca orações da categoria sugerida
  const { data: prayers, isLoading: isPrayersLoading } = useQuery({
    queryKey: ["prayers", "suggested", categoryId],
    queryFn: () => getPrayersByCategory(categoryId),
    enabled: !!categoryId,
  });

  // Busca lista de áudios para encontrar o sugerido
  const { data: audios, isLoading: isAudiosLoading } = useAmbientAudios();

  const suggestedContent = useMemo(() => {
    if (!prayers || prayers.length === 0 || !audios) return null;

    // Seleciona uma oração aleatória da categoria
    const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)];
    
    // Seleciona o áudio sugerido
    const suggestedAudio = audios.find((a) => a.id === audioId) || audios[0];

    return {
      prayer: randomPrayer,
      audio: suggestedAudio,
      mood: currentMood,
    };
  }, [prayers, audios, audioId, currentMood]);

  return {
    suggestedContent,
    isLoading: isPrayersLoading || isAudiosLoading,
  };
}
