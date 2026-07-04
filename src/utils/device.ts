import { Platform } from "react-native";

import * as Application from "expo-application";
import * as SecureStore from "expo-secure-store";

const SECURE_DEVICE_KEY = "banned_device_secure_id";

/**
 * Gera um UUID v4 simples em Javascript Puro.
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Obtém ou gera um ID de dispositivo seguro e persistente usando o SecureStore.
 * No iOS, isso é salvo no Keychain e sobrevive à desinstalação do aplicativo.
 */
export async function getOrCreateSecureDeviceId(): Promise<string> {
  try {
    let secureId = await SecureStore.getItemAsync(SECURE_DEVICE_KEY);

    if (!secureId) {
      secureId = generateUUID();
      await SecureStore.setItemAsync(SECURE_DEVICE_KEY, secureId, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      console.log("DeviceUtils: Novo secureDeviceId gerado e salvo:", secureId);
    } else {
      console.log("DeviceUtils: secureDeviceId recuperado:", secureId);
    }

    return secureId;
  } catch (error) {
    console.error("DeviceUtils: Erro ao gerenciar secureDeviceId no SecureStore:", error);
    // Fallback para um UUID temporário em caso de falha crítica de hardware
    return generateUUID();
  }
}

export interface DeviceIdentifiers {
  androidId: string | null;
  iosIdfv: string | null;
  secureDeviceId: string;
}

/**
 * Obtém todos os identificadores disponíveis para este dispositivo.
 */
export async function getDeviceIdentifiers(): Promise<DeviceIdentifiers> {
  let androidId: string | null = null;
  let iosIdfv: string | null = null;

  try {
    if (Platform.OS === "android") {
      androidId = Application.getAndroidId();
    } else if (Platform.OS === "ios") {
      iosIdfv = await Application.getIosIdForVendorAsync();
    }
  } catch (error) {
    console.warn("DeviceUtils: Falha ao obter IDs nativos do sistema:", error);
  }

  const secureDeviceId = await getOrCreateSecureDeviceId();

  return {
    androidId,
    iosIdfv,
    secureDeviceId,
  };
}
