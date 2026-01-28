import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/configs/firebase/firebase";
import { getCachedAudioUri, checkAudioCache } from "@/services/audio/audioCacheService";
import { IAmbientAudio } from "@/types/ambientAudio";

const AUDIO_STORAGE_PATH = "prayers/audio";

/**
 * Mapeamento de nomes de arquivo para metadados (Essencial para UX instantânea)
 */
export const AUDIO_METADATA: Record<
  string,
  { title: string; icon: "music" | "waves" | "moon" }
> = {
  "AveMaria.mp3": { title: "Ave Maria", icon: "music" },
  "ClairDeLune.mp3": { title: "Clair de Lune", icon: "music" },
  "Gymnopedie.mp3": { title: "Gymnopedie", icon: "waves" },
  "Nocturne.mp3": { title: "Nocturne", icon: "moon" },
};

/**
 * Retorna lista de áudios baseada APENAS nos metadados locais (Instantâneo)
 * Não faz chamadas de rede iniciais.
 */
export async function getAmbientAudios(): Promise<IAmbientAudio[]> {
  const audios: IAmbientAudio[] = Object.keys(AUDIO_METADATA).map((fileName) => {
    const metadata = AUDIO_METADATA[fileName];
    return {
      id: fileName.replace(".mp3", ""),
      title: metadata.title,
      fileName: fileName,
      storagePath: `${AUDIO_STORAGE_PATH}/${fileName}`,
      icon: metadata.icon,
    };
  });

  return audios;
}

/**
 * Verifica se o áudio já está em cache localmente (Rápido, sem rede)
 */
export async function checkLocalAudioAvailability(
  fileName: string
): Promise<string | null> {
  return checkAudioCache(fileName);
}

/**
 * Baixa o áudio do Firebase se necessário
 */
export async function downloadAudio(
  storagePath: string,
  fileName: string
): Promise<string> {
  try {
    // Obter URL de download do Firebase Storage
    const storageRef = ref(storage, storagePath);
    const downloadUrl = await getDownloadURL(storageRef);

    // Usar serviço de cache para baixar (forçando nome de arquivo fixo)
    const localUri = await getCachedAudioUri(downloadUrl, fileName);
    return localUri;
  } catch (error) {
    console.error("[AmbientAudio] Erro ao baixar áudio:", error);
    throw error;
  }
}

/**
 * @deprecated Use downloadAudio ou checkLocalAudioAvailability
 */
export async function getAudioLocalUri(audioPath: string): Promise<string> {
  // Extrair nome do arquivo do path
  const fileName = audioPath.split("/").pop() || "";
  return downloadAudio(audioPath, fileName);
}
