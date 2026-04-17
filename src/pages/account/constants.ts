import Constants from "expo-constants";
import { PLAY_STORE_URL, APP_STORE_URL } from "@/utils/constants";

export const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";
export const CONTACT_EMAIL = "app.saberespirita@gmail.com";
export const INSTAGRAM_URL = "https://instagram.com/comunidade.saberespirita";

export { PLAY_STORE_URL, APP_STORE_URL };

export const SHARE_MESSAGE = `📚✨ Descubra o Saber Espírita!

Um aplicativo completo para estudar e aprofundar seus conhecimentos sobre o Espiritismo. Cursos, quizzes, meditações e muito mais!

🤖 Android: ${PLAY_STORE_URL}

🍎 iOS: ${APP_STORE_URL}

Baixe agora e comece sua jornada de aprendizado! 💙`;

export const ALERTS = {
  faq: {
    title: "FAQ",
    message: "Página de perguntas frequentes em desenvolvimento.",
  },
  terms: {
    title: "Termos de Uso",
    message: "Página de termos em desenvolvimento.",
  },
  privacy: {
    title: "Política de Privacidade",
    message: "Página de privacidade em desenvolvimento.",
  },
  logout: {
    title: "Sair",
    message: "Tem certeza que deseja sair da sua conta?",
    confirmText: "Sair",
    cancelText: "Cancelar",
  },
} as const;
