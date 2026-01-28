import { useQuery } from "@tanstack/react-query";

import {
  checkLocalAudioAvailability,
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
      // Buscar lista de metadados locais (Instantâneo)
      const baseAudios = await getAmbientAudios();

      // Verificar cache local em paralelo (Rápido)
      const audiosWithStatus = await Promise.all(
        baseAudios.map(async (audio) => {
          try {
            // Verifica se o arquivo físico existe no cache baseado no nome
            // Não faz nenhuma chamada de rede
            const localUri = await checkLocalAudioAvailability(audio.fileName);
            return {
              ...audio,
              localUri: localUri || undefined, // undefined se não estiver em cache
            };
          } catch (error) {
            console.error(
              `[useAmbientAudios] Erro ao verificar cache para ${audio.title}:`,
              error
            );
            return audio;
          }
        })
      );

      return audiosWithStatus;
    },
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });
}
