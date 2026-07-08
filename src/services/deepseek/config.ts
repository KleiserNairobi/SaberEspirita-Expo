import OpenAI from "openai";
// @ts-ignore
import { fetch as expoFetch } from "expo/fetch";

/**
 * Cliente OpenAI configurado para a API DeepSeek.
 *
 * ATENÇÃO: Este cliente é mantido para uso direto via streaming (streamDeepSeekChat).
 * A API Key é lida de EXPO_PUBLIC_DEEPSEEK_API_KEY apenas em desenvolvimento local.
 * Em produção, as chamadas devem passar pelo proxy seguro (services/deepseek/proxy.ts),
 * que usa a Cloud Function deepseekProxy onde a chave está protegida no servidor.
 */
export const deepSeekClient = new OpenAI({
  // Em produção a key fica vazia pois as chamadas passam pelo proxy Firebase.
  // Em dev local pode ser preenchida via .env para testes diretos sem o emulator.
  apiKey: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || "placeholder-use-proxy",
  baseURL: process.env.EXPO_PUBLIC_DEEPSEEK_API_URL || "https://api.deepseek.com/v1",
  dangerouslyAllowBrowser: true, // Necessário para Expo
  fetch: expoFetch as any, // Polyfill para suportar streaming
});
