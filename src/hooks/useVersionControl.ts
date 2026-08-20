import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Application from "expo-application";

import { compareVersions } from "@/utils/compareVersions";
import {
  appConfigApiService,
  VersionControlData,
} from "@/services/api/appConfigApiService";

interface VersionCheckResult {
  needUpdate: boolean;
  critical: boolean;
  maintenance?: boolean;
  currentVersion?: string;
  minimumVersion?: string;
  latestVersion?: string;
  updateUrl?: string;
  message?: string | { title?: string; body?: string; button_text?: string };
  isLatest?: boolean;
}

export function useVersionControl() {
  const [versionData, setVersionData] = useState<VersionControlData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados de version control
  const fetchVersionData = async () => {
    try {
      setLoading(true);
      const data = await appConfigApiService.getAppConfig();

      if (data) {
        setVersionData(data);
      } else {
        setError("Documento de version control não encontrado");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar dados de version control
  const updateVersionData = async (_newData: Partial<VersionControlData>) => {
    return { success: false, error: "Operação não suportada no cliente" };
  };

  // Verificar se precisa de atualização
  const checkVersion = (): VersionCheckResult => {
    if (!versionData) {
      return { needUpdate: false, critical: false };
    }

    const platform = Platform.OS === "ios" ? "ios" : "android";
    const platformData = versionData[platform];
    const currentVersion = Application.nativeApplicationVersion;

    if (!platformData || !currentVersion) {
      return { needUpdate: false, critical: false };
    }

    // Verificar se está em modo de manutenção
    if (versionData.maintenance_mode) {
      return {
        needUpdate: true,
        critical: true,
        maintenance: true,
        message: versionData.maintenance_message,
      };
    }

    // Verificar se a versão atual é menor que a mínima requerida
    const needUpdate =
      compareVersions(currentVersion, platformData.minimum_required_version) < 0;
    const isLatest = compareVersions(currentVersion, platformData.latest_version) >= 0;

    return {
      needUpdate,
      critical: needUpdate && platformData.critical,
      maintenance: false,
      currentVersion,
      minimumVersion: platformData.minimum_required_version,
      latestVersion: platformData.latest_version,
      updateUrl: platformData.update_url,
      message: versionData.message,
      isLatest,
    };
  };

  useEffect(() => {
    fetchVersionData();
  }, []);

  return {
    versionData,
    loading,
    error,
    checkVersion,
    updateVersionData,
    refetch: fetchVersionData,
  };
}
