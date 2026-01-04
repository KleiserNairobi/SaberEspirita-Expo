import * as FileSystem from "expo-file-system/legacy";

/**
 * Serviço para gerenciar cache de áudios usando expo-file-system
 *
 * Este serviço baixa áudios do Firebase Storage e os armazena localmente
 * para evitar downloads duplicados e economizar bandwidth.
 */

// Diretório de cache de áudios
// Assumindo que o legacy exporta documentDirectory
const AUDIO_CACHE_DIR = `${FileSystem.documentDirectory}audio/`;

/**
 * Garante que o diretório de cache existe
 */
async function ensureCacheDirectoryExists(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);

  if (!dirInfo.exists) {
    console.log("[AudioCache] Criando diretório de cache:", AUDIO_CACHE_DIR);
    await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
  }
}

/**
 * Gera nome de arquivo para cache baseado na URL
 */
function getCacheFileName(url: string): string {
  try {
    const decodedUrl = decodeURIComponent(url);
    const urlParts = decodedUrl.split("/");
    const fileNameWithQuery = urlParts[urlParts.length - 1];
    const fileName = fileNameWithQuery.split("?")[0];
    return fileName;
  } catch (error) {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    return fileName.split("?")[0];
  }
}

/**
 * Verifica se o áudio existe em cache e retorna URI local
 * Se não existir, baixa do Firebase Storage e salva em cache
 */
export async function getCachedAudioUri(storageUrl: string): Promise<string> {
  try {
    await ensureCacheDirectoryExists();

    const cacheFileName = getCacheFileName(storageUrl);
    const localUri = `${AUDIO_CACHE_DIR}${cacheFileName}`;

    // Verifica se já existe em cache
    const fileInfo = await FileSystem.getInfoAsync(localUri);

    if (fileInfo.exists && fileInfo.size && fileInfo.size > 0) {
      const sizeMB = Math.round((fileInfo.size / 1024 / 1024) * 10) / 10;
      console.log(`[AudioCache] Usando áudio em cache: ${cacheFileName} (${sizeMB} MB)`);
      return localUri;
    }

    // Se existe mas está vazio, deletar
    if (fileInfo.exists && (!fileInfo.size || fileInfo.size === 0)) {
      console.log("[AudioCache] Arquivo em cache está vazio, deletando:", cacheFileName);
      await FileSystem.deleteAsync(localUri, { idempotent: true });
    }

    // Não existe em cache ou estava vazio, fazer download
    console.log("[AudioCache] Baixando áudio do Firebase Storage:", cacheFileName);

    const downloadResult = await FileSystem.downloadAsync(storageUrl, localUri);

    if (downloadResult.status === 200) {
      console.log("[AudioCache] Download concluído:", cacheFileName);
      return downloadResult.uri;
    } else {
      throw new Error(`Falha no download: status ${downloadResult.status}`);
    }
  } catch (error) {
    console.error("[AudioCache] Erro ao obter áudio em cache:", error);
    return storageUrl;
  }
}

/**
 * Limpa todo o cache de áudios
 */
export async function clearAudioCache(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);

    if (dirInfo.exists) {
      console.log("[AudioCache] Limpando cache de áudios...");
      await FileSystem.deleteAsync(AUDIO_CACHE_DIR, { idempotent: true });
      console.log("[AudioCache] Cache limpo com sucesso");
    }
  } catch (error) {
    console.error("[AudioCache] Erro ao limpar cache:", error);
  }
}

/**
 * Retorna o tamanho total do cache em bytes
 */
export async function getCacheSize(): Promise<number> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);

    if (!dirInfo.exists) {
      return 0;
    }

    const files = await FileSystem.readDirectoryAsync(AUDIO_CACHE_DIR);
    let totalSize = 0;

    for (const file of files) {
      const fileInfo = await FileSystem.getInfoAsync(`${AUDIO_CACHE_DIR}${file}`);
      if (fileInfo.exists && !fileInfo.isDirectory) {
        totalSize += fileInfo.size || 0;
      }
    }

    return totalSize;
  } catch (error) {
    console.error("[AudioCache] Erro ao calcular tamanho do cache:", error);
    return 0;
  }
}
