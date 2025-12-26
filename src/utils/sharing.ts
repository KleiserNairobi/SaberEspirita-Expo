import { Share } from "react-native";
import { Paths } from "expo-file-system";

import { IPrayer } from "@/types/prayer";
import { IReflection } from "@/types/reflection";

/**
 * Compartilha uma oração usando Share nativo do React Native
 */
export async function sharePrayer(prayer: IPrayer): Promise<void> {
  try {
    const message = `${prayer.title}\n\n${prayer.content}\n\n${
      prayer.author ? `- ${prayer.author}` : ""
    }${prayer.source ? `\nFonte: ${prayer.source}` : ""}\n\nCompartilhado via App Saber Espírita`;

    await Share.share({
      message,
      title: prayer.title,
    });
  } catch (error) {
    console.error("Erro ao compartilhar oração:", error);
    throw error;
  }
}

/**
 * Compartilha uma oração criando um arquivo temporário
 * (Alternativa usando expo-file-system se necessário no futuro)
 */
export async function sharePrayerAsFile(prayer: IPrayer): Promise<void> {
  try {
    const message = `${prayer.title}\n\n${prayer.content}\n\n${
      prayer.author ? `- ${prayer.author}` : ""
    }${prayer.source ? `\nFonte: ${prayer.source}` : ""}\n\nCompartilhado via App Saber Espírita`;

    // Criar arquivo no cache directory
    const file = await Paths.cache.createFile(`prayer_${prayer.id}.txt`, "text/plain");

    await file.write(message);

    // Compartilhar o arquivo
    await Share.share({
      url: file.uri,
      title: prayer.title,
    });

    // Limpar arquivo temporário após compartilhar
    await file.delete();
  } catch (error) {
    console.error("Erro ao compartilhar oração como arquivo:", error);
    throw error;
  }
}

/**
 * Compartilha uma reflexão usando Share nativo do React Native
 */
export async function shareReflection(reflection: IReflection): Promise<void> {
  try {
    const parts = [
      reflection.title,
      reflection.subtitle ? `\n${reflection.subtitle}` : "",
      `\n\n${reflection.content}`,
      reflection.author ? `\n\n- ${reflection.author}` : "",
      reflection.source ? `\nFonte: ${reflection.source}` : "",
      "\n\nCompartilhado via App Saber Espírita",
    ];

    const message = parts.filter(Boolean).join("");

    await Share.share({
      message,
      title: reflection.title,
    });
  } catch (error) {
    console.error("Erro ao compartilhar reflexão:", error);
    throw error;
  }
}
