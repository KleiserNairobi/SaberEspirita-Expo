import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";

const VERSION_CONTROL_DOC = "version_control";
const APP_SETTINGS_COLLECTION = "app_settings";

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

/**
 * Busca dados de controle de versão do Firestore
 */
export async function getVersionControlData(): Promise<VersionControlData | null> {
  try {
    const docRef = doc(db, APP_SETTINGS_COLLECTION, VERSION_CONTROL_DOC);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn("Documento de version control não encontrado");
      return null;
    }

    return docSnap.data() as VersionControlData;
  } catch (error) {
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
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao alternar modo de manutenção:", error);
    return { success: false, error: error.message };
  }
}
