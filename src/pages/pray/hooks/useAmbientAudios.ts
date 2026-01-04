import { useQuery } from "@tanstack/react-query";

import {
  getAmbientAudios,
  getAudioLocalUri,
} from "@/services/firebase/ambientAudioService";
import { IAmbientAudio } from "@/types/ambientAudio";

/**
 * Hook para carregar áudios de ambiente do Firebase Storage com cache
 *
 * Usa React Query para cache de metadados e expo-file-system para cache de arquivos
 */
export function useAmbientAudios() {
  return useQuery({
    queryKey: ["ambientAudios"],
    queryFn: async (): Promise<IAmbientAudio[]> => {
      // Buscar lista de áudios do Firebase Storage
      const audios = await getAmbientAudios();

      // Para cada áudio, obter URI local (com cache)
      const audiosWithLocalUri = await Promise.all(
        audios.map(async (audio) => {
          try {
            const localUri = await getAudioLocalUri(audio.storagePath);
            return {
              ...audio,
              localUri,
            };
          } catch (error) {
            console.error(
              `[useAmbientAudios] Erro ao obter URI para ${audio.title}:`,
              error
            );
            // Retorna sem localUri em caso de erro
            return audio;
          }
        })
      );

      return audiosWithLocalUri;
    },
    staleTime: 1000 * 60 * 60, // 1 hora - metadados não mudam frequentemente
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });
}
