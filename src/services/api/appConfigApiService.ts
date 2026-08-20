import apiClient from "./apiClient";
import { VersionControlData } from "@/services/firebase/versionControlService";

export const appConfigApiService = {
  /**
   * Obtém a configuração global da aplicação (versão mínima exigida, modo manutenção e mensagens do sistema).
   */
  async getAppConfig(): Promise<VersionControlData | null> {
    try {
      const response = await apiClient.get<VersionControlData>("/app-config");
      return response.data || null;
    } catch {
      return null;
    }
  },
};
