import { doc, getDoc } from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import * as Storage from "@/utils/Storage";
import { getDeviceIdentifiers } from "@/utils/device";

const LOCAL_BANNED_KEY = "device_is_banned_offline";

export const deviceBlockService = {
  /**
   * Verifica se o dispositivo atual está banido na raiz.
   * Consulta primeiro o cache offline local por segurança extrema e rapidez,
   * depois consulta o Firestore para sincronizar o status.
   */
  async checkDeviceBanStatus(): Promise<boolean> {
    // 1. Verificar primeiro o cache offline local (imediato e à prova de perda de conexão intencional)
    const isBannedOffline = Storage.loadBoolean(LOCAL_BANNED_KEY);
    if (isBannedOffline === true) {
      console.log("DeviceBlockService: Dispositivo banido detectado no cache offline.");
      return true;
    }

    try {
      // 2. Obter identificadores do dispositivo
      const { androidId, iosIdfv, secureDeviceId } = await getDeviceIdentifiers();

      const idsToCheck = [secureDeviceId, androidId, iosIdfv].filter(Boolean) as string[];

      if (idsToCheck.length === 0) {
        return false;
      }

      console.log(
        "DeviceBlockService: Consultando status de banimento para IDs:",
        idsToCheck
      );

      // 3. Consultar Firestore em paralelo para cada ID
      const checkPromises = idsToCheck.map((id) => getDoc(doc(db, "banned_devices", id)));
      const snapshots = await Promise.all(checkPromises);

      const hasBannedDoc = snapshots.some((docSnap) => docSnap.exists());

      if (hasBannedDoc) {
        console.log("DeviceBlockService: Dispositivo banido confirmado pelo Firestore!");
        // Salvar localmente para bloquear mesmo sem rede na próxima vez
        Storage.saveBoolean(LOCAL_BANNED_KEY, true);
        return true;
      }

      // Se consultou com sucesso e NÃO está banido, garantimos que o cache offline local esteja limpo
      // (Isso permite que administradores desbanam o aparelho removendo o ID do Firestore)
      if (isBannedOffline !== false) {
        Storage.saveBoolean(LOCAL_BANNED_KEY, false);
      }
      return false;
    } catch (error) {
      console.warn(
        "DeviceBlockService: Erro ao verificar banimento no Firestore (usando cache local):",
        error
      );
      // Como já validamos no início que isBannedOffline não é true, retornamos false
      return false;
    }
  },

  /**
   * Força a marcação deste dispositivo como banido localmente.
   * Útil se detectarmos uma sessão de usuário banido ativa no app.
   */
  markAsBannedLocal(): void {
    Storage.saveBoolean(LOCAL_BANNED_KEY, true);
  },
};
