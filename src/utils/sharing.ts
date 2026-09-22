import { Share } from "react-native";
import * as Sharing from "expo-sharing";
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

/**
 * Compartilha um arquivo PDF de certificado via sistema nativo de arquivos
 */
export async function shareCertificateFile(
  fileUri: string,
  courseTitle: string
): Promise<void> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/pdf",
        dialogTitle: `Certificado - ${courseTitle}`,
        UTI: "com.adobe.pdf",
      });
    } else {
      await Share.share({
        message: `Certificado de conclusão da série "${courseTitle}" no Saber Espírita.${SHARE_FOOTER}`,
        title: `Certificado - ${courseTitle}`,
      });
    }
  } catch (error) {
    console.error("Erro ao compartilhar arquivo de certificado:", error);
    throw error;
  }
}

/**
 * Compartilha um certificado usando Share nativo do React Native ou arquivo PDF
 */
export async function shareCertificate(
  urlOrUri: string,
  courseTitle: string
): Promise<void> {
  try {
    if (urlOrUri.startsWith("file://") || urlOrUri.startsWith("/")) {
      await shareCertificateFile(urlOrUri, courseTitle);
      return;
    }

    const message = `Concluí a série "${courseTitle}" no Saber Espírita!\nConfira meu certificado: ${urlOrUri}${SHARE_FOOTER}`;
    await Share.share({
      message,
      title: `Certificado - ${courseTitle}`,
    });
  } catch (error) {
    console.error("Erro ao compartilhar certificado:", error);
    throw error;
  }
}

