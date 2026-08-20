import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { IAmbientAudio } from "@/types/ambientAudio";

export const ambientAudioApiService = {
  /**
   * Obtém a lista de áudios ambientes para meditação e estudo.
   */
  async getAmbientAudios(): Promise<IAmbientAudio[]> {
    const response = await apiClient.get<IAmbientAudio[]>("/ambient-audios");
    return (response.data || []).map((audio) => ({
      ...audio,
      storagePath: resolveCdnUrl(audio.storagePath) || audio.storagePath,
    }));
  },
};
