import apiClient from "./apiClient";

export interface PlatformVersionData {
  minimum_required_version: string;
  latest_version: string;
  critical: boolean;
  update_url: string;
}

export interface VersionControlData {
  ios?: PlatformVersionData;
  android?: PlatformVersionData;
  maintenance_mode?: boolean;
  maintenance_message?: string;
  message?: string;
  updated_at?: string;

  // Propriedades retornadas pela API Spring Boot / PostgreSQL
  androidMinVersion?: string;
  androidLatestVersion?: string;
  androidUpdateUrl?: string;
  iosMinVersion?: string;
  iosLatestVersion?: string;
  iosUpdateUrl?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
  announcementTitle?: string;
  announcementBody?: string;
  announcementActive?: boolean;
}

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
