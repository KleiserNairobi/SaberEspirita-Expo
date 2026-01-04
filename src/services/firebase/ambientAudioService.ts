import { ref, getDownloadURL, listAll } from "firebase/storage";

import { storage } from "@/configs/firebase/firebase";
import { IAmbientAudio } from "@/types/ambientAudio";
import { getCachedAudioUri } from "@/services/audio/audioCacheService";

/**
 * Serviço para gerenciar áudios de ambiente do Firebase Storage
 */

const AUDIO_STORAGE_PATH = "prayers/audio";

/**
 * Mapeamento de nomes de arquivo para metadados
 * Define título e ícone para cada música
 */
const AUDIO_METADATA: Record<
  string,
  { title: string; icon: "music" | "waves" | "moon" }
> = {
  "AveMaria.mp3": {
    title: "Ave Maria",
    icon: "music",
  },
  "ClairDeLune.mp3": {
    title: "Clair de Lune",
    icon: "music",
  },
  "Gymnopedie.mp3": {
    title: "Gymnopedie",
    icon: "waves",
  },
  "Nocturne.mp3": {
    title: "Nocturne",
    icon: "moon",
  },
  "PianoMusicRelax.mp3": {
    title: "Piano Music Relax",
    icon: "music",
  },
};

/**
 * Lista todos os áudios disponíveis no Firebase Storage
 * Retorna apenas as 5 músicas essenciais definidas em AUDIO_METADATA
 */
export async function getAmbientAudios(): Promise<IAmbientAudio[]> {
  try {
    console.log("[AmbientAudio] Listando áudios do Firebase Storage...");

    const storageRef = ref(storage, AUDIO_STORAGE_PATH);
    const result = await listAll(storageRef);

    const audios: IAmbientAudio[] = [];

    for (const itemRef of result.items) {
      const fileName = itemRef.name;

      // Apenas processar músicas que estão no AUDIO_METADATA (5 essenciais)
      if (AUDIO_METADATA[fileName]) {
        const metadata = AUDIO_METADATA[fileName];

        audios.push({
          id: fileName.replace(".mp3", ""),
          title: metadata.title,
          fileName: fileName,
          storagePath: `${AUDIO_STORAGE_PATH}/${fileName}`,
          icon: metadata.icon,
        });
      } else {
        console.log("[AmbientAudio] Ignorando arquivo não essencial:", fileName);
      }
    }

    console.log(`[AmbientAudio] ${audios.length} áudios encontrados`);
    return audios;
  } catch (error) {
    console.error("[AmbientAudio] Erro ao listar áudios:", error);
    return [];
  }
}

/**
 * Obtém a URI local de um áudio (com cache)
 * Primeiro tenta buscar do cache, se não existir, baixa do Firebase Storage
 *
 * @param audioPath - Caminho do áudio no Storage (ex: "prayers/audio/AveMaria.mp3")
 * @returns URI local do arquivo
 */
export async function getAudioLocalUri(audioPath: string): Promise<string> {
  try {
    // Obter URL de download do Firebase Storage
    const storageRef = ref(storage, audioPath);
    const downloadUrl = await getDownloadURL(storageRef);

    // Usar serviço de cache para obter URI local
    const localUri = await getCachedAudioUri(downloadUrl);

    return localUri;
  } catch (error) {
    console.error("[AmbientAudio] Erro ao obter URI local:", error);
    throw error;
  }
}
