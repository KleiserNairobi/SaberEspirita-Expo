import { useQuery } from "@tanstack/react-query";
import { ambientAudioApiService } from "@/services/api/ambientAudioApiService";
import { IAmbientAudio } from "@/types/ambientAudio";

/**
 * Hook para carregar áudios de ambiente via API REST Spring Boot
 */
export function useAmbientAudios() {
  return useQuery({
    queryKey: ["ambientAudios"],
    queryFn: async (): Promise<IAmbientAudio[]> => {
      return ambientAudioApiService.getAmbientAudios();
    },
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
    refetchOnMount: true,
  });
}
