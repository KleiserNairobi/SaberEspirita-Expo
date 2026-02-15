import {
  getAnalytics,
  logEvent as firebaseLogEvent,
  logScreenView as firebaseLogScreenView,
} from "@react-native-firebase/analytics";

/**
 * Serviço centralizado para logging de eventos do Firebase Analytics
 */

/**
 * Loga uma visualização de tela
 * @param screenName Nome da tela (ex: "Estude", "Fixe", "Medite")
 * @param screenClass Classe da tela (opcional, ex: "StudyTab", "FixHome")
 */
export async function logScreenView(screenName: string, screenClass?: string) {
  try {
    const analytics = getAnalytics();
    await firebaseLogScreenView(analytics, {
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
export async function logEvent(eventName: string, params?: Record<string, any>) {
  try {
    const analytics = getAnalytics();
    await firebaseLogEvent(analytics, eventName, params);

    if (__DEV__) {
      console.log(`[Analytics] Event: ${eventName}`, params);
    }
  } catch (error) {
    if (__DEV__) {
      console.error(`[Analytics] Erro ao logar evento ${eventName}:`, error);
    }
  }
}
