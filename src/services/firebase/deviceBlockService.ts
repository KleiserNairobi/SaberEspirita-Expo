import { doc, getDoc } from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import * as Storage from "@/utils/Storage";
import { getDeviceIdentifiers } from "@/utils/device";

const LOCAL_BANNED_KEY = "device_is_banned_offline";
const BAN_CHECK_TIMESTAMP_KEY = "device_ban_check_timestamp";
const BAN_CHECK_TTL_MS = 60 * 60 * 1000; // 1 hora de TTL para consulta no Firestore

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

    // 2. Se a verificação foi realizada nos últimos 60 min e o dispositivo NÃO está banido, usar o cache
    const lastCheckTimestamp = Storage.load<number>(BAN_CHECK_TIMESTAMP_KEY) || 0;
    const now = Date.now();
    if (isBannedOffline === false && now - lastCheckTimestamp < BAN_CHECK_TTL_MS) {
      console.log(
        "DeviceBlockService: Checagem de banimento recente (menos de 1h). Skipping Firestore check."
      );
      return false;
    }

    try {
      // 3. Obter identificadores do dispositivo
      const { androidId, iosIdfv, secureDeviceId } = await getDeviceIdentifiers();

      const idsToCheck = [secureDeviceId, androidId, iosIdfv].filter(Boolean) as string[];

      if (idsToCheck.length === 0) {
        return false;
      }

      console.log(
        "DeviceBlockService: Consultando status de banimento para IDs:",
        idsToCheck
      );

      // 4. Consultar Firestore em paralelo para cada ID
      const checkPromises = idsToCheck.map((id) => getDoc(doc(db, "banned_devices", id)));
      const snapshots = await Promise.all(checkPromises);

      const hasBannedDoc = snapshots.some((docSnap) => docSnap.exists());

      if (hasBannedDoc) {
        console.log("DeviceBlockService: Dispositivo banido confirmado pelo Firestore!");
        // Salvar localmente para bloquear mesmo sem rede na próxima vez
        Storage.saveBoolean(LOCAL_BANNED_KEY, true);
        Storage.remove(BAN_CHECK_TIMESTAMP_KEY);
        return true;
      }

      // Se consultou com sucesso e NÃO está banido, garantimos que o cache offline local esteja limpo
      // e salvamos o timestamp da verificação para valer pelo TTL de 1h
      Storage.saveBoolean(LOCAL_BANNED_KEY, false);
      Storage.save(BAN_CHECK_TIMESTAMP_KEY, Date.now());
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
    Storage.remove(BAN_CHECK_TIMESTAMP_KEY);
  },
};
