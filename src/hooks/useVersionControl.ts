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
    const currentVersion = Application.nativeApplicationVersion;

    // Normalizar modo de manutenção
    const isMaintenance = Boolean(
      versionData.maintenanceMode ?? versionData.maintenance_mode
    );
    const maintenanceMsg =
      versionData.maintenanceMessage ?? versionData.maintenance_message;

    if (isMaintenance) {
      return {
        needUpdate: true,
        critical: true,
        maintenance: true,
        message: maintenanceMsg,
      };
    }

    // Extração flexível dos dados de versão (suporta DTO Spring Boot e JSON Firestore)
    const minVersion =
      platform === "android"
        ? (versionData.androidMinVersion ?? versionData.android?.minimum_required_version)
        : (versionData.iosMinVersion ?? versionData.ios?.minimum_required_version);

    const latestVersion =
      platform === "android"
        ? (versionData.androidLatestVersion ?? versionData.android?.latest_version)
        : (versionData.iosLatestVersion ?? versionData.ios?.latest_version);

    const updateUrl =
      platform === "android"
        ? (versionData.androidUpdateUrl ?? versionData.android?.update_url)
        : (versionData.iosUpdateUrl ?? versionData.ios?.update_url);

    const criticalFlag =
      platform === "android"
        ? Boolean(versionData.android?.critical)
        : Boolean(versionData.ios?.critical);

    if (!currentVersion || (!minVersion && !latestVersion)) {
      return { needUpdate: false, critical: false };
    }

    // Testar se versão instalada é menor que a versão mínima exigida
    const isBelowMin = minVersion
      ? compareVersions(currentVersion, minVersion) < 0
      : false;

    // Testar se versão instalada é menor que a versão mais recente publicada
    const isBelowLatest = latestVersion
      ? compareVersions(currentVersion, latestVersion) < 0
      : false;

    // Se for menor que a mínima OU menor que a mais recente, precisa atualizar
    const needUpdate = isBelowMin || isBelowLatest;

    // É crítico (impede continuar sem atualizar) se estiver abaixo da versão mínima
    // ou se o sinalizador critical do documento for verdadeiro.
    const isCritical = isBelowMin || (needUpdate && criticalFlag);

    const announceMessage =
      versionData.announcementBody || versionData.message
        ? {
            title: versionData.announcementTitle || "Atualização Disponível",
            body:
              typeof versionData.message === "string"
                ? versionData.message
                : versionData.announcementBody ||
                  "Uma nova versão do aplicativo com melhorias e novidades está disponível.",
            button_text: "Atualizar Agora",
          }
        : versionData.message;

    return {
      needUpdate,
      critical: isCritical,
      maintenance: false,
      currentVersion,
      minimumVersion: minVersion,
      latestVersion,
      updateUrl,
      message: announceMessage,
      isLatest: !isBelowLatest,
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
