import { LogLevel, OneSignal } from "react-native-onesignal";

const ONE_SIGNAL_APP_ID = "3c6a4e60-74c6-430f-8800-6917385cb9b8";

let isOneSignalInitialized = false;
let pendingUserId: string | null = null;
let pendingTags: Record<string, string> = {};

/**
 * Inicializa o SDK do OneSignal de forma segura.
 * Deve ser chamado logo no boot da aplicação antes de interações com usuário/sessão.
 */
export function initOneSignal(): void {
  if (isOneSignalInitialized) {
    return;
  }

  try {
    // Configurar nível de log em desenvolvimento
    OneSignal.Debug.setLogLevel(__DEV__ ? LogLevel.Verbose : LogLevel.None);

    // Inicializar o OneSignal com o contexto nativo
    OneSignal.initialize(ONE_SIGNAL_APP_ID);
    isOneSignalInitialized = true;
    console.log("[OneSignal] SDK inicializado com sucesso.");

    // Se houve tentativa de login antes da inicialização, executa agora
    if (pendingUserId) {
      const uidToLogin = pendingUserId;
      pendingUserId = null;
      loginOneSignal(uidToLogin);
    }

    // Se houve tentativa de definir tags antes da inicialização, aplica agora
    if (Object.keys(pendingTags).length > 0) {
      const tagsToSync = { ...pendingTags };
      pendingTags = {};
      syncOneSignalTags(tagsToSync);
    }
  } catch (error: unknown) {
    console.error("[OneSignal] Erro crítico ao inicializar OneSignal:", error);
  }
}

/**
 * Realiza o login do usuário no OneSignal de forma protegida contra race conditions.
 * Se o SDK ainda não tiver sido inicializado com initWithContext, o UID é enfileirado.
 */
export function loginOneSignal(userId: string): void {
  if (!userId) {
    return;
  }

  if (!isOneSignalInitialized) {
    console.log("[OneSignal] SDK ainda não inicializado. Login enfileirado para UID:", userId);
    pendingUserId = userId;
    return;
  }

  try {
    OneSignal.login(userId);
    console.log("[OneSignal] Login sincronizado para UID:", userId);
  } catch (error: unknown) {
    console.warn("[OneSignal] Falha ao executar login:", error);
  }
}

/**
 * Realiza o logout do OneSignal de forma protegida.
 */
export function logoutOneSignal(): void {
  pendingUserId = null;

  if (!isOneSignalInitialized) {
    return;
  }

  try {
    OneSignal.logout();
    console.log("[OneSignal] Logout efetuado.");
  } catch (error: unknown) {
    console.warn("[OneSignal] Falha ao executar logout:", error);
  }
}

/**
 * Sincroniza tags de usuário com o OneSignal de forma protegida.
 */
export function syncOneSignalTags(tags: Record<string, string>): void {
  if (!tags || Object.keys(tags).length === 0) {
    return;
  }

  if (!isOneSignalInitialized) {
    pendingTags = { ...pendingTags, ...tags };
    return;
  }

  try {
    OneSignal.User.addTags(tags);
  } catch (error: unknown) {
    console.warn("[OneSignal] Falha ao sincronizar tags:", error);
  }
}

/**
 * Solicita permissão de notificações de forma protegida.
 */
export async function requestOneSignalPermission(): Promise<boolean> {
  if (!isOneSignalInitialized) {
    console.warn("[OneSignal] Tentativa de solicitar permissão antes da inicialização do SDK.");
    return false;
  }

  try {
    const granted = await OneSignal.Notifications.requestPermission(true);
    return Boolean(granted);
  } catch (error: unknown) {
    console.warn("[OneSignal] Falha ao solicitar permissão de notificações:", error);
    return false;
  }
}
