import { Image } from "expo-image";

// Conjunto em memória para garantir que nenhuma URL seja baixada mais de uma vez por sessão
const prefetchedUrlsSet = new Set<string>();

/**
 * Realiza o prefetch em segundo plano de uma lista de URLs de imagens.
 * Garante que cada URL seja solicitada ao Expo Image exatamente uma única vez por sessão,
 * sem causar re-renderizações ou efeitos colaterais em estados React/Zustand.
 */
export function prefetchImages(
  urls: (string | number | undefined | null)[]
): void {
  if (!urls || urls.length === 0) return;

  urls.forEach((url) => {
    if (url && typeof url === "string" && url.trim().length > 0) {
      if (!prefetchedUrlsSet.has(url)) {
        prefetchedUrlsSet.add(url);
        Image.prefetch(url);
      }
    }
  });
}
