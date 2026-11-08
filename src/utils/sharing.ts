import { Share } from "react-native";
import * as Sharing from "expo-sharing";

import { logEvent as analyticsLogEvent } from "@/services/analytics/analyticsService";
import { statsApiService } from "@/services/api/statsApiService";
import { ICourse } from "@/types/course";
import { IDailyWisdom } from "@/types/dailyWisdom";
import { IGlossaryTerm } from "@/types/glossary";
import { IMeditation } from "@/types/meditate";
import { IPodcast } from "@/types/podcast";
import { IPrayer } from "@/types/prayer";
import { IReflection } from "@/types/reflection";

import { APP_STORE_URL, PLAY_STORE_URL, SHARE_FOOTER } from "./constants";

export type ShareContentType =
  | "prayer"
  | "reflection"
  | "daily_wisdom"
  | "course"
  | "lesson"
  | "podcast"
  | "meditation"
  | "glossary_term"
  | "certificate"
  | "app_invite"
  | "ai_chat";

export interface ShareOptions {
  type: ShareContentType;
  id?: string;
  title: string;
  message: string;
  url?: string;
  dialogTitle?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Função central de compartilhamento.
 * Dispara o Share nativo e registra automaticamente a telemetria no Firebase Analytics
 * e na API de estatísticas do backend (PostgreSQL).
 */
export async function shareContent(options: ShareOptions): Promise<void> {
  try {
    const result = await Share.share(
      {
        message: options.message,
        title: options.title,
        url: options.url,
      },
      {
        dialogTitle: options.dialogTitle || options.title,
      }
    );

    if (result.action === Share.sharedAction) {
      const activityType = result.activityType || "native_share";

      // 1. Firebase Analytics (Evento oficial "share")
      analyticsLogEvent("share", {
        content_type: options.type,
        item_id: options.id || "general",
        method: activityType,
      });

      // 2. Backend REST API (/logs/event)
      statsApiService.logEvent({
        eventName: "share",
        category: options.type,
        id: options.id,
        title: options.title,
        metadata: {
          activityType,
          ...(options.metadata || {}),
        },
      });
    } else if (result.action === Share.dismissedAction) {
      analyticsLogEvent("share_dismissed", {
        content_type: options.type,
        item_id: options.id || "general",
      });
    }
  } catch (error) {
    console.error(`Erro ao compartilhar conteúdo [${options.type}]:`, error);
    throw error;
  }
}

/**
 * Compartilha uma oração com telemetria automática.
 */
export async function sharePrayer(prayer: IPrayer): Promise<void> {
  const message = `${prayer.title}\n\n${prayer.content}\n\n${
    prayer.author ? `- ${prayer.author}` : ""
  }${prayer.source ? `\nFonte: ${prayer.source}` : ""}${SHARE_FOOTER}`;

  await shareContent({
    type: "prayer",
    id: prayer.id,
    title: prayer.title,
    message,
    metadata: {
      author: prayer.author,
      source: prayer.source,
    },
  });
}

/**
 * Compartilha uma reflexão com telemetria automática.
 */
export async function shareReflection(reflection: IReflection): Promise<void> {
  const parts = [
    reflection.title,
    reflection.subtitle ? `\n${reflection.subtitle}` : "",
    `\n\n${reflection.content}`,
    reflection.author ? `\n\n- ${reflection.author}` : "",
    reflection.source ? `\nFonte: ${reflection.source}` : "",
    SHARE_FOOTER,
  ];

  await shareContent({
    type: "reflection",
    id: reflection.id,
    title: reflection.title,
    message: parts.filter(Boolean).join(""),
    metadata: {
      author: reflection.author,
      source: reflection.source,
      topic: reflection.topic,
    },
  });
}

/**
 * Compartilha uma Gota de Sabedoria com telemetria automática.
 */
export async function shareDailyWisdom(wisdom: IDailyWisdom): Promise<void> {
  const sanitizedQuote = wisdom.openingQuote
    ? `"${wisdom.openingQuote.replace(/\\n/g, "\n")}"\n\n`
    : "";
  const sanitizedContent = wisdom.content ? wisdom.content.replace(/\\n/g, "\n") : "";
  const message = `${wisdom.title}\n${sanitizedQuote}${sanitizedContent}\n\n— ${
    wisdom.author
  }${wisdom.bookReference ? ` (${wisdom.bookReference})` : ""}${SHARE_FOOTER}`;

  await shareContent({
    type: "daily_wisdom",
    id: wisdom.id,
    title: wisdom.title,
    message,
    metadata: {
      moment: wisdom.moment,
      author: wisdom.author,
    },
  });
}

/**
 * Compartilha um termo do glossário com telemetria automática.
 */
export async function shareGlossaryTerm(term: IGlossaryTerm): Promise<void> {
  const referencesText =
    term.references && term.references.length > 0
      ? `\n\nReferências:\n${term.references.join("\n")}`
      : "";
  const message = `${term.term}\n\n${term.definition}${referencesText}${SHARE_FOOTER}`;

  await shareContent({
    type: "glossary_term",
    id: term.id,
    title: term.term,
    message,
    metadata: { category: term.category },
  });
}

/**
 * Compartilha um curso/série com telemetria automática.
 */
export async function shareCourse(course: ICourse): Promise<void> {
  const parts = [
    `Conheça a série de estudos "${course.title}" no Saber Espírita!`,
  ];
  if (course.description) {
    parts.push(`\nSobre o Curso:\n${course.description}`);
  }
  parts.push("\nBaixe o app e comece a estudar agora mesmo:");
  parts.push(`🤖 Android: ${PLAY_STORE_URL}`);
  parts.push(`🍎 iOS: ${APP_STORE_URL}`);

  await shareContent({
    type: "course",
    id: course.id,
    title: course.title,
    message: parts.join("\n"),
    metadata: {
      lessonCount: course.lessonCount,
      difficultyLevel: course.difficultyLevel,
    },
  });
}

/**
 * Compartilha um slide/aula de um curso com telemetria automática.
 */
export async function shareLessonSlide(
  slideTitle: string,
  content: string,
  lessonId?: string,
  highlights?: { title: string; content: string }[]
): Promise<void> {
  let shareMessage = `${slideTitle}\n\n${content}`;
  if (highlights?.length) {
    shareMessage +=
      "\n\n💡 Destaques:\n" +
      highlights.map((h) => `• ${h.title}: ${h.content}`).join("\n");
  }
  shareMessage += SHARE_FOOTER;

  await shareContent({
    type: "lesson",
    id: lessonId,
    title: slideTitle,
    message: shareMessage,
  });
}

/**
 * Compartilha um podcast com telemetria automática.
 */
export async function sharePodcast(podcast: IPodcast): Promise<void> {
  const parts = [
    `Ouça o episódio "${podcast.title}" do podcast Saber Espírita!`,
  ];
  if (podcast.description) {
    parts.push(`\nSobre o Episódio:\n${podcast.description}`);
  }
  parts.push("\nBaixe o app e ouça agora mesmo:");
  parts.push(`🤖 Android: ${PLAY_STORE_URL}`);
  parts.push(`🍎 iOS: ${APP_STORE_URL}`);

  await shareContent({
    type: "podcast",
    id: podcast.id,
    title: podcast.title,
    message: parts.join("\n"),
    metadata: {
      author: podcast.author,
      durationMinutes: podcast.durationMinutes,
    },
  });
}

/**
 * Compartilha uma meditação guiada com telemetria automática.
 */
export async function shareMeditation(meditation: IMeditation): Promise<void> {
  const parts = [
    `Confira a meditação guiada "${meditation.title}" no Saber Espírita!`,
  ];
  if (meditation.description) {
    parts.push(`\nSobre esta Meditação:\n${meditation.description}`);
  }
  parts.push("\nBaixe o app e ouça agora mesmo:");
  parts.push(`🤖 Android: ${PLAY_STORE_URL}`);
  parts.push(`🍎 iOS: ${APP_STORE_URL}`);

  await shareContent({
    type: "meditation",
    id: meditation.id,
    title: meditation.title,
    message: parts.join("\n"),
    metadata: {
      durationMinutes: meditation.durationMinutes,
      categoryId: meditation.categoryId,
    },
  });
}

/**
 * Compartilha convite do aplicativo com telemetria automática.
 */
export async function shareAppInvite(message: string): Promise<void> {
  await shareContent({
    type: "app_invite",
    title: "Saber Espírita",
    message,
  });
}

/**
 * Compartilha uma mensagem de chat/assistente com telemetria automática.
 */
export async function shareChatMessage(
  text: string,
  title = "Resposta do Assistente",
  origin = "direct"
): Promise<void> {
  const message = `${title}:\n\n${text}\n\n---${SHARE_FOOTER}`;

  await shareContent({
    type: "ai_chat",
    title,
    message,
    metadata: { origin },
  });
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

      analyticsLogEvent("share", {
        content_type: "certificate",
        item_id: courseTitle,
        method: "pdf_file",
      });

      statsApiService.logEvent({
        eventName: "share",
        category: "certificate",
        title: courseTitle,
        metadata: { format: "pdf" },
      });
    } else {
      await shareContent({
        type: "certificate",
        title: `Certificado - ${courseTitle}`,
        message: `Certificado de conclusão da série "${courseTitle}" no Saber Espírita.${SHARE_FOOTER}`,
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
    await shareContent({
      type: "certificate",
      title: `Certificado - ${courseTitle}`,
      message,
      url: urlOrUri,
    });
  } catch (error) {
    console.error("Erro ao compartilhar certificado:", error);
    throw error;
  }
}
