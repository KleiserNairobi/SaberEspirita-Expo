import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { IAmbientAudio } from "@/types/ambientAudio";

export const ambientAudioApiService = {
  /**
   * Obtém a lista de áudios ambientes para meditação e estudo.
   */
  async getAmbientAudios(): Promise<IAmbientAudio[]> {
    const response = await apiClient.get<any[]>("/ambient-audios");
    return (response.data || []).map((audio) => {
      const fileName = audio.fileName || `${audio.id}.mp3`;
      const rawPath = audio.url || audio.storagePath || `prayers/audio/${fileName}`;
      return {
        ...audio,
        fileName,
        storagePath: resolveCdnUrl(rawPath) || rawPath,
      };
    });
  },
};
