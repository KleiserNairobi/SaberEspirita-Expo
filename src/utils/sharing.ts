import { Share } from "react-native";
import { IPrayer } from "@/types/prayer";
import { IReflection } from "@/types/reflection";
import { SHARE_FOOTER } from "./constants";

/**
 * Compartilha uma oração usando Share nativo do React Native
 */
export async function sharePrayer(prayer: IPrayer): Promise<void> {
  try {
    const message = `${prayer.title}\n\n${prayer.content}\n\n${
      prayer.author ? `- ${prayer.author}` : ""
    }${prayer.source ? `\nFonte: ${prayer.source}` : ""}${SHARE_FOOTER}`;

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
      SHARE_FOOTER,
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
