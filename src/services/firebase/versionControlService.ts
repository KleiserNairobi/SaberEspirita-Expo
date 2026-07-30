import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";
import * as Storage from "@/utils/Storage";

const VERSION_CONTROL_DOC = "version_control";
const APP_SETTINGS_COLLECTION = "app_settings";
const VERSION_CONTROL_CACHE_KEY = "@version_control_cache";
const VERSION_CONTROL_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

interface PlatformVersionData {
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
}

interface IVersionControlCache {
  data: VersionControlData;
  timestamp: number;
}

/**
 * Busca dados de controle de versão do Firestore com cache MMKV de 24 horas
 */
export async function getVersionControlData(forceRefresh = false): Promise<VersionControlData | null> {
  const now = Date.now();
  if (!forceRefresh) {
    const cached = Storage.load<IVersionControlCache>(VERSION_CONTROL_CACHE_KEY);
    if (cached && now - cached.timestamp < VERSION_CONTROL_CACHE_TTL_MS) {
      console.log("VersionControlService: Retornando dados via cache MMKV (24h).");
      return cached.data;
    }
  }

  try {
    const docRef = doc(db, APP_SETTINGS_COLLECTION, VERSION_CONTROL_DOC);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn("Documento de version control não encontrado");
      return null;
    }

    const data = docSnap.data() as VersionControlData;
    Storage.save(VERSION_CONTROL_CACHE_KEY, {
      data,
      timestamp: now,
    });
    return data;
  } catch (error: any) {
    const cached = Storage.load<IVersionControlCache>(VERSION_CONTROL_CACHE_KEY);
    if (cached) {
      console.log("VersionControlService: Erro na rede. Retornando cache como fallback.");
      return cached.data;
    }

    if (error?.code === "permission-denied") {
      return null;
    }
    console.error("Erro ao buscar dados de version control:", error);
    throw error;
  }
}

/**
 * Atualiza configurações de versão para uma plataforma específica
 */
export async function updatePlatformVersion(
  platform: "ios" | "android",
  data: PlatformVersionData
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, APP_SETTINGS_COLLECTION, VERSION_CONTROL_DOC);
    const updateData = {
      [platform]: data,
      updated_at: new Date().toISOString(),
    };

    await setDoc(docRef, updateData, { merge: true });
    Storage.remove(VERSION_CONTROL_CACHE_KEY);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar versão da plataforma:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Atualiza mensagens de atualização
 */
export async function updateMessages(
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, APP_SETTINGS_COLLECTION, VERSION_CONTROL_DOC);
    const updateData = {
      message,
      updated_at: new Date().toISOString(),
    };

    await setDoc(docRef, updateData, { merge: true });
    Storage.remove(VERSION_CONTROL_CACHE_KEY);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar mensagens:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Ativa/desativa modo de manutenção
 */
export async function toggleMaintenanceMode(
  enabled: boolean,
  message = ""
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, APP_SETTINGS_COLLECTION, VERSION_CONTROL_DOC);
    const updateData = {
      maintenance_mode: enabled,
      maintenance_message: message,
      updated_at: new Date().toISOString(),
    };

    await setDoc(docRef, updateData, { merge: true });
    Storage.remove(VERSION_CONTROL_CACHE_KEY);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao alternar modo de manutenção:", error);
    return { success: false, error: error.message };
  }
}
