import { logEvent as firebaseLogEvent } from "firebase/analytics";
import { analytics } from "@/configs/firebase/firebase";

/**
 * Serviço centralizado para logging de eventos do Firebase Analytics
 */

/**
 * Loga uma visualização de tela
 * @param screenName Nome da tela (ex: "Estude", "Fixe", "Medite")
 * @param screenClass Classe da tela (opcional, ex: "StudyTab", "FixHome")
 */
export function logScreenView(screenName: string, screenClass?: string) {
  if (!analytics) {
    if (__DEV__) {
      console.log(`[Analytics] Screen view (não enviado): ${screenName}`);
    }
    return;
  }

  try {
    // @ts-ignore - analytics pode ser null mas já verificamos acima
    firebaseLogEvent(analytics, "screen_view", {
      screen_name: screenName,
      screen_class: screenClass || screenName,
    });

    if (__DEV__) {
      console.log(`[Analytics] Screen view: ${screenName}`, {
        screen_class: screenClass,
      });
    }
  } catch (error) {
    if (__DEV__) {
      console.error("[Analytics] Erro ao logar screen_view:", error);
    }
  }
}

/**
 * Loga um evento customizado
 * @param eventName Nome do evento
 * @param params Parâmetros do evento (opcional)
 */
export function logEvent(eventName: string, params?: Record<string, any>) {
  if (!analytics) {
    if (__DEV__) {
      console.log(`[Analytics] Event (não enviado): ${eventName}`, params);
    }
    return;
  }

  try {
    // @ts-ignore - analytics pode ser null mas já verificamos acima
    firebaseLogEvent(analytics, eventName, params);

    if (__DEV__) {
      console.log(`[Analytics] Event: ${eventName}`, params);
    }
  } catch (error) {
    if (__DEV__) {
      console.error(`[Analytics] Erro ao logar evento ${eventName}:`, error);
    }
  }
}
